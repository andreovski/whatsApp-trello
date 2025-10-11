const defaultLogger = console;

export function createMessageRouter(handlers, options = {}) {
  const { logger = defaultLogger } = options;

  return (message, sender, sendResponse) => {
    if (!message?.type) {
      return;
    }

    const handler = handlers[message.type];

    if (typeof handler !== "function") {
      logger?.warn?.(
        `Nenhum handler registrado para o tipo "${message.type}".`
      );
      return;
    }

    Promise.resolve()
      .then(() => handler(message.payload, { sender, type: message.type }))
      .then((result) => {
        const response = result && typeof result === "object" ? result : {};
        sendResponse({ ok: true, ...response });
      })
      .catch((error) => {
        logger?.error?.(`Erro ao processar mensagem "${message.type}":`, error);
        sendResponse({
          ok: false,
          error: error?.message ?? "Erro desconhecido ao processar mensagem.",
        });
      });

    return true;
  };
}

export default createMessageRouter;
