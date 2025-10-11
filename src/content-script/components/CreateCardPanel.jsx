import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CardForm } from "./CardForm.jsx";
import { useTrello } from "../../shared/trelloContext.js";

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

export function CreateCardPanel({ onCardCreated, onRequireConfig }) {
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
    <CardForm
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      statusLabel={statusLabel}
      status={status}
      error={error}
      isSubmitting={status === "loading"}
      isFormValid={isFormValid}
      lists={lists}
      noteTemplates={noteTemplates}
      onApplyTemplate={handleApplyTemplate}
    />
  );
}

CreateCardPanel.propTypes = {
  onCardCreated: PropTypes.func,
  onRequireConfig: PropTypes.func,
};

CreateCardPanel.defaultProps = {
  onCardCreated: undefined,
  onRequireConfig: undefined,
};
