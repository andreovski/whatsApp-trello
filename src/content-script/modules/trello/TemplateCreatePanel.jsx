import React, { useCallback, useMemo, useState } from "react";
import { useTrello } from "../../../shared/trelloContext.js";
import { classes, textareaClasses } from "../../styles.js";
import { CheckTopicsIcon } from "../../components/icons.jsx";

const INITIAL_STATE = Object.freeze({
  label: "",
  notes: "",
});

export function TemplateCreatePanel() {
  const {
    createTemplate,
    removeTemplate,
    noteTemplates,
    loadingTemplates,
  } = useTrello();
  const [form, setForm] = useState(() => ({ ...INITIAL_STATE }));
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const isSubmitting = status === "creating";

  const isValid = useMemo(() => {
    return form.label.trim().length > 0 && form.notes.trim().length > 0;
  }, [form.label, form.notes]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
    setStatus("idle");
  }, []);

  const resetForm = useCallback(() => {
    setForm(() => ({ ...INITIAL_STATE }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!isValid || isSubmitting || removingId) {
        return;
      }

      setStatus("creating");
      setMessage(null);

      const result = await createTemplate({
        label: form.label,
        notes: form.notes,
      });

      if (result.ok) {
        setStatus("success");
        setMessage("Template criado e salvo localmente.");
        resetForm();
      } else {
        setStatus("error");
        setMessage(result.error ?? "Falha ao criar template.");
      }
    },
    [
      createTemplate,
      form.label,
      form.notes,
      isSubmitting,
      isValid,
      resetForm,
      removingId,
    ]
  );

  const handleRemoveTemplate = useCallback(
    async (templateId) => {
      if (!templateId || removingId) {
        return;
      }

      setRemovingId(templateId);
      setStatus("removing");
      setMessage(null);

      const result = await removeTemplate(templateId);

      if (result.ok) {
        setStatus("success");
        setMessage("Template removido com sucesso.");
      } else {
        setStatus("error");
        setMessage(result.error ?? "Falha ao remover template.");
      }

      setRemovingId(null);
    },
    [removeTemplate, removingId]
  );

  const hasTemplates = useMemo(
    () => Array.isArray(noteTemplates) && noteTemplates.length > 0,
    [noteTemplates]
  );

  return (
    <div className="flex-1 overflow-y-auto text-sm text-neutral-800 dark:text-neutral-100 p-3">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <section className={`${classes.card} flex-col gap-2`}>
          <header className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Cadastrar novo template</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Informe um nome e a descrição que será aplicada ao card. Os
              templates ficam disponíveis imediatamente após o salvamento.
            </p>
          </header>

          <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-200">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
              Nome
            </span>
            <input
              type="text"
              value={form.label}
              onChange={(event) => handleChange("label", event.target.value)}
              placeholder="Ex.: Follow-up pós-reunião"
              className={classes.input}
              disabled={isSubmitting || loadingTemplates || Boolean(removingId)}
              required
            />
          </label>

          <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-200">
            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">
              Descrição
            </span>
            <textarea
              value={form.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
              placeholder="Faça uma lista com os tópicos que devem constar no card..."
              className={`${textareaClasses} min-h-[140px]`}
              disabled={isSubmitting || loadingTemplates || Boolean(removingId)}
              required
            />
          </label>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              className="text-xs font-medium text-neutral-500 underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              onClick={resetForm}
              disabled={
                isSubmitting ||
                Boolean(removingId) ||
                loadingTemplates ||
                (!form.label && !form.notes)
              }
            >
              Limpar campos
            </button>
            <button
              type="submit"
              className={classes.primaryButton}
              disabled={!isValid || isSubmitting || loadingTemplates || Boolean(removingId)}
            >
              <CheckTopicsIcon />
              {isSubmitting ? "Salvando..." : "Salvar template"}
            </button>
          </div>
        </section>

        <section className={`${classes.card} flex-col gap-3`}>
          <header className="flex flex-col gap-1">
            <h3 className="text-base font-semibold">Templates existentes</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Remova modelos que não forem mais necessários ou que serão
              substituídos.
            </p>
          </header>

          {loadingTemplates ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Carregando templates...
            </p>
          ) : null}

          {!loadingTemplates && !hasTemplates ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Nenhum template cadastrado ainda.
            </p>
          ) : null}

          {hasTemplates ? (
            <ul className="flex flex-col gap-2">
              {noteTemplates.map((template) => (
                <li
                  key={template.id}
                  className="flex items-start justify-between gap-2 rounded-md border border-black/10 bg-white px-3 py-2 shadow-sm dark:border-white/10 dark:bg-neutral-900"
                >
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-100">
                      {template.label}
                    </span>
                    <span className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">
                      {template.notes}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTemplate(template.id)}
                    className="text-xs font-semibold text-red-600 transition hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
                    disabled={
                      Boolean(removingId) || isSubmitting || loadingTemplates
                    }
                  >
                    {removingId === template.id
                      ? "Removendo..."
                      : "Remover"}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {message ? (
          <div
            className={`rounded-md px-3 py-3 text-xs ${
              status === "success"
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200"
            }`}
          >
            {message}
          </div>
        ) : null}
      </form>
    </div>
  );
}
