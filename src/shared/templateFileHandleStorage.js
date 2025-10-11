const DB_NAME = "crm-whatsapp-template-handles";
const STORE_NAME = "handles";
const TEMPLATE_KEY = "noteTemplates";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveTemplateFileHandle(handle) {
  if (!handle) return;
  const db = await openDatabase();

  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(handle, TEMPLATE_KEY);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };

    tx.onabort = tx.onerror = () => {
      const error =
        tx.error || new Error("Falha ao salvar o handle do arquivo.");
      db.close();
      reject(error);
    };
  });
}

export async function getTemplateFileHandle() {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(TEMPLATE_KEY);

    request.onsuccess = () => {
      const handle = request.result ?? null;
      db.close();
      resolve(handle);
    };

    request.onerror = () => {
      const error =
        request.error || new Error("Falha ao recuperar o handle do arquivo.");
      db.close();
      reject(error);
    };

    tx.onabort = tx.onerror = () => {
      const error =
        tx.error || new Error("Falha ao recuperar o handle do arquivo.");
      db.close();
      reject(error);
    };
  });
}

export async function clearTemplateFileHandle() {
  const db = await openDatabase();

  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(TEMPLATE_KEY);

    tx.oncomplete = () => {
      db.close();
      resolve();
    };

    tx.onabort = tx.onerror = () => {
      const error =
        tx.error || new Error("Falha ao limpar o handle do arquivo.");
      db.close();
      reject(error);
    };
  });
}
