import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useTrello } from "../../../shared/trelloContext";
import { classes } from "../../styles";
import { CheckFileIcon } from "../../components/icons";
import {
  STATUS_LABELS,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  IMAGE_EXTENSIONS,
  ALLOWED_FORMATS_LABEL,
  DEFAULT_LABEL_COLOR,
  resolveLabelColor,
  createEmptyFormState,
} from "./utils";

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
    labels,
    labelsLoading,
  } = useTrello();

  const [values, setValues] = useState(() => createEmptyFormState());
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const clearAttachment = useCallback(() => {
    setValues((prev) => ({ ...prev, attachment: null }));
    setPreviewUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const processAttachment = useCallback(
    (file) => {
      if (!file) {
        clearAttachment();
        if (error) {
          setError(null);
        }
        return;
      }

      const fileName = file.name ?? "";
      const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
      const mimeType = (file.type || "").toLowerCase();

      const isAllowed =
        (extension && ALLOWED_EXTENSIONS.has(extension)) ||
        (mimeType && ALLOWED_MIME_TYPES.has(mimeType));

      if (!isAllowed) {
        clearAttachment();
        setError(
          `Formato de arquivo não suportado. Use arquivos ${ALLOWED_FORMATS_LABEL}.`
        );
        return;
      }

      if (error) {
        setError(null);
      }

      setValues((prev) => ({ ...prev, attachment: file }));

      setPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }

        if (
          IMAGE_EXTENSIONS.has(extension) ||
          (mimeType && mimeType.startsWith("image/"))
        ) {
          return URL.createObjectURL(file);
        }

        return null;
      });
    },
    [clearAttachment, error, setError]
  );

  const resetForm = useCallback(
    ({ keepList = true } = {}) => {
      setValues((prev) => {
        const nextListId = keepList
          ? prev.listId || config?.lastListId || ""
          : config?.lastListId || "";

        return createEmptyFormState({ listId: nextListId });
      });

      setPreviewUrl((previousUrl) => {
        if (previousUrl) {
          URL.revokeObjectURL(previousUrl);
        }
        return null;
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [config?.lastListId]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleAttachmentChange = useCallback(
    (event) => {
      const file = event?.target?.files?.[0] ?? null;
      processAttachment(file);
    },
    [processAttachment]
  );

  const handleRemoveAttachment = useCallback(() => {
    clearAttachment();
    if (error) {
      setError(null);
    }
  }, [clearAttachment, error, setError]);

  const handleDragEnter = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
      if (!isDragging) {
        setIsDragging(true);
      }
    },
    [isDragging]
  );

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    const nextTarget = event.relatedTarget;
    if (nextTarget && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);
      const file = event.dataTransfer?.files?.[0] ?? null;
      processAttachment(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [processAttachment]
  );

  const handleToggleLabel = useCallback(
    (labelId) => {
      if (!labelId) return;
      setValues((prev) => {
        const current = new Set(prev.labelIds ?? []);
        if (current.has(labelId)) {
          current.delete(labelId);
        } else {
          current.add(labelId);
        }
        return { ...prev, labelIds: Array.from(current) };
      });
      if (error) {
        setError(null);
      }
    },
    [error, setError]
  );

  const handleClearLabels = useCallback(() => {
    setValues((prev) => {
      if (!prev.labelIds?.length) {
        return prev;
      }

      return { ...prev, labelIds: [] };
    });

    if (error) {
      setError(null);
    }
  }, [error, setError]);

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
        attachment: values.attachment ?? undefined,
        labelIds: values.labelIds ?? [],
      };

      const result = await createCard(payload);

      if (result.ok) {
        resetForm({ keepList: true });
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
      clearAttachment,
      resetForm,
    ]
  );

  const selectedLabels = useMemo(() => {
    if (!Array.isArray(values.labelIds) || !values.labelIds.length) {
      return [];
    }

    const labelMap = new Map((labels ?? []).map((label) => [label.id, label]));
    return values.labelIds.map((id) => labelMap.get(id)).filter(Boolean);
  }, [labels, values.labelIds]);

  const selectedLabelColors = useMemo(() => {
    if (!selectedLabels.length) {
      return [];
    }

    return selectedLabels
      .map((label) => resolveLabelColor(label?.color))
      .slice(0, 3);
  }, [selectedLabels]);

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

        <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="font-medium">Etiquetas do Trello</span>
          {labelsLoading ? (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Carregando etiquetas…
            </span>
          ) : labels?.length ? (
            <div className="flex w-full gap-2 overflow-x-auto overscroll-x-contain py-1">
              {labels.map((label) => {
                const color = resolveLabelColor(label.color);
                const name = label.name?.trim() || "Sem nome";
                const isSelected = values.labelIds.includes(label.id);
                return (
                  <button
                    key={label.id}
                    type="button"
                    onClick={() => handleToggleLabel(label.id)}
                    className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs transition focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-primary/40 dark:focus-visible:ring-offset-neutral-900 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary dark:border-primary/60 dark:bg-primary/20"
                        : "border-zinc-200 bg-white text-zinc-700 hover:border-primary/40 hover:text-primary dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:border-primary/60"
                    }`}
                    style={{ minWidth: "max-content" }}
                    aria-pressed={isSelected}
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate">{name}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              Nenhuma etiqueta disponível para este quadro.
            </span>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Toque nas tags para selecionar ou remover etiquetas.</span>
          </div>
          <div className="mt-2">
            <div
              className={`inline-flex items-center gap-3 rounded-full border px-3 py-1 text-xs font-medium transition ${
                values.labelIds.length
                  ? "border-primary bg-primary/10 text-primary dark:border-primary/60 dark:bg-primary/20"
                  : "border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-neutral-300"
              }`}
            >
              <div className="flex items-center -space-x-2">
                {(selectedLabelColors.length
                  ? selectedLabelColors
                  : [DEFAULT_LABEL_COLOR]
                ).map((color, index) => (
                  <span
                    key={`selected-label-color-${index}`}
                    aria-hidden="true"
                    className="h-4 w-4 rounded-full border border-white shadow-sm dark:border-neutral-900"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <span className="whitespace-nowrap">
                {values.labelIds.length}{" "}
                {values.labelIds.length === 1 ? "etiqueta" : "etiquetas"}
              </span>
              <button
                type="button"
                onClick={handleClearLabels}
                disabled={!values.labelIds.length}
                className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[11px] transition hover:bg-current hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Limpar etiquetas selecionadas"
              >
                ×
              </button>
            </div>
          </div>
        </label>
        <label
          className={`flex flex-col gap-2 text-zinc-700 dark:text-zinc-300 transition ${
            isDragging
              ? "rounded-md ring-2 ring-primary/40 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900"
              : ""
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <span className="font-medium">Anexo</span>
          <input
            type="file"
            className={classes.input}
            accept=".png,.jpg,.jpeg,.pdf,.cdr,.svg,image/png,image/jpeg,image/jpg,image/svg+xml,application/pdf"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
          />
          {values.attachment ? (
            <div className="flex items-center justify-between rounded border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
              <span className="truncate" title={values.attachment.name}>
                {values.attachment.name}
              </span>
              <button
                type="button"
                onClick={handleRemoveAttachment}
                className="text-primary transition hover:underline"
              >
                Remover
              </button>
            </div>
          ) : (
            <span
              className={`text-xs transition ${
                isDragging
                  ? "text-primary dark:text-primary"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            >
              Opcional: arraste e solte ou selecione um arquivo junto com o card
              (até 10&nbsp;MB em contas gratuitas). Formatos aceitos:{" "}
              {ALLOWED_FORMATS_LABEL}.
            </span>
          )}
          {previewUrl && (
            <figure className="mt-3 flex flex-col gap-1 text-xs text-neutral-500 dark:text-neutral-400">
              <img
                src={previewUrl}
                alt={`Pré-visualização de ${
                  values.attachment?.name ?? "arquivo"
                }`}
                className="max-h-48 w-full rounded-md border border-neutral-200 object-contain bg-white dark:border-neutral-700 dark:bg-neutral-900"
              />
              <figcaption>Pré-visualização da imagem selecionada.</figcaption>
            </figure>
          )}
          {isDragging && (
            <p className="mt-2 text-xs text-primary dark:text-primary">
              Solte o arquivo aqui para anexá-lo ao card.
            </p>
          )}
          {!previewUrl && values.attachment && (
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              Pré-visualização disponível apenas para imagens (PNG, JPG, JPEG ou
              SVG).
            </p>
          )}
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
