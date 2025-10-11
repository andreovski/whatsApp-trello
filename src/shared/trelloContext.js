import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useAppStore } from "./store.js";
import { createTemplate as buildTemplate } from "./templateUtils.js";
import {
  getTemplateFileHandle,
  saveTemplateFileHandle,
  clearTemplateFileHandle,
} from "./templateFileHandleStorage.js";

const TrelloContext = createContext(null);

function useStore(selector) {
  return useAppStore(selector);
}

function scheduleIdleResetFactory(setStatus) {
  const timeoutRef = { current: null };

  const schedule = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setStatus("idle");
      timeoutRef.current = null;
    }, 3000);
  };

  const dispose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return { schedule, dispose };
}

export function TrelloProvider({ children }) {
  const config = useStore((state) => state.config);
  const loadConfig = useStore((state) => state.loadConfig);
  const saveConfig = useStore((state) => state.saveConfig);
  const status = useStore((state) => state.status);
  const setStatus = useStore((state) => state.setStatus);
  const error = useStore((state) => state.error);
  const setError = useStore((state) => state.setError);
  const noteTemplates = useStore((state) => state.noteTemplates);
  const loadNoteTemplates = useStore((state) => state.loadNoteTemplates);
  const saveNoteTemplates = useStore((state) => state.saveNoteTemplates);
  const loadingTemplates = useStore((state) => state.loadingTemplates);

  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(false);
  const lastListsFetchKeyRef = useRef(null);
  const listsCacheRef = useRef([]);
  const { schedule: scheduleIdleReset, dispose: disposeIdleReset } = useMemo(
    () => scheduleIdleResetFactory(setStatus),
    [setStatus]
  );

  const isConfigReady = useMemo(
    () => Boolean(config?.apiKey && config?.apiToken && config?.boardId),
    [config?.apiKey, config?.apiToken, config?.boardId]
  );

  const fetchLists = useCallback(
    async ({ force = false } = {}) => {
      if (!config?.apiKey || !config?.apiToken || !config?.boardId) {
        listsCacheRef.current = [];
        setLists([]);
        lastListsFetchKeyRef.current = null;
        return { ok: true, lists: [] };
      }

      const fetchKey = `${config.apiKey}|${config.apiToken}|${config.boardId}`;

      if (!force && lastListsFetchKeyRef.current === fetchKey) {
        return { ok: true, lists: listsCacheRef.current };
      }

      setListsLoading(true);

      try {
        const response = await chrome.runtime.sendMessage({
          type: "trello:get-lists",
        });

        if (!response?.ok) {
          throw new Error(
            response?.error ?? "Falha ao carregar listas do Trello."
          );
        }

        const fetchedLists = response.lists ?? [];
        listsCacheRef.current = fetchedLists;
        setLists(fetchedLists);
        lastListsFetchKeyRef.current = fetchKey;
        return { ok: true, lists: fetchedLists };
      } catch (err) {
        console.error("Erro carregando listas do Trello", err);
        listsCacheRef.current = [];
        setLists([]);
        lastListsFetchKeyRef.current = null;
        return { ok: false, error: err };
      } finally {
        setListsLoading(false);
      }
    },
    [config?.apiKey, config?.apiToken, config?.boardId]
  );

  const refreshLists = useCallback(
    ({ force = true } = {}) => fetchLists({ force }),
    [fetchLists]
  );

  const createCard = useCallback(
    async ({
      title,
      summary,
      recentMessages,
      generatedAt,
      urlSource,
      listId,
    }) => {
      if (!listId) {
        const message =
          "Selecione uma lista válida antes de criar o card no Trello.";
        setError(message);
        setStatus("error");
        scheduleIdleReset();
        return { ok: false, error: message };
      }

      setStatus("loading");
      setError(null);

      try {
        const response = await chrome.runtime.sendMessage({
          type: "trello:create-card",
          payload: {
            title,
            summary,
            recentMessages,
            generatedAt,
            urlSource,
            listId,
          },
        });

        if (!response?.ok) {
          throw new Error(response?.error ?? "Erro desconhecido ao criar card");
        }

        if (listId) {
          await saveConfig({ lastListId: listId });
        }

        setStatus("success");
        scheduleIdleReset();
        return { ok: true, result: response.result };
      } catch (err) {
        console.error("Erro criando card Trello", err);
        setError(err.message);
        setStatus("error");
        scheduleIdleReset();
        return { ok: false, error: err.message };
      }
    },
    [saveConfig, scheduleIdleReset, setError, setStatus]
  );

  const getRecentCards = useCallback(async ({ limit = 5, listId } = {}) => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "trello:get-recent-cards",
        payload: { limit, listId },
      });

      if (!response?.ok) {
        throw new Error(
          response?.error ?? "Falha ao carregar os cards recentes do Trello."
        );
      }

      return { ok: true, cards: response.cards ?? [] };
    } catch (err) {
      console.error("Erro ao obter cards recentes do Trello", err);
      return { ok: false, error: err };
    }
  }, []);

  const setPreferredList = useCallback(
    async (listId) => {
      if (!listId) return;
      try {
        await saveConfig({ lastListId: listId });
      } catch (err) {
        console.error("Erro ao salvar lista padrão do Trello", err);
      }
    },
    [saveConfig]
  );

  const ensureTemplateFileHandle = useCallback(async () => {
    if (config?.templateSourceType !== "file") {
      throw new Error(
        "Selecione um arquivo de templates nas configurações antes de cadastrar novos modelos."
      );
    }

    const handle = await getTemplateFileHandle();

    if (!handle) {
      throw new Error(
        "Reabra as configurações e selecione novamente o arquivo de templates para permitir edições."
      );
    }

    let permission = await handle.queryPermission({ mode: "readwrite" });
    if (permission === "prompt") {
      permission = await handle.requestPermission({ mode: "readwrite" });
    }

    if (permission !== "granted") {
      throw new Error(
        "Permissão de escrita negada para o arquivo de templates selecionado."
      );
    }

    return handle;
  }, [config?.templateSourceType]);

  const persistTemplatesToFile = useCallback(
    async (templates) => {
      const handle = await ensureTemplateFileHandle();

      try {
        const writable = await handle.createWritable();
        const payload = `${JSON.stringify(templates, null, 2)}\n`;
        await writable.write(payload);
        await writable.close();

        await saveTemplateFileHandle(handle);

        let fileName = config?.templateSourcePath || "templates.json";
        try {
          const file = await handle.getFile();
          fileName = file.name || fileName;
        } catch (error) {
          console.warn("Não foi possível obter o nome do arquivo", error);
        }

        await saveConfig({
          templateSourceUpdatedAt: new Date().toISOString(),
          templateSourceName: fileName,
          templateSourcePath: fileName,
        });
      } catch (error) {
        await clearTemplateFileHandle().catch((cleanupError) => {
          console.error("Falha ao limpar handle de template", cleanupError);
        });
        throw error;
      }
    },
    [config?.templateSourcePath, ensureTemplateFileHandle, saveConfig]
  );

  const createTemplate = useCallback(
    async ({ label, notes }) => {
      try {
        const template = buildTemplate({ label, notes });
        const currentTemplates = Array.isArray(noteTemplates)
          ? [...noteTemplates, template]
          : [template];

        await persistTemplatesToFile(currentTemplates);
        await saveNoteTemplates(currentTemplates);

        return { ok: true, template };
      } catch (error) {
        console.error("Erro ao criar template", error);
        return {
          ok: false,
          error: error?.message ?? "Falha ao criar template.",
        };
      }
    },
    [noteTemplates, persistTemplatesToFile, saveNoteTemplates]
  );

  useEffect(() => {
    loadConfig();
    loadNoteTemplates();
  }, [loadConfig, loadNoteTemplates]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  useEffect(() => () => disposeIdleReset(), [disposeIdleReset]);

  const value = useMemo(
    () => ({
      config,
      loadConfig,
      saveConfig,
      status,
      setStatus,
      error,
      setError,
      createCard,
      lists,
      listsLoading,
      refreshLists,
      getRecentCards,
      isConfigReady,
      setPreferredList,
      noteTemplates,
      loadNoteTemplates,
      saveNoteTemplates,
      loadingTemplates,
      createTemplate,
    }),
    [
      config,
      loadConfig,
      saveConfig,
      status,
      setStatus,
      error,
      setError,
      createCard,
      lists,
      listsLoading,
      refreshLists,
      getRecentCards,
      isConfigReady,
      setPreferredList,
      noteTemplates,
      loadNoteTemplates,
      saveNoteTemplates,
      loadingTemplates,
      createTemplate,
    ]
  );

  return React.createElement(TrelloContext.Provider, { value }, children);
}

TrelloProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTrello() {
  const context = useContext(TrelloContext);
  if (!context) {
    throw new Error("useTrello deve ser usado dentro de um TrelloProvider");
  }
  return context;
}
