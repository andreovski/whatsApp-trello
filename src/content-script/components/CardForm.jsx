import React from "react";
import PropTypes from "prop-types";
import { classes, textareaClasses } from "../styles.js";

export function CardForm({
  values,
  onChange,
  onSubmit,
  statusLabel,
  status,
  error,
  isSubmitting,
  isFormValid,
  lists,
  noteTemplates,
  onApplyTemplate,
}) {
  return (
    <main className="flex flex-1 min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6 text-sm leading-relaxed">
      <p className="text-neutral-600 dark:text-neutral-300">
        Revise e ajuste os dados antes de criar o card no Trello.
      </p>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="font-medium">Título do card</span>
          <input
            type="text"
            value={values.title}
            onChange={(event) => onChange("title", event.target.value)}
            className={classes.input}
            placeholder="Nome do card no Trello"
          />
        </label>
        <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="font-medium">Lista do Trello</span>
          <select
            value={values.listId}
            onChange={(event) => onChange("listId", event.target.value)}
            className={classes.input}
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
            onChange={(event) => onChange("summary", event.target.value)}
            className={textareaClasses}
            placeholder="Observações resumidas"
          />
        </label>

        <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
          <span className="font-medium">Descrição</span>

          {!!noteTemplates.length && (
            <span className="font-small text-neutral-500">
              Templates disponíveis
            </span>
          )}

          {!!noteTemplates?.length && (
            <section className="flex gap-2 pb-1 mx-1 overflow-x-auto max-w-[310px]">
              {noteTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onApplyTemplate?.(template)}
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
            onChange={(event) => onChange("notes", event.target.value)}
            className={`${textareaClasses} whitespace-pre-wrap`}
          />
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Cada linha será adicionada como um item no card.
          </span>
        </label>
        <div className="flex justify-end">
          <button
            type="submit"
            className={classes.primaryButton}
            disabled={!isFormValid || isSubmitting}
          >
            Criar card no Trello
          </button>
        </div>
      </form>
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
    </main>
  );
}

CardForm.propTypes = {
  values: PropTypes.shape({
    title: PropTypes.string,
    summary: PropTypes.string,
    notes: PropTypes.string,
    listId: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  statusLabel: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["idle", "loading", "success", "error"]).isRequired,
  error: PropTypes.string,
  isSubmitting: PropTypes.bool,
  isFormValid: PropTypes.bool.isRequired,
  lists: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string.isRequired, name: PropTypes.string })
  ),
  noteTemplates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      notes: PropTypes.string.isRequired,
    })
  ),
  onApplyTemplate: PropTypes.func,
};

CardForm.defaultProps = {
  error: null,
  isSubmitting: false,
  lists: [],
  noteTemplates: [],
  onApplyTemplate: undefined,
};
