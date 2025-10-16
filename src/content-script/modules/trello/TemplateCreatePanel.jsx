import React, { useCallback, useMemo, useState } from "react";
import { useTrello } from "../../../shared/trelloContext.js";
import { classes, textareaClasses } from "../../styles.js";
import { CheckTopicsIcon } from "../../components/icons.jsx";

const INITIAL_STATE = Object.freeze({
  label: "",
  notes: "",
});

export function TemplateCreatePanel() {
  const { config, createTemplate, loadingTemplates } = useTrello();
  const [form, setForm] = useState(() => ({ ...INITIAL_STATE }));
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  const isReady = useMemo(
    () => config?.templateSourceType === "file",
    [config?.templateSourceType]
  );

  const isSubmitting = status === "loading";

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
      if (!isValid || !isReady || isSubmitting) {
        return;
      }

      setStatus("loading");
      setMessage(null);

      const result = await createTemplate({
        label: form.label,
        notes: form.notes,
      });

      if (result.ok) {
        setStatus("success");
        setMessage("Template criado e sincronizado com o arquivo.");
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
      isReady,
      isSubmitting,
      isValid,
      resetForm,
    ]
  );

  return (
    <div className="flex-1 overflow-y-auto text-sm text-neutral-800 dark:text-neutral-100 p-3">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <section className={`${classes.card} flex-col gap-2`}>
          <header className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Cadastrar novo template</h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-300">
              Informe um nome e a descrição que será aplicada ao card. O arquivo
              configurado receberá a atualização automaticamente ao salvar.
            </p>
          </header>

          {!isReady ? (
            <div className="rounded-md bg-amber-100 px-3 py-3 text-xs text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
              Selecione um arquivo de templates nas configurações antes de
              cadastrar novos modelos.
            </div>
          ) : null}

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
              disabled={!isReady || isSubmitting || loadingTemplates}
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
              disabled={!isReady || isSubmitting || loadingTemplates}
              required
            />
          </label>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              className="text-xs font-medium text-neutral-500 underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              onClick={resetForm}
              disabled={isSubmitting || (!form.label && !form.notes)}
            >
              Limpar campos
            </button>
            <button
              type="submit"
              className={classes.primaryButton}
              disabled={
                !isReady || !isValid || isSubmitting || loadingTemplates
              }
            >
              <CheckTopicsIcon />
              {isSubmitting ? "Salvando..." : "Salvar template"}
            </button>
          </div>
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
