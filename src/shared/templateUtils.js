const REQUIRED_FIELDS = ["id", "label", "notes"];

function normalizeString(value) {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export function normalizeTemplateEntries(entries) {
  if (!Array.isArray(entries)) {
    throw new Error("O arquivo deve conter um array JSON de templates.");
  }

  return entries.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      throw new Error(
        `Template inválido na posição ${index + 1}: estrutura inesperada.`
      );
    }

    const normalized = {};

    REQUIRED_FIELDS.forEach((field) => {
      normalized[field] = normalizeString(entry[field]);
      if (!normalized[field]) {
        throw new Error(
          `Template inválido na posição ${index + 1}: campo "${field}" ausente.`
        );
      }
    });

    return normalized;
  });
}

export function createTemplate({ label, notes }) {
  const safeLabel = normalizeString(label);
  const safeNotes = typeof notes === "string" ? notes.trim() : "";

  if (!safeLabel) {
    throw new Error("Informe um nome válido para o template.");
  }

  if (!safeNotes) {
    throw new Error("Informe uma descrição válida para o template.");
  }

  const id =
    typeof crypto?.randomUUID === "function"
      ? crypto.randomUUID()
      : `tpl-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

  return { id, label: safeLabel, notes: safeNotes };
}
