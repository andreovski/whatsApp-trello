export const STATUS_LABELS = {
  idle: "Pronto",
  loading: "Enviando…",
  success: "Card criado! ✅",
  error: "Erro ao criar card.",
};

export const ALLOWED_EXTENSIONS = new Set([
  "png",
  "jpg",
  "jpeg",
  "pdf",
  "cdr",
  "svg",
]);

export const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/svg+xml",
  "application/pdf",
  "application/x-cdr",
  "application/cdr",
  "application/vnd.corel-draw",
]);

export const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "svg"]);

export const ALLOWED_FORMATS_LABEL = "PNG, JPG, JPEG, PDF, CDR e SVG";

export const LABEL_COLOR_MAP = {
  green: "#61BD4F",
  green_dark: "#519839",
  green_light: "#7BC86C",
  yellow: "#F2D600",
  yellow_dark: "#D9B51C",
  yellow_light: "#F5DD29",
  orange: "#FF9F1A",
  orange_dark: "#E79217",
  orange_light: "#FFB968",
  red: "#EB5A46",
  red_dark: "#CF513D",
  red_light: "#EF7564",
  purple: "#C377E0",
  purple_dark: "#89609E",
  purple_light: "#D7A6E3",
  blue: "#0079BF",
  blue_dark: "#055A8C",
  blue_light: "#5BA4CF",
  sky: "#00C2E0",
  sky_dark: "#097F8C",
  sky_light: "#70C7D4",
  lime: "#51E898",
  lime_dark: "#4BBF6B",
  lime_light: "#B7DD7E",
  pink: "#FF78CB",
  pink_dark: "#C9558B",
  pink_light: "#FF8ED4",
  black: "#344563",
  black_dark: "#1F1F1F",
  black_light: "#505F79",
  gray: "#B3BAC5",
  gray_dark: "#808995",
  gray_light: "#D4D4D4",
};

export const DEFAULT_LABEL_COLOR = LABEL_COLOR_MAP.gray;

export function resolveLabelColor(colorName) {
  if (!colorName) {
    return DEFAULT_LABEL_COLOR;
  }

  const normalized = String(colorName).toLowerCase();

  if (normalized.startsWith("#")) {
    return normalized;
  }

  return LABEL_COLOR_MAP[normalized] ?? DEFAULT_LABEL_COLOR;
}

export function createEmptyFormState(overrides = {}) {
  return {
    title: "",
    summary: "",
    notes: "",
    listId: "",
    attachment: null,
    labelIds: [],
    ...overrides,
  };
}
