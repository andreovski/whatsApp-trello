import React, { useRef } from "react";
import PropTypes from "prop-types";
import { classes } from "../../styles";
import { CheckIcon } from "../../components/icons";

export function TrelloConfigForm({
  form,
  onChange,
  onSubmit,
  isSaving,
  onTemplateImport,
  onTemplateExport,
  templateCount,
  templateImportStatus,
  templateImportError,
  templateExportStatus,
  templateExportError,
}) {
  const fileInputRef = useRef(null);

  return (
    <form
      className={`${classes.card} flex-col gap-4 text-sm`}
      onSubmit={onSubmit}
    >
      <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
        <span className="font-medium">API Key</span>
        <input
          type="text"
          value={form.apiKey}
          onChange={(event) => onChange("apiKey", event.target.value)}
          placeholder="Sua API Key do Trello"
          required
          className={classes.input}
        />
      </label>
      <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
        <span className="font-medium">Token</span>
        <input
          type="text"
          value={form.apiToken}
          onChange={(event) => onChange("apiToken", event.target.value)}
          placeholder="Seu Token do Trello"
          required
          className={classes.input}
        />
      </label>
      {/* List selection moved to card creation form; removed from persistent settings */}
      <label className="flex flex-col gap-2 text-neutral-700 dark:text-neutral-300">
        <span className="font-medium">Board ID</span>
        <input
          type="text"
          value={form.boardId}
          onChange={(event) => onChange("boardId", event.target.value)}
          placeholder="ID do quadro no Trello"
          required
          className={classes.input}
        />
      </label>
      <section className="flex flex-col gap-2 rounded-md border border-dashed border-primary/30 bg-primary/5 px-3 py-3 text-xs text-neutral-600 dark:border-primary/40 dark:bg-primary/10 dark:text-neutral-300">
        <header className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
            Templates de descrição
          </span>
          <p>
            Os templates são armazenados localmente. Use as opções abaixo para
            importar de um arquivo existente ou exportar os modelos atuais.
          </p>
        </header>
        <div className="flex flex-col gap-2">
          <div className="rounded-md border border-dashed border-primary/30 bg-white px-3 py-2 text-xs text-neutral-600 shadow-sm dark:border-primary/40 dark:bg-neutral-900 dark:text-neutral-300">
            <span className="font-medium text-neutral-700 dark:text-neutral-100">
              Templates salvos no dispositivo
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                if (file) {
                  onTemplateImport?.(file);
                }
                event.target.value = "";
              }}
            />
            <button
              type="button"
              className={classes.secondaryButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={
                templateImportStatus === "loading" ||
                templateExportStatus === "loading"
              }
            >
              Importar arquivo JSON
            </button>
            <button
              type="button"
              className={classes.secondaryButton}
              onClick={onTemplateExport}
              disabled={
                templateExportStatus === "loading" ||
                templateImportStatus === "loading"
              }
            >
              Exportar templates
            </button>
            {typeof templateCount === "number" ? (
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Templates carregados: {templateCount}
              </span>
            ) : null}
          </div>
        </div>
        {templateImportStatus === "success" ? (
          <p className="text-xs font-medium text-primary">
            Templates importados com sucesso!
          </p>
        ) : null}
        {templateImportStatus === "loading" ? (
          <p className="text-xs font-medium text-primary">
            Importando templates...
          </p>
        ) : null}
        {templateImportStatus === "error" && templateImportError ? (
          <p className="text-xs font-medium text-red-500">
            {templateImportError}
          </p>
        ) : null}
        {templateExportStatus === "success" ? (
          <p className="text-xs font-medium text-primary">
            Arquivo de templates exportado com sucesso!
          </p>
        ) : null}
        {templateExportStatus === "loading" ? (
          <p className="text-xs font-medium text-primary">
            Preparando exportação...
          </p>
        ) : null}
        {templateExportStatus === "error" && templateExportError ? (
          <p className="text-xs font-medium text-red-500">
            {templateExportError}
          </p>
        ) : null}
      </section>
      <div className="flex justify-end">
        <button
          type="submit"
          className={classes.primaryButton}
          disabled={isSaving}
        >
          <CheckIcon />
          Salvar
        </button>
      </div>
    </form>
  );
}

TrelloConfigForm.propTypes = {
  form: PropTypes.shape({
    apiKey: PropTypes.string,
    apiToken: PropTypes.string,
    boardId: PropTypes.string,
    lastListId: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSaving: PropTypes.bool,
  onTemplateImport: PropTypes.func,
  onTemplateExport: PropTypes.func,
  templateCount: PropTypes.number,
  templateImportStatus: PropTypes.oneOf([
    "idle",
    "loading",
    "success",
    "error",
  ]),
  templateImportError: PropTypes.string,
  templateExportStatus: PropTypes.oneOf([
    "idle",
    "loading",
    "success",
    "error",
  ]),
  templateExportError: PropTypes.string,
};

TrelloConfigForm.defaultProps = {
  isSaving: false,
  onTemplateImport: undefined,
  onTemplateExport: undefined,
  templateCount: null,
  templateImportStatus: "idle",
  templateImportError: null,
  templateExportStatus: "idle",
  templateExportError: null,
};
