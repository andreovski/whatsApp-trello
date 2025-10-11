import { getTrelloConfig } from "../../shared/storage.js";
import {
  createCard as createTrelloCard,
  getRecentCards as fetchRecentCards,
  getLists as fetchLists,
} from "../../shared/trelloClient.js";

async function handleCreateCard(payload = {}) {
  const config = await getTrelloConfig();
  const name = payload?.title ?? "Card sem título";
  const desc = buildDescription(payload);
  const urlSource = payload?.urlSource;

  return createTrelloCard({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    listId: payload?.listId || config.lastListId || config.listId,
    name,
    desc,
    urlSource,
  });
}

function buildDescription({ summary, recentMessages, generatedAt }) {
  const lines = [
    summary ? `Resumo: ${summary}` : "",
    recentMessages?.length ? "---------" : "",
    ...(recentMessages ?? []).map((msg) => `- ${msg}`),
    generatedAt ? `Gerado em: ${new Date(generatedAt).toLocaleString()}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

async function handleGetRecentCards(payload = {}) {
  const config = await getTrelloConfig();
  const limit = payload?.limit ?? 5;

  const listId = await resolveListId({
    payloadListId: payload?.listId,
    config,
  });

  if (!listId) {
    throw new Error(
      "Nenhuma lista configurada. Selecione uma lista ao criar um card para habilitar os cards recentes."
    );
  }

  return fetchRecentCards({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    listId,
    limit,
  });
}

async function handleGetLists() {
  const config = await getTrelloConfig();
  return fetchLists({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    boardId: config.boardId,
  });
}

async function resolveListId({ payloadListId, config }) {
  if (payloadListId) return payloadListId;
  if (config?.lastListId) return config.lastListId;
  if (!config?.boardId) return config?.listId ?? "";

  const lists = await fetchLists({
    apiKey: config.apiKey,
    apiToken: config.apiToken,
    boardId: config.boardId,
  });

  return lists?.[0]?.id ?? "";
}

export const trelloHandlers = {
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
  },
};

export default trelloHandlers;
