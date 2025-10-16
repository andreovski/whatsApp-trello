const STORAGE_KEYS = {
  trelloConfig: "trelloConfig",
  noteTemplates: "noteTemplates"
};
const defaultConfig = {
  apiKey: "",
  apiToken: "",
  boardId: "",
  lastListId: "",
  templateSourceType: "default",
  templateSourceName: "Templates padrão",
  templateSourceUpdatedAt: null,
  templateSourcePath: ""
  // listId removed from persistent config; selected at card creation time
};
const defaultNoteTemplates = [
  {
    id: "follow-up",
    label: "Follow-up imediato",
    notes: "Resumo da conversa\nPróximos passos acordados\nPrazo combinado\nContato de retorno"
  },
  {
    id: "qualificacao",
    label: "Qualificação de lead",
    notes: "Necessidade principal\nOrçamento estimado\nDecisor envolvido\nPrazo para decisão"
  },
  {
    id: "pos-demo",
    label: "Pós-demo",
    notes: "Pontos fortes apresentados\nObjeções levantadas\nAções de acompanhamento\nDocumentos enviados"
  }
];
const promisify = (executor) => new Promise((resolve, reject) => {
  try {
    executor((result) => {
      var _a;
      const lastError = (_a = chrome.runtime) == null ? void 0 : _a.lastError;
      if (lastError) {
        reject(new Error(lastError.message));
      } else {
        resolve(result);
      }
    });
  } catch (error) {
    reject(error);
  }
});
async function getTrelloConfig() {
  const data = await promisify(
    (callback) => chrome.storage.sync.get(STORAGE_KEYS.trelloConfig, callback)
  );
  return { ...defaultConfig, ...data == null ? void 0 : data[STORAGE_KEYS.trelloConfig] };
}
async function saveTrelloConfig(config) {
  await promisify(
    (callback) => chrome.storage.sync.set(
      {
        [STORAGE_KEYS.trelloConfig]: { ...defaultConfig, ...config }
      },
      callback
    )
  );
}
async function getNoteTemplates() {
  const data = await promisify(
    (callback) => chrome.storage.sync.get(STORAGE_KEYS.noteTemplates, callback)
  );
  const stored = data == null ? void 0 : data[STORAGE_KEYS.noteTemplates];
  if (Array.isArray(stored) && stored.length) {
    return stored;
  }
  return defaultNoteTemplates;
}
async function saveNoteTemplates(templates) {
  await promisify(
    (callback) => chrome.storage.sync.set(
      {
        [STORAGE_KEYS.noteTemplates]: templates ?? []
      },
      callback
    )
  );
}
export {
  getNoteTemplates as a,
  saveTrelloConfig as b,
  defaultNoteTemplates as d,
  getTrelloConfig as g,
  saveNoteTemplates as s
};
