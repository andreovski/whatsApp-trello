import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { TrelloConfigForm } from "./TrelloConfigForm.jsx";
import { TrelloMark } from "../../components/icons.jsx";
import { useTrello } from "../../../shared/trelloContext.js";
import { classes } from "../../styles.js";

const INITIAL_CONFIG = Object.freeze({
  apiKey: "",
  apiToken: "",
  boardId: "",
  lastListId: "",
  templateSourceType: "default",
  templateSourceName: "Templates padrão",
  templateSourceUpdatedAt: null,
  templateSourcePath: "",
});

const CONFIG_SECTIONS = Object.freeze([
  {
    id: "trello",
    label: "Trello",
    description: "Integração com o Trello",
    icon: TrelloMark,
  },
]);

export function Config({ onClose }) {
  const {
    config,
    saveConfig,
    saveNoteTemplates,
    noteTemplates,
    loadingTemplates,
  } = useTrello();

  const [form, setForm] = useState(() => ({ ...INITIAL_CONFIG }));
  const [isSaving, setSaving] = useState(false);
  const [templateImportStatus, setTemplateImportStatus] = useState("idle");
  const [templateImportError, setTemplateImportError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    setForm((prev) => ({ ...prev, ...config }));
  }, [config]);

  const templateSourceLabel = useMemo(() => {
    if (form.templateSourceType === "file") {
      const date = form.templateSourceUpdatedAt
        ? new Date(form.templateSourceUpdatedAt)
        : null;
      const formattedDate = date
        ? date.toLocaleString(undefined, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      const labelSource =
        form.templateSourcePath || form.templateSourceName || "Arquivo";

      return `${labelSource}${formattedDate ? ` • ${formattedDate}` : ""}`;
    }

    return form.templateSourceName ?? "Templates padrão";
  }, [
    form.templateSourceName,
    form.templateSourceType,
    form.templateSourceUpdatedAt,
    form.templateSourcePath,
  ]);

  const templateCount = useMemo(() => {
    if (loadingTemplates) {
      return null;
    }
    return noteTemplates?.length ?? 0;
  }, [loadingTemplates, noteTemplates]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const validateTemplateEntry = useCallback((entry, index) => {
    const id = typeof entry.id === "string" && entry.id.trim();
    const label = typeof entry.label === "string" && entry.label.trim();
    const notes = typeof entry.notes === "string" && entry.notes.trim();

    if (!id) {
      throw new Error(
        `Template inválido na posição ${index + 1}: campo "id" ausente.`
      );
    }
    if (!label) {
      throw new Error(
        `Template inválido na posição ${index + 1}: campo "label" ausente.`
      );
    }
    if (!notes) {
      throw new Error(
        `Template inválido na posição ${index + 1}: campo "notes" ausente.`
      );
    }

    return { id, label, notes };
  }, []);

  const handleTemplateFileSelected = useCallback(
    (file) => {
      if (!file) {
        setTemplateImportStatus("idle");
        setTemplateImportError(null);
        return;
      }

      setTemplateImportStatus("loading");
      setTemplateImportError(null);

      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const text = event?.target?.result ?? "";
          const data = JSON.parse(text);

          if (!Array.isArray(data)) {
            throw new Error(
              "O arquivo deve conter um array JSON de templates."
            );
          }

          const normalized = data.map((entry, index) =>
            validateTemplateEntry(entry, index)
          );

          await saveNoteTemplates(normalized);

          const metadata = {
            templateSourceType: "file",
            templateSourceName: file.name,
            templateSourcePath: file.name,
            templateSourceUpdatedAt: new Date().toISOString(),
          };

          await saveConfig(metadata);
          setForm((prev) => ({ ...prev, ...metadata }));
          setTemplateImportStatus("success");
        } catch (err) {
          console.error("Erro ao importar templates", err);
          setTemplateImportStatus("error");
          setTemplateImportError(err.message ?? "Falha ao importar templates.");
        }
      };

      reader.onerror = () => {
        setTemplateImportStatus("error");
        setTemplateImportError("Não foi possível ler o arquivo selecionado.");
      };

      reader.readAsText(file, "utf-8");
    },
    [saveConfig, saveNoteTemplates, validateTemplateEntry]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setSaving(true);
      try {
        await saveConfig(form);
        if (onClose) {
          onClose();
        }
      } finally {
        setSaving(false);
      }
    },
    [form, onClose, saveConfig]
  );

  if (!activeSection) {
    return (
      <div className="flex h-full w-full flex-col gap-6 p-3">
        <ul className="flex flex-col w-full gap-4">
          {CONFIG_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <li key={section.id} className="h-full w-full">
                <button
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`${classes.card} group flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80`}
                >
                  {Icon ? (
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white dark:bg-primary/20">
                      <Icon className="h-7 w-7" />
                    </span>
                  ) : null}
                  <span className="flex flex-col gap-1">
                    <span className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
                      {section.label}
                    </span>
                    {section.description ? (
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        {section.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 ">
        <button
          type="button"
          onClick={() => setActiveSection(null)}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
        >
          <span aria-hidden="true">←</span>
          <span>Voltar</span>
        </button>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-50">
          {CONFIG_SECTIONS.find((section) => section.id === activeSection)
            ?.label ?? "Configuração"}
        </h2>
        <span className="w-16" aria-hidden="true" />
      </header>

      <div className="flex-1 overflow-y-auto p-3">
        {activeSection === "trello" ? (
          <TrelloConfigForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            onTemplateFileSelected={handleTemplateFileSelected}
            templateSourceLabel={templateSourceLabel}
            templateCount={templateCount}
            templateImportStatus={templateImportStatus}
            templateImportError={templateImportError}
          />
        ) : null}
      </div>
    </div>
  );
}

Config.propTypes = {
  onClose: PropTypes.func,
};

Config.defaultProps = {
  onClose: undefined,
};
