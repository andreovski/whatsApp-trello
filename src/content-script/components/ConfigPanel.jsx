import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { ConfigForm } from "./ConfigForm.jsx";
import { useTrello } from "../../shared/trelloContext.js";

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

export function ConfigPanel({ onClose }) {
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

  return (
    <ConfigForm
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
  );
}

ConfigPanel.propTypes = {
  onClose: PropTypes.func,
};

ConfigPanel.defaultProps = {
  onClose: undefined,
};
