import { create } from "zustand";
import {
  getTrelloConfig,
  saveTrelloConfig,
  getNoteTemplates,
  saveNoteTemplates as persistNoteTemplates,
  defaultNoteTemplates,
} from "./storage.js";

export const useAppStore = create((set, get) => ({
  config: {
    apiKey: "",
    apiToken: "",
    boardId: "",
    lastListId: "",
  },
  loadingConfig: false,
  status: "idle",
  error: null,
  noteTemplates: defaultNoteTemplates,
  loadingTemplates: false,
  async loadConfig() {
    set({ loadingConfig: true, error: null });
    try {
      const config = await getTrelloConfig();
      set({ config, loadingConfig: false });
    } catch (error) {
      set({ error: error.message, loadingConfig: false });
    }
  },
  async saveConfig(partial) {
    const updated = { ...get().config, ...partial };
    await saveTrelloConfig(updated);
    set({ config: updated });
  },
  async loadNoteTemplates() {
    set({ loadingTemplates: true });
    try {
      const templates = await getNoteTemplates();
      set({ noteTemplates: templates, loadingTemplates: false });
    } catch (error) {
      console.error("Erro ao carregar templates locais", error);
      set({ noteTemplates: defaultNoteTemplates, loadingTemplates: false });
    }
  },
  async saveNoteTemplates(templates) {
    try {
      await persistNoteTemplates(templates);
      set({ noteTemplates: templates });
    } catch (error) {
      console.error("Erro ao salvar templates locais", error);
    }
  },
  setStatus(status) {
    set({ status });
  },
  setError(error) {
    set({ error });
  },
}));
