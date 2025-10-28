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
  const [boards, setBoards] = useState([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const lastBoardsFetchKeyRef = useRef(null);
  const boardsCacheRef = useRef([]);
  const [labels, setLabels] = useState([]);
  const [labelsLoading, setLabelsLoading] = useState(false);
  const labelsCacheRef = useRef([]);
  const lastLabelsFetchKeyRef = useRef(null);
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

  const fetchBoards = useCallback(
    async ({ force = false } = {}) => {
      if (!config?.apiKey || !config?.apiToken) {
        boardsCacheRef.current = [];
        setBoards([]);
        lastBoardsFetchKeyRef.current = null;
        return { ok: true, boards: [] };
      }

      const fetchKey = `${config.apiKey}|${config.apiToken}`;

      if (!force && lastBoardsFetchKeyRef.current === fetchKey) {
        return { ok: true, boards: boardsCacheRef.current };
      }

      setBoardsLoading(true);

      try {
        const response = await chrome.runtime.sendMessage({
          type: "trello:get-boards",
        });

        if (!response?.ok) {
          throw new Error(
            response?.error ?? "Falha ao carregar boards do Trello."
          );
        }

        const fetchedBoards = response.boards ?? [];
        boardsCacheRef.current = fetchedBoards;
        setBoards(fetchedBoards);
        lastBoardsFetchKeyRef.current = fetchKey;
        return { ok: true, boards: fetchedBoards };
      } catch (err) {
        console.error("Erro carregando boards do Trello", err);
        boardsCacheRef.current = [];
        setBoards([]);
        lastBoardsFetchKeyRef.current = null;
        return { ok: false, error: err };
      } finally {
        setBoardsLoading(false);
      }
    },
    [config?.apiKey, config?.apiToken]
  );

  const refreshBoards = useCallback(
    ({ force = true } = {}) => fetchBoards({ force }),
    [fetchBoards]
  );

  const refreshLists = useCallback(
    ({ force = true } = {}) => fetchLists({ force }),
    [fetchLists]
  );

  const fetchLabels = useCallback(
    async ({ force = false } = {}) => {
      if (!config?.apiKey || !config?.apiToken || !config?.boardId) {
        labelsCacheRef.current = [];
        setLabels([]);
        lastLabelsFetchKeyRef.current = null;
        return { ok: true, labels: [] };
      }

      const fetchKey = `${config.apiKey}|${config.apiToken}|${config.boardId}`;

      if (!force && lastLabelsFetchKeyRef.current === fetchKey) {
        return { ok: true, labels: labelsCacheRef.current };
      }

      setLabelsLoading(true);

      try {
        const response = await chrome.runtime.sendMessage({
          type: "trello:get-labels",
        });

        if (!response?.ok) {
          throw new Error(
            response?.error ?? "Falha ao carregar etiquetas do Trello."
          );
        }

        const fetchedLabels = response.labels ?? [];
        labelsCacheRef.current = fetchedLabels;
        setLabels(fetchedLabels);
        lastLabelsFetchKeyRef.current = fetchKey;
        return { ok: true, labels: fetchedLabels };
      } catch (err) {
        console.error("Erro carregando etiquetas do Trello", err);
        labelsCacheRef.current = [];
        setLabels([]);
        lastLabelsFetchKeyRef.current = null;
        return { ok: false, error: err };
      } finally {
        setLabelsLoading(false);
      }
    },
    [config?.apiKey, config?.apiToken, config?.boardId]
  );

  const refreshLabels = useCallback(
    ({ force = true } = {}) => fetchLabels({ force }),
    [fetchLabels]
  );

  const createCard = useCallback(
    async ({
      title,
      summary,
      recentMessages,
      generatedAt,
      urlSource,
      listId,
      attachment,
      labelIds,
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
        let serializedAttachment = null;

        if (attachment) {
          try {
            if (typeof attachment.arrayBuffer === "function") {
              const data = await attachment.arrayBuffer();
              serializedAttachment = {
                name: attachment.name,
                type: attachment.type,
                size: attachment.size,
                data: Array.from(new Uint8Array(data)),
              };
            } else if (attachment?.data) {
              serializedAttachment = attachment;
            }
          } catch (fileError) {
            console.error("Erro ao preparar anexo antes do envio", fileError);
            throw new Error("Não foi possível ler o arquivo selecionado.");
          }
        }

        const response = await chrome.runtime.sendMessage({
          type: "trello:create-card",
          payload: {
            title,
            summary,
            recentMessages,
            generatedAt,
            urlSource,
            listId,
            attachment: serializedAttachment,
            labelIds,
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

  const createTemplate = useCallback(
    async ({ label, notes }) => {
      try {
        const template = buildTemplate({ label, notes });
        const currentTemplates = Array.isArray(noteTemplates)
          ? [...noteTemplates, template]
          : [template];
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
    [noteTemplates, saveNoteTemplates]
  );

  const removeTemplate = useCallback(
    async (templateId) => {
      if (!templateId) {
        return { ok: false, error: "Template inválido." };
      }

      try {
        const currentTemplates = Array.isArray(noteTemplates)
          ? noteTemplates
          : [];

        const exists = currentTemplates.some((tpl) => tpl.id === templateId);

        if (!exists) {
          return { ok: false, error: "Template não encontrado." };
        }

        const updated = currentTemplates.filter(
          (template) => template.id !== templateId
        );

        await saveNoteTemplates(updated);

        return { ok: true };
      } catch (error) {
        console.error("Erro ao remover template", error);
        return {
          ok: false,
          error: error?.message ?? "Falha ao remover template.",
        };
      }
    },
    [noteTemplates, saveNoteTemplates]
  );

  useEffect(() => {
    loadConfig();
    loadNoteTemplates();
  }, [loadConfig, loadNoteTemplates]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    fetchLabels();
  }, [fetchLabels]);

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
      boards,
      boardsLoading,
      fetchBoards,
      refreshBoards,
      labels,
      labelsLoading,
      fetchLabels,
      refreshLabels,
      getRecentCards,
      isConfigReady,
      setPreferredList,
      noteTemplates,
      loadNoteTemplates,
      saveNoteTemplates,
      loadingTemplates,
      createTemplate,
      removeTemplate,
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
      boards,
      boardsLoading,
      fetchBoards,
      refreshBoards,
      labels,
      labelsLoading,
      fetchLabels,
      refreshLabels,
      getRecentCards,
      isConfigReady,
      setPreferredList,
      noteTemplates,
      loadNoteTemplates,
      saveNoteTemplates,
      loadingTemplates,
      createTemplate,
      removeTemplate,
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
