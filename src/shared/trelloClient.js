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
  attachment,
  labelIds,
}) {
  await ensureConfig({ apiKey, apiToken, listId });

  const formData = new FormData();
  formData.append("key", apiKey);
  formData.append("token", apiToken);
  formData.append("idList", listId);
  formData.append("name", name ?? "");
  formData.append("desc", desc ?? "");

  if (Array.isArray(labelIds) && labelIds.length) {
    formData.append("idLabels", labelIds.join(","));
  }

  if (attachment) {
    try {
      const filename = attachment.name ?? "anexo";
      const mimeType = attachment.type || "application/octet-stream";
      let blobToUpload = null;

      if (attachment instanceof Blob) {
        blobToUpload = attachment;
      } else if (attachment?.data) {
        const data = attachment.data;
        let arrayBuffer = null;

        if (data instanceof ArrayBuffer) {
          arrayBuffer = data;
        } else if (ArrayBuffer.isView(data)) {
          arrayBuffer = data.buffer;
        } else if (Array.isArray(data)) {
          arrayBuffer = new Uint8Array(data).buffer;
        }

        if (!arrayBuffer) {
          throw new Error("Conteúdo do arquivo inválido para upload.");
        }

        blobToUpload = new Blob([arrayBuffer], { type: mimeType });
      }

      if (!blobToUpload) {
        throw new Error("Arquivo incompatível para upload no Trello.");
      }

      formData.append("fileSource", blobToUpload, filename);
      if (mimeType) {
        formData.append("mimeType", mimeType);
      }
    } catch (error) {
      console.error("Erro ao preparar anexo para o Trello", error);
      throw new Error("Falha ao processar arquivo para upload no Trello.");
    }
  } else if (urlSource) {
    formData.append("urlSource", urlSource);
  }

  const response = await fetch(`${TRELLO_API_BASE}/cards`, {
    method: "POST",
    body: formData,
  });

  return parseOrThrow(response, "Falha ao criar card no Trello");
}

export async function getLabels({ apiKey, apiToken, boardId }) {
  ensureBoardConfig({ apiKey, apiToken, boardId });

  const params = new URLSearchParams({
    key: apiKey,
    token: apiToken,
    fields: "name,color",
    limit: "1000",
  });

  const response = await fetch(
    `${TRELLO_API_BASE}/boards/${boardId}/labels?${params.toString()}`
  );

  const data = await parseOrThrow(
    response,
    "Falha ao carregar etiquetas do Trello"
  );

  return (data ?? []).map((label) => ({
    id: label.id,
    name: label.name || "(Sem título)",
    color: label.color || "gray",
  }));
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
