import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTrello } from "../../../shared/trelloContext";
import { classes } from "../../styles";
import { CheckFileIcon } from "../../components/icons";

const STATUS_LABELS = {
  idle: "Pronto",
  loading: "Enviando…",
  success: "Card criado! ✅",
  error: "Erro ao criar card.",
};

const EMPTY_FORM = Object.freeze({
  title: "",
  summary: "",
  notes: "",
  listId: "",
});

export function CreateCard({ onCardCreated, onRequireConfig }) {
  const {
    config,
    status,
    error,
    setError,
    createCard,
    lists,
    setPreferredList,
    noteTemplates,
    isConfigReady,
  } = useTrello();

  const [values, setValues] = useState(() => ({ ...EMPTY_FORM }));

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      listId: config?.lastListId ?? prev.listId,
    }));
  }, [config?.lastListId]);

  const applyFallbackList = useCallback(
    (listId) => {
      if (!listId) return;
      setValues((prev) => {
        if (prev.listId === listId) {
          return prev;
        }
        return { ...prev, listId };
      });
      setPreferredList(listId);
    },
    [setPreferredList]
  );

  useEffect(() => {
    if (!lists?.length) {
      setValues((prev) => {
        if (!prev.listId) {
          return prev;
        }
        return { ...prev, listId: "" };
      });
      return;
    }

    const preferred = lists.find((list) => list.id === config?.lastListId);
    if (preferred) {
      setValues((prev) => {
        if (prev.listId === preferred.id) {
          return prev;
        }
        return { ...prev, listId: preferred.id };
      });
      return;
    }

    const fallbackId = lists[0]?.id ?? "";
    if (!fallbackId) {
      return;
    }

    const hasValidList = lists.some((list) => list.id === values.listId);
    if (!hasValidList) {
      applyFallbackList(fallbackId);
    }
  }, [lists, config?.lastListId, values.listId, applyFallbackList]);

  const statusLabel = STATUS_LABELS[status] ?? STATUS_LABELS.idle;

  const isFormValid = useMemo(
    () =>
      Boolean(values.title.trim()) && Boolean(values.listId) && isConfigReady,
    [values.title, values.listId, isConfigReady]
  );

  const handleChange = useCallback(
    (field, value) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (field === "listId" && value) {
        setPreferredList(value);
      }
      if (error) {
        setError(null);
      }
    },
    [error, setError, setPreferredList]
  );

  const handleApplyTemplate = useCallback(
    (template) => {
      if (!template?.notes) return;
      setValues((prev) => ({ ...prev, notes: template.notes }));
      if (error) {
        setError(null);
      }
    },
    [error, setError]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault?.();

      if (!isFormValid) {
        if (!isConfigReady && onRequireConfig) {
          onRequireConfig();
        }
        return;
      }

      const recentMessages = values.notes
        .split("\n")
        .map((msg) => msg.trim())
        .filter(Boolean);

      const payload = {
        title: values.title.trim() || "Card sem título",
        summary: values.summary.trim(),
        recentMessages,
        generatedAt: new Date().toISOString(),
        urlSource: window.location.href,
        listId: values.listId,
      };

      const result = await createCard(payload);

      if (result.ok) {
        if (onCardCreated) {
          onCardCreated(result.result ?? null);
        }
      }
    },
    [
      createCard,
      isConfigReady,
      isFormValid,
      onCardCreated,
      onRequireConfig,
      values,
    ]
  );

  return (
    <main className="flex flex-1 flex-col gap-4 overflow-y-auto text-sm leading-relaxed p-3">
      <form
        className={`${classes.card} flex-col gap-4`}
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-2 ">
          <span className="font-medium  text-neutral-700 dark:text-neutral-300">
            Título do card
          </span>
          <input
            type="text"
            value={values.title}
            className={classes.input}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="Nome do card no Trello"
          />
        </label>
        <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="font-medium">Lista do Trello</span>
          <select
            value={values.listId}
            className={classes.input}
            onChange={(event) => handleChange("listId", event.target.value)}
          >
            <option value="">Selecione uma lista...</option>
            {lists?.map((list) => (
              <option key={list.id} value={list.id}>
                {list.boardName
                  ? `${list.boardName} / ${list.name}`
                  : list.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="font-medium">Observações</span>
          <textarea
            rows={3}
            value={values.summary}
            onChange={(event) => handleChange("summary", event.target.value)}
            placeholder="Observações resumidas"
            className={classes.input}
          />
        </label>

        <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="font-medium">Descrição</span>

          {!!noteTemplates.length && (
            <span className="text-sm text-neutral-500">
              Templates disponíveis
            </span>
          )}

          {!!noteTemplates?.length && (
            <section className="flex gap-2 pb-1 mx-1 overflow-x-auto max-w-[310px]">
              {noteTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleApplyTemplate?.(template)}
                  className="flex-shrink-0 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-primary/40 dark:border-primary/30 dark:bg-primary/20 dark:hover:bg-primary/30"
                >
                  {template.label}
                </button>
              ))}
            </section>
          )}

          <textarea
            rows={6}
            value={values.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            className={classes.input}
          />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Cada linha será adicionada como um item no card.
          </span>
        </label>
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <p
              className={
                status === "success"
                  ? "text-primary"
                  : status === "error"
                  ? "text-red-500"
                  : "text-neutral-500 dark:text-neutral-300"
              }
            >
              {statusLabel}
            </p>
            {error && <p className="mt-1 text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className={classes.primaryButton}
            disabled={!isFormValid || status === "loading"}
          >
            <CheckFileIcon className="h-5 w-5" />
            Criar card no Trello
          </button>
        </div>
      </form>
    </main>
  );
}

CreateCard.propTypes = {
  onCardCreated: PropTypes.func,
  onRequireConfig: PropTypes.func,
};

CreateCard.defaultProps = {
  onCardCreated: undefined,
  onRequireConfig: undefined,
};
