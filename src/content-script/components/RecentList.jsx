import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTrello } from "../../shared/trelloContext.js";

const MAX_CARDS = 15;

export function RecentList({ refreshToken }) {
  const { config, getRecentCards } = useTrello();
  const lastListId = config?.lastListId || "";
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [manualTrigger, setManualTrigger] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadRecentCards() {
      setLoading(true);
      setError(null);

      try {
        const result = await getRecentCards({
          limit: MAX_CARDS,
          listId: lastListId || undefined,
        });

        if (!active) return;

        if (!result.ok) {
          throw new Error(
            result.error?.message ?? "Falha ao obter cards recentes."
          );
        }

        setCards(result.cards ?? []);
      } catch (err) {
        if (!active) return;
        console.error("Erro ao buscar cards recentes", err);
        setError(err.message ?? "Ocorreu um erro inesperado.");
        setCards([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRecentCards();

    return () => {
      active = false;
    };
  }, [refreshToken, manualTrigger, lastListId, getRecentCards]);

  const hasCards = cards.length > 0;

  function handleRefresh() {
    setManualTrigger((prev) => prev + 1);
  }

  return (
    <main className="flex flex-1 flex-col overflow-hidden text-sm text-white/80">
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
        <button
          type="button"
          onClick={handleRefresh}
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:border-white/20 hover:bg-white/20"
        >
          Atualizar
        </button>
      </header>

      <section className="flex flex-1 flex-col gap-4 overflow-auto px-5 py-5">
        {loading ? (
          <RecentListSkeleton />
        ) : error ? (
          <RecentListError message={error} onRetry={handleRefresh} />
        ) : hasCards ? (
          <ul className="flex flex-col gap-3">
            {cards.map((card) => (
              <RecentListItem key={card.id} card={card} />
            ))}
          </ul>
        ) : (
          <RecentListEmpty />
        )}
      </section>
    </main>
  );
}

RecentList.propTypes = {
  refreshToken: PropTypes.number.isRequired,
};

function RecentListItem({ card }) {
  const lastActivity = useMemo(
    () => formatDate(card.dateLastActivity),
    [card.dateLastActivity]
  );

  return (
    <li className="group rounded-2xl border border-white/5 bg-white/5 px-4 py-3 shadow-sm transition hover:border-primary/40 hover:bg-primary/10">
      <a
        href={card.shortUrl}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-1 text-left"
      >
        {card.listName && (
          <span className="inline-flex w-fit items-center rounded-md border border-white/15 bg-white/10 px-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-white/70">
            {card.listName}
          </span>
        )}
        <span className="line-clamp-2 text-sm font-semibold text-white">
          {card.name || "Card sem título"}
        </span>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-primary/80 transition group-hover:text-primary">
            Abrir no Trello ↗
          </span>
          <span className="text-white/60">{lastActivity}</span>
        </div>
      </a>
    </li>
  );
}

RecentListItem.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    shortUrl: PropTypes.string,
    dateLastActivity: PropTypes.string,
    listId: PropTypes.string,
    listName: PropTypes.string,
    boardId: PropTypes.string,
    boardName: PropTypes.string,
  }).isRequired,
};

function RecentListEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-8 text-center text-sm text-white/70">
      <span className="text-2xl" aria-hidden="true">
        🗂️
      </span>
      <p className="text-base font-medium text-white">
        Nenhum card recente por aqui.
      </p>
      <p className="text-xs text-white/60">
        Assim que você criar novos cards no Trello, eles aparecerão nesta lista.
      </p>
    </div>
  );
}

function RecentListError({ message, onRetry }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-6 py-8 text-center">
      <p className="text-sm font-semibold text-amber-200">
        Não foi possível carregar os cards recentes.
      </p>
      <p className="text-xs text-amber-200/80">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-amber-300/40 px-4 py-2 text-xs font-semibold text-amber-100 transition hover:border-amber-200 hover:bg-amber-400/20"
      >
        Tentar novamente
      </button>
    </div>
  );
}

RecentListError.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

function RecentListSkeleton() {
  return (
    <ul className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <li
          key={index}
          className="animate-pulse rounded-2xl border border-white/5 bg-white/5 px-4 py-4"
        >
          <div className="mb-2 h-4 w-3/4 rounded bg-white/20" />
          <div className="mb-2 h-3 w-2/3 rounded bg-white/20" />
          <div className="mb-1 h-2.5 w-1/3 rounded bg-white/10" />
          <div className="h-2.5 w-1/4 rounded bg-primary/20" />
        </li>
      ))}
    </ul>
  );
}

function formatDate(isoString) {
  if (!isoString) {
    return "Sem atividade registrada";
  }

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "Sem atividade registrada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
