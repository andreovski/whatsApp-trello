const STORAGE_KEYS = {
  trelloConfig: "trelloConfig",
  noteTemplates: "noteTemplates",
};

const defaultConfig = {
  apiKey: "",
  apiToken: "",
  boardId: "",
  lastListId: "",
  // listId removed from persistent config; selected at card creation time
};

const defaultNoteTemplates = [
  {
    id: "follow-up",
    label: "Follow-up imediato",
    notes:
      "Resumo da conversa\nPróximos passos acordados\nPrazo combinado\nContato de retorno",
  },
  {
    id: "qualificacao",
    label: "Qualificação de lead",
    notes:
      "Necessidade principal\nOrçamento estimado\nDecisor envolvido\nPrazo para decisão",
  },
  {
    id: "pos-demo",
    label: "Pós-demo",
    notes:
      "Pontos fortes apresentados\nObjeções levantadas\nAções de acompanhamento\nDocumentos enviados",
  },
];

const promisify = (executor) =>
  new Promise((resolve, reject) => {
    try {
      executor((result) => {
        const lastError = chrome.runtime?.lastError;
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

export async function getTrelloConfig() {
  const data = await promisify((callback) =>
    chrome.storage.sync.get(STORAGE_KEYS.trelloConfig, callback)
  );
  return { ...defaultConfig, ...data?.[STORAGE_KEYS.trelloConfig] };
}

export async function saveTrelloConfig(config) {
  await promisify((callback) =>
    chrome.storage.sync.set(
      {
        [STORAGE_KEYS.trelloConfig]: { ...defaultConfig, ...config },
      },
      callback
    )
  );
}

export async function clearTrelloConfig() {
  await promisify((callback) =>
    chrome.storage.sync.remove(STORAGE_KEYS.trelloConfig, callback)
  );
}

export async function getNoteTemplates() {
  const data = await promisify((callback) =>
    chrome.storage.sync.get(STORAGE_KEYS.noteTemplates, callback)
  );
  const stored = data?.[STORAGE_KEYS.noteTemplates];
  if (Array.isArray(stored) && stored.length) {
    return stored;
  }
  return defaultNoteTemplates;
}

export async function saveNoteTemplates(templates) {
  await promisify((callback) =>
    chrome.storage.sync.set(
      {
        [STORAGE_KEYS.noteTemplates]: templates ?? [],
      },
      callback
    )
  );
}

export async function clearNoteTemplates() {
  await promisify((callback) =>
    chrome.storage.sync.remove(STORAGE_KEYS.noteTemplates, callback)
  );
}

export { STORAGE_KEYS, defaultConfig, defaultNoteTemplates };
