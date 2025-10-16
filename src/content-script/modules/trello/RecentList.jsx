import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useTrello } from "../../../shared/trelloContext.js";
import { classes } from "../../styles.js";
import { RefreshIcon } from "../../components/icons.jsx";

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
    <main className="flex flex-1 flex-col overflow-hidden p-3 text-sm text-neutral-700 gap-3 dark:text-white/80">
      <header className="flex items-center justify-between border-b border-black/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:border-white/10 dark:text-white/70">
        <button
          type="button"
          onClick={handleRefresh}
          className={classes.secondaryButton}
        >
          <RefreshIcon className="h-4 w-4" />
          Atualizar
        </button>
      </header>

      <section className="flex flex-1 flex-col gap-4 overflow-auto">
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
    <li
      className={`${classes.card} group rounded-2xl px-4 py-3 transition hover:bg-primary/10 dark:hover:bg-primary/20`}
    >
      <a
        href={card.shortUrl}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col gap-1 text-left w-full"
      >
        {card.listName && (
          <span className="inline-flex w-fit items-center rounded-md bg-primary/15 px-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-primary/80 dark:bg-white/10 dark:text-white/70">
            {card.listName}
          </span>
        )}
        <span className="line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-white">
          {card.name || "Card sem título"}
        </span>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="font-semibold text-primary transition group-hover:text-primary-dark dark:text-primary/80">
            Abrir no Trello ↗
          </span>
          <span className="text-neutral-500 dark:text-white/60">
            {lastActivity}
          </span>
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
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-8 text-center text-sm text-neutral-600 dark:bg-neutral-900 dark:text-white/70">
      <span className="text-2xl" aria-hidden="true">
        🗂️
      </span>
      <p className="text-base font-medium text-neutral-800 dark:text-white">
        Nenhum card recente por aqui.
      </p>
      <p className="text-xs text-neutral-500 dark:text-white/60">
        Assim que você criar novos cards no Trello, eles aparecerão nesta lista.
      </p>
    </div>
  );
}

function RecentListError({ message, onRetry }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-amber-100 px-6 py-8 text-center text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
      <p className="text-sm font-semibold">
        Não foi possível carregar os cards recentes.
      </p>
      <p className="text-xs opacity-80">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-300 dark:bg-amber-500/30 dark:text-amber-100 dark:hover:bg-amber-500/40"
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
          className="animate-pulse rounded-2xl bg-zinc-100 px-4 py-4 dark:bg-zinc-800"
        >
          <div className="mb-2 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="mb-2 h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
          <div className="mb-1 h-2.5 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" />
          <div className="h-2.5 w-1/4 rounded bg-primary/40 dark:bg-primary/30" />
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
