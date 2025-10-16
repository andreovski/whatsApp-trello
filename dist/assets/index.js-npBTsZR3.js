import { g as getTrelloConfig } from "./storage-CLrKxZkh.js";
const TRELLO_API_BASE = "https://api.trello.com/1";
async function ensureConfig({ apiKey, apiToken, listId }) {
  if (!apiKey || !apiToken || !listId) {
    throw new Error(
      "Credenciais do Trello incompletas. Configure sua API key, token e listId."
    );
  }
}
function ensureBoardConfig({ apiKey, apiToken, boardId }) {
  if (!apiKey || !apiToken || !boardId) {
    throw new Error(
      "Credenciais do Trello incompletas. Configure sua API key, token e o ID do board."
    );
  }
}
async function parseOrThrow(response, defaultMessage) {
  if (response.ok) {
    return response.json();
  }
  let errorDetail = await response.text();
  try {
    const parsed = JSON.parse(errorDetail);
    errorDetail = (parsed == null ? void 0 : parsed.message) || errorDetail;
  } catch (_) {
  }
  if (response.status === 404) {
    throw new Error(
      `Recurso não encontrado. Verifique se o ID informado está correto e se sua API Key/Token têm acesso ao recurso solicitado. - ${errorDetail}`
    );
  }
  if (response.status === 401) {
    throw new Error(
      "Credenciais inválidas ou sem permissão. Confirme sua API Key e Token do Trello."
    );
  }
  throw new Error(`${defaultMessage}: ${errorDetail}`);
}
async function createCard({
  apiKey,
  apiToken,
  listId,
  name,
  desc,
  urlSource
}) {
  await ensureConfig({ apiKey, apiToken, listId });
  const params = new URLSearchParams({
    key: apiKey,
    token: apiToken,
    idList: listId,
    name,
    desc
  });
  if (urlSource) {
    params.append("urlSource", urlSource);
  }
  const response = await fetch(
    `${TRELLO_API_BASE}/cards?${params.toString()}`,
    {
      method: "POST"
    }
  );
  return parseOrThrow(response, "Falha ao criar card no Trello");
}
async function getRecentCards({ apiKey, apiToken, listId, limit = 5 }) {
  await ensureConfig({ apiKey, apiToken, listId });
  const authParams = new URLSearchParams({ key: apiKey, token: apiToken });
  const listResponse = await fetch(
    `${TRELLO_API_BASE}/lists/${listId}?${authParams.toString()}&fields=name,idBoard`
  );
  const listDetails = await parseOrThrow(
    listResponse,
    "Falha ao carregar detalhes da lista do Trello"
  );
  let boardName = "";
  if (listDetails == null ? void 0 : listDetails.idBoard) {
    const boardResponse = await fetch(
      `${TRELLO_API_BASE}/boards/${listDetails.idBoard}?${authParams.toString()}&fields=name`
    );
    const boardDetails = await parseOrThrow(
      boardResponse,
      "Falha ao carregar informações do board do Trello"
    );
    boardName = (boardDetails == null ? void 0 : boardDetails.name) ?? "";
  }
  const params = new URLSearchParams({
    key: apiKey,
    token: apiToken,
    limit: String(limit),
    fields: "name,shortUrl,dateLastActivity,idShort"
  });
  const response = await fetch(
    `${TRELLO_API_BASE}/lists/${listId}/cards?${params.toString()}`
  );
  const data = await parseOrThrow(
    response,
    "Falha ao carregar cards do Trello"
  );
  return (data ?? []).map((card) => ({
    id: card.id,
    name: card.name,
    shortUrl: card.shortUrl,
    dateLastActivity: card.dateLastActivity,
    idShort: card.idShort,
    listId,
    listName: (listDetails == null ? void 0 : listDetails.name) ?? "",
    boardId: (listDetails == null ? void 0 : listDetails.idBoard) ?? "",
    boardName
  })).sort(
    (a, b) => new Date(b.dateLastActivity || 0) - new Date(a.dateLastActivity || 0)
  ).slice(0, limit);
}
async function getLists({ apiKey, apiToken, boardId }) {
  ensureBoardConfig({ apiKey, apiToken, boardId });
  const authParams = new URLSearchParams({ key: apiKey, token: apiToken });
  const boardResponse = await fetch(
    `${TRELLO_API_BASE}/boards/${boardId}?${authParams.toString()}&fields=name`
  );
  const boardData = await parseOrThrow(
    boardResponse,
    "Falha ao carregar informações do board do Trello"
  );
  const listParams = new URLSearchParams({
    key: apiKey,
    token: apiToken,
    cards: "none",
    fields: "name"
  });
  const listsResponse = await fetch(
    `${TRELLO_API_BASE}/boards/${boardId}/lists?${listParams.toString()}`
  );
  const listsData = await parseOrThrow(
    listsResponse,
    "Falha ao carregar listas do Trello"
  );
  return (listsData ?? []).map((list) => ({
    id: list.id,
    name: list.name,
    boardId,
    boardName: (boardData == null ? void 0 : boardData.name) ?? ""
  }));
}
async function handleCreateCard(payload = {}) {
  const config = await getTrelloConfig();
  const name = (payload == null ? void 0 : payload.title) ?? "Card sem título";
  const desc = buildDescription(payload);
  const urlSource = payload == null ? void 0 : payload.urlSource;
  return createCard({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    listId: (payload == null ? void 0 : payload.listId) || config.lastListId || config.listId,
    name,
    desc,
    urlSource
  });
}
function buildDescription({ summary, recentMessages, generatedAt }) {
  const lines = [
    summary ? `Resumo: ${summary}` : "",
    (recentMessages == null ? void 0 : recentMessages.length) ? "---------" : "",
    ...(recentMessages ?? []).map((msg) => `- ${msg}`),
    generatedAt ? `Gerado em: ${new Date(generatedAt).toLocaleString()}` : ""
  ].filter(Boolean);
  return lines.join("\n");
}
async function handleGetRecentCards(payload = {}) {
  const config = await getTrelloConfig();
  const limit = (payload == null ? void 0 : payload.limit) ?? 5;
  const listId = await resolveListId({
    payloadListId: payload == null ? void 0 : payload.listId,
    config
  });
  if (!listId) {
    throw new Error(
      "Nenhuma lista configurada. Selecione uma lista ao criar um card para habilitar os cards recentes."
    );
  }
  return getRecentCards({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    listId,
    limit
  });
}
async function handleGetLists() {
  const config = await getTrelloConfig();
  return getLists({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    boardId: config.boardId
  });
}
async function resolveListId({ payloadListId, config }) {
  var _a;
  if (payloadListId) return payloadListId;
  if (config == null ? void 0 : config.lastListId) return config.lastListId;
  if (!(config == null ? void 0 : config.boardId)) return (config == null ? void 0 : config.listId) ?? "";
  const lists = await getLists({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    boardId: config.boardId
  });
  return ((_a = lists == null ? void 0 : lists[0]) == null ? void 0 : _a.id) ?? "";
}
const trelloHandlers = {
  "trello:create-card": async (payload) => {
    const result = await handleCreateCard(payload);
    return { result };
  },
  "trello:get-recent-cards": async (payload) => {
    const cards = await handleGetRecentCards(payload);
    return { cards };
  },
  "trello:get-lists": async () => {
    const lists = await handleGetLists();
    return { lists };
  }
};
const handlers = {
  ...trelloHandlers
};
const defaultLogger = console;
function createMessageRouter(handlers2, options = {}) {
  const { logger = defaultLogger } = options;
  return (message, sender, sendResponse) => {
    var _a;
    if (!(message == null ? void 0 : message.type)) {
      return;
    }
    const handler = handlers2[message.type];
    if (typeof handler !== "function") {
      (_a = logger == null ? void 0 : logger.warn) == null ? void 0 : _a.call(
        logger,
        `Nenhum handler registrado para o tipo "${message.type}".`
      );
      return;
    }
    Promise.resolve().then(() => handler(message.payload, { sender, type: message.type })).then((result) => {
      const response = result && typeof result === "object" ? result : {};
      sendResponse({ ok: true, ...response });
    }).catch((error) => {
      var _a2;
      (_a2 = logger == null ? void 0 : logger.error) == null ? void 0 : _a2.call(logger, `Erro ao processar mensagem "${message.type}":`, error);
      sendResponse({
        ok: false,
        error: (error == null ? void 0 : error.message) ?? "Erro desconhecido ao processar mensagem."
      });
    });
    return true;
  };
}
const router = createMessageRouter(handlers);
chrome.runtime.onMessage.addListener(router);
