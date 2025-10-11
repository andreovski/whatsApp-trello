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
    errorDetail = parsed?.message || errorDetail;
  } catch (_) {
    // resposta não era JSON
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

export async function createCard({
  apiKey,
  apiToken,
  listId,
  name,
  desc,
  urlSource,
}) {
  await ensureConfig({ apiKey, apiToken, listId });

  const params = new URLSearchParams({
    key: apiKey,
    token: apiToken,
    idList: listId,
    name,
    desc,
  });

  if (urlSource) {
    params.append("urlSource", urlSource);
  }

  const response = await fetch(
    `${TRELLO_API_BASE}/cards?${params.toString()}`,
    {
      method: "POST",
    }
  );

  return parseOrThrow(response, "Falha ao criar card no Trello");
}

export async function getRecentCards({ apiKey, apiToken, listId, limit = 5 }) {
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

  if (listDetails?.idBoard) {
    const boardResponse = await fetch(
      `${TRELLO_API_BASE}/boards/${
        listDetails.idBoard
      }?${authParams.toString()}&fields=name`
    );

    const boardDetails = await parseOrThrow(
      boardResponse,
      "Falha ao carregar informações do board do Trello"
    );

    boardName = boardDetails?.name ?? "";
  }

  const params = new URLSearchParams({
    key: apiKey,
    token: apiToken,
    limit: String(limit),
    fields: "name,shortUrl,dateLastActivity,idShort",
  });

  const response = await fetch(
    `${TRELLO_API_BASE}/lists/${listId}/cards?${params.toString()}`
  );

  const data = await parseOrThrow(
    response,
    "Falha ao carregar cards do Trello"
  );

  return (data ?? [])
    .map((card) => ({
      id: card.id,
      name: card.name,
      shortUrl: card.shortUrl,
      dateLastActivity: card.dateLastActivity,
      idShort: card.idShort,
      listId,
      listName: listDetails?.name ?? "",
      boardId: listDetails?.idBoard ?? "",
      boardName,
    }))
    .sort(
      (a, b) =>
        new Date(b.dateLastActivity || 0) - new Date(a.dateLastActivity || 0)
    )
    .slice(0, limit);
}

export async function getLists({ apiKey, apiToken, boardId }) {
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
    fields: "name",
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
    boardName: boardData?.name ?? "",
  }));
}
