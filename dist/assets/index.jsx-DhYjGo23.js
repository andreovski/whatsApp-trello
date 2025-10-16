import { P as PropTypes, j as jsxRuntimeExports, T as TrelloMark, c as classes, u as useTrello, r as reactExports, C as CheckFileIcon, R as RefreshIcon, t as textareaClasses, a as CheckTopicsIcon, p as panelWidths, b as Config, d as CogIcon, e as PlusIcon, L as ListIcon, f as TemplateIcon, g as createRoot, h as TrelloProvider } from "./tailwind-BvF4Prf2.js";
import "./storage-CLrKxZkh.js";
const baseButtonClasses = "flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
function buttonToneClasses(tone, isActive) {
  switch (tone) {
    case "accent":
      return isActive ? "bg-amber-500 text-white dark:text-neutral-900" : "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 dark:bg-white/10 dark:text-amber-300 dark:hover:bg-amber-400/20";
    default:
      return isActive ? "bg-primary text-white dark:bg-white dark:text-neutral-900" : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20";
  }
}
function ActionNav({
  trelloActions,
  configAction,
  activeView,
  isExpanded,
  onSelect
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "nav",
    {
      className: "flex w-28 flex-col items-center gap-6 px-4 py-6 text-neutral-700 dark:text-white",
      "aria-label": "CRM WhatsApp",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex w-full flex-col items-center gap-3 px-2 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-full flex-col items-center gap-4 rounded-2xl bg-zinc-100 px-3 py-3 text-neutral-600 dark:bg-zinc-800 dark:text-[#E4F0F6]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-[#026AA7]/90", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrelloMark, { className: "h-7 w-7 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/80", children: "Trello" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: trelloActions.map(({ id, label, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "aria-label": label,
              title: label,
              onClick: () => onSelect(id),
              className: `${baseButtonClasses} ${buttonToneClasses(
                "neutral",
                isExpanded && activeView === id
              )}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "aria-hidden": "true",
                  className: "flex h-6 w-6 items-center justify-center",
                  children: icon
                }
              )
            },
            id
          )) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            "aria-label": configAction.label,
            title: configAction.label,
            onClick: () => onSelect(configAction.id),
            className: `${baseButtonClasses} ${buttonToneClasses(
              "accent",
              isExpanded && activeView === configAction.id
            )}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": "true",
                className: "flex h-6 w-6 items-center justify-center",
                children: configAction.icon
              }
            )
          }
        ) })
      ]
    }
  );
}
const actionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
});
ActionNav.propTypes = {
  trelloActions: PropTypes.arrayOf(actionShape).isRequired,
  configAction: actionShape.isRequired,
  activeView: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
  onSelect: PropTypes.func.isRequired
};
ActionNav.defaultProps = {
  isExpanded: true
};
function PanelHeader({ title, onCollapse }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-6 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `${classes.ghostCloseButton} text-neutral-500 dark:text-neutral-300`,
        type: "button",
        "aria-label": "Recolher painel",
        onClick: onCollapse,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": "true", children: "×" })
      }
    )
  ] });
}
PanelHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onCollapse: PropTypes.func.isRequired
};
const STATUS_LABELS = {
  idle: "Pronto",
  loading: "Enviando…",
  success: "Card criado! ✅",
  error: "Erro ao criar card."
};
const EMPTY_FORM = Object.freeze({
  title: "",
  summary: "",
  notes: "",
  listId: ""
});
function CreateCard({ onCardCreated, onRequireConfig }) {
  const {
    config,
    status,
    error,
    setError,
    createCard,
    lists,
    setPreferredList,
    noteTemplates,
    isConfigReady
  } = useTrello();
  const [values, setValues] = reactExports.useState(() => ({ ...EMPTY_FORM }));
  reactExports.useEffect(() => {
    setValues((prev) => ({
      ...prev,
      listId: (config == null ? void 0 : config.lastListId) ?? prev.listId
    }));
  }, [config == null ? void 0 : config.lastListId]);
  const applyFallbackList = reactExports.useCallback(
    (listId) => {
      if (!listId) return;
      setValues((prev) => {
        if (prev.listId === listId) {
          return prev;
        }
        return { ...prev, listId };
      });
      setPreferredList(listId);
    },
    [setPreferredList]
  );
  reactExports.useEffect(() => {
    var _a;
    if (!(lists == null ? void 0 : lists.length)) {
      setValues((prev) => {
        if (!prev.listId) {
          return prev;
        }
        return { ...prev, listId: "" };
      });
      return;
    }
    const preferred = lists.find((list) => list.id === (config == null ? void 0 : config.lastListId));
    if (preferred) {
      setValues((prev) => {
        if (prev.listId === preferred.id) {
          return prev;
        }
        return { ...prev, listId: preferred.id };
      });
      return;
    }
    const fallbackId = ((_a = lists[0]) == null ? void 0 : _a.id) ?? "";
    if (!fallbackId) {
      return;
    }
    const hasValidList = lists.some((list) => list.id === values.listId);
    if (!hasValidList) {
      applyFallbackList(fallbackId);
    }
  }, [lists, config == null ? void 0 : config.lastListId, values.listId, applyFallbackList]);
  const statusLabel = STATUS_LABELS[status] ?? STATUS_LABELS.idle;
  const isFormValid = reactExports.useMemo(
    () => Boolean(values.title.trim()) && Boolean(values.listId) && isConfigReady,
    [values.title, values.listId, isConfigReady]
  );
  const handleChange = reactExports.useCallback(
    (field, value) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (field === "listId" && value) {
        setPreferredList(value);
      }
      if (error) {
        setError(null);
      }
    },
    [error, setError, setPreferredList]
  );
  const handleApplyTemplate = reactExports.useCallback(
    (template) => {
      if (!(template == null ? void 0 : template.notes)) return;
      setValues((prev) => ({ ...prev, notes: template.notes }));
      if (error) {
        setError(null);
      }
    },
    [error, setError]
  );
  const handleSubmit = reactExports.useCallback(
    async (event) => {
      var _a;
      (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
      if (!isFormValid) {
        if (!isConfigReady && onRequireConfig) {
          onRequireConfig();
        }
        return;
      }
      const recentMessages = values.notes.split("\n").map((msg) => msg.trim()).filter(Boolean);
      const payload = {
        title: values.title.trim() || "Card sem título",
        summary: values.summary.trim(),
        recentMessages,
        generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        urlSource: window.location.href,
        listId: values.listId
      };
      const result = await createCard(payload);
      if (result.ok) {
        if (onCardCreated) {
          onCardCreated(result.result ?? null);
        }
      }
    },
    [
      createCard,
      isConfigReady,
      isFormValid,
      onCardCreated,
      onRequireConfig,
      values
    ]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex flex-1 flex-col gap-4 overflow-y-auto text-sm leading-relaxed p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      className: `${classes.card} flex-col gap-4`,
      onSubmit: handleSubmit,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col gap-2 ", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium  text-neutral-700 dark:text-neutral-300", children: "Título do card" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: values.title,
              className: classes.input,
              onChange: (event) => handleChange("title", event.target.value),
              placeholder: "Nome do card no Trello"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col gap-2 text-neutral-700 dark:text-neutral-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Lista do Trello" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: values.listId,
              className: classes.input,
              onChange: (event) => handleChange("listId", event.target.value),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione uma lista..." }),
                lists == null ? void 0 : lists.map((list) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: list.id, children: list.boardName ? `${list.boardName} / ${list.name}` : list.name }, list.id))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col gap-2 text-neutral-700 dark:text-neutral-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Observações" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              rows: 3,
              value: values.summary,
              onChange: (event) => handleChange("summary", event.target.value),
              placeholder: "Observações resumidas",
              className: classes.input
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col gap-2 text-neutral-700 dark:text-neutral-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Descrição" }),
          !!noteTemplates.length && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-neutral-500", children: "Templates disponíveis" }),
          !!(noteTemplates == null ? void 0 : noteTemplates.length) && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "flex gap-2 pb-1 mx-1 overflow-x-auto max-w-[310px]", children: noteTemplates.map((template) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleApplyTemplate == null ? void 0 : handleApplyTemplate(template),
              className: "flex-shrink-0 rounded-md border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary/20 focus:outline-none focus-visible:ring focus-visible:ring-primary/40 dark:border-primary/30 dark:bg-primary/20 dark:hover:bg-primary/30",
              children: template.label
            },
            template.id
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              rows: 6,
              value: values.notes,
              onChange: (event) => handleChange("notes", event.target.value),
              className: classes.input
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-neutral-500 dark:text-neutral-400", children: "Cada linha será adicionada como um item no card." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-medium text-neutral-500 dark:text-neutral-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: status === "success" ? "text-primary" : status === "error" ? "text-red-500" : "text-neutral-500 dark:text-neutral-300",
                children: statusLabel
              }
            ),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-red-500", children: error })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "submit",
              className: classes.primaryButton,
              disabled: !isFormValid || status === "loading",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CheckFileIcon, { className: "h-5 w-5" }),
                "Criar card no Trello"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
CreateCard.propTypes = {
  onCardCreated: PropTypes.func,
  onRequireConfig: PropTypes.func
};
CreateCard.defaultProps = {
  onCardCreated: void 0,
  onRequireConfig: void 0
};
const MAX_CARDS = 15;
function RecentList({ refreshToken }) {
  const { config, getRecentCards } = useTrello();
  const lastListId = (config == null ? void 0 : config.lastListId) || "";
  const [cards, setCards] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [manualTrigger, setManualTrigger] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let active = true;
    async function loadRecentCards() {
      var _a;
      setLoading(true);
      setError(null);
      try {
        const result = await getRecentCards({
          limit: MAX_CARDS,
          listId: lastListId || void 0
        });
        if (!active) return;
        if (!result.ok) {
          throw new Error(
            ((_a = result.error) == null ? void 0 : _a.message) ?? "Falha ao obter cards recentes."
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex flex-1 flex-col overflow-hidden p-3 text-sm text-neutral-700 gap-3 dark:text-white/80", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex items-center justify-between border-b border-black/10 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:border-white/10 dark:text-white/70", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: handleRefresh,
        className: classes.secondaryButton,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshIcon, { className: "h-4 w-4" }),
          "Atualizar"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "flex flex-1 flex-col gap-4 overflow-auto", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RecentListSkeleton, {}) : error ? /* @__PURE__ */ jsxRuntimeExports.jsx(RecentListError, { message: error, onRetry: handleRefresh }) : hasCards ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-3", children: cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecentListItem, { card }, card.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RecentListEmpty, {}) })
  ] });
}
RecentList.propTypes = {
  refreshToken: PropTypes.number.isRequired
};
function RecentListItem({ card }) {
  const lastActivity = reactExports.useMemo(
    () => formatDate(card.dateLastActivity),
    [card.dateLastActivity]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "li",
    {
      className: `${classes.card} group rounded-2xl px-4 py-3 transition hover:bg-primary/10 dark:hover:bg-primary/20`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: card.shortUrl,
          target: "_blank",
          rel: "noreferrer",
          className: "flex flex-col gap-1 text-left w-full",
          children: [
            card.listName && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex w-fit items-center rounded-md bg-primary/15 px-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-primary/80 dark:bg-white/10 dark:text-white/70", children: card.listName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2 text-sm font-semibold text-neutral-900 dark:text-white", children: card.name || "Card sem título" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary transition group-hover:text-primary-dark dark:text-primary/80", children: "Abrir no Trello ↗" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-neutral-500 dark:text-white/60", children: lastActivity })
            ] })
          ]
        }
      )
    }
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
    boardName: PropTypes.string
  }).isRequired
};
function RecentListEmpty() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 py-8 text-center text-sm text-neutral-600 dark:bg-neutral-900 dark:text-white/70", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", "aria-hidden": "true", children: "🗂️" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-neutral-800 dark:text-white", children: "Nenhum card recente por aqui." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-neutral-500 dark:text-white/60", children: "Assim que você criar novos cards no Trello, eles aparecerão nesta lista." })
  ] });
}
function RecentListError({ message, onRetry }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col items-center justify-center gap-4 rounded-2xl bg-amber-100 px-6 py-8 text-center text-amber-800 dark:bg-amber-500/20 dark:text-amber-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Não foi possível carregar os cards recentes." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-80", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onRetry,
        className: "rounded-lg bg-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-300 dark:bg-amber-500/30 dark:text-amber-100 dark:hover:bg-amber-500/40",
        children: "Tentar novamente"
      }
    )
  ] });
}
RecentListError.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired
};
function RecentListSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-3", children: Array.from({ length: 4 }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "li",
    {
      className: "animate-pulse rounded-2xl bg-zinc-100 px-4 py-4 dark:bg-zinc-800",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 h-3 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 h-2.5 w-1/3 rounded bg-neutral-100 dark:bg-neutral-800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2.5 w-1/4 rounded bg-primary/40 dark:bg-primary/30" })
      ]
    },
    index
  )) });
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
    timeStyle: "short"
  }).format(date);
}
const INITIAL_STATE = Object.freeze({
  label: "",
  notes: ""
});
function TemplateCreatePanel() {
  const { config, createTemplate, loadingTemplates } = useTrello();
  const [form, setForm] = reactExports.useState(() => ({ ...INITIAL_STATE }));
  const [status, setStatus] = reactExports.useState("idle");
  const [message, setMessage] = reactExports.useState(null);
  const isReady = reactExports.useMemo(
    () => (config == null ? void 0 : config.templateSourceType) === "file",
    [config == null ? void 0 : config.templateSourceType]
  );
  const isSubmitting = status === "loading";
  const isValid = reactExports.useMemo(() => {
    return form.label.trim().length > 0 && form.notes.trim().length > 0;
  }, [form.label, form.notes]);
  const handleChange = reactExports.useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage(null);
    setStatus("idle");
  }, []);
  const resetForm = reactExports.useCallback(() => {
    setForm(() => ({ ...INITIAL_STATE }));
  }, []);
  const handleSubmit = reactExports.useCallback(
    async (event) => {
      event.preventDefault();
      if (!isValid || !isReady || isSubmitting) {
        return;
      }
      setStatus("loading");
      setMessage(null);
      const result = await createTemplate({
        label: form.label,
        notes: form.notes
      });
      if (result.ok) {
        setStatus("success");
        setMessage("Template criado e sincronizado com o arquivo.");
        resetForm();
      } else {
        setStatus("error");
        setMessage(result.error ?? "Falha ao criar template.");
      }
    },
    [
      createTemplate,
      form.label,
      form.notes,
      isReady,
      isSubmitting,
      isValid,
      resetForm
    ]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto text-sm text-neutral-800 dark:text-neutral-100 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "flex flex-col gap-4", onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: `${classes.card} flex-col gap-2`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-col gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Cadastrar novo template" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-neutral-500 dark:text-neutral-300", children: "Informe um nome e a descrição que será aplicada ao card. O arquivo configurado receberá a atualização automaticamente ao salvar." })
      ] }),
      !isReady ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-amber-100 px-3 py-3 text-xs text-amber-700 dark:bg-amber-500/20 dark:text-amber-200", children: "Selecione um arquivo de templates nas configurações antes de cadastrar novos modelos." }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col gap-2 text-neutral-700 dark:text-neutral-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400", children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: form.label,
            onChange: (event) => handleChange("label", event.target.value),
            placeholder: "Ex.: Follow-up pós-reunião",
            className: classes.input,
            disabled: !isReady || isSubmitting || loadingTemplates,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex flex-col gap-2 text-neutral-700 dark:text-neutral-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400", children: "Descrição" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            value: form.notes,
            onChange: (event) => handleChange("notes", event.target.value),
            placeholder: "Faça uma lista com os tópicos que devem constar no card...",
            className: `${textareaClasses} min-h-[140px]`,
            disabled: !isReady || isSubmitting || loadingTemplates,
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-3 mt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "text-xs font-medium text-neutral-500 underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:opacity-50",
            onClick: resetForm,
            disabled: isSubmitting || !form.label && !form.notes,
            children: "Limpar campos"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "submit",
            className: classes.primaryButton,
            disabled: !isReady || !isValid || isSubmitting || loadingTemplates,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CheckTopicsIcon, {}),
              isSubmitting ? "Salvando..." : "Salvar template"
            ]
          }
        )
      ] })
    ] }),
    message ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `rounded-md px-3 py-3 text-xs ${status === "success" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200"}`,
        children: message
      }
    ) : null
  ] }) });
}
const TRELLO_ACTIONS = [
  {
    id: "create",
    label: "Novo card",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(PlusIcon, {})
  },
  {
    id: "recent",
    label: "Cards recentes",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ListIcon, {})
  },
  {
    id: "templates",
    label: "Cadastrar template",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateIcon, {})
  }
];
const CONFIG_ACTION = {
  id: "config",
  label: "Configurações",
  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CogIcon, {})
};
const VIEW_TITLES = {
  create: "Criar card no Trello",
  templates: "Cadastrar template",
  recent: "Cards recentes",
  config: "Configurações do Trello"
};
function App() {
  const [isExpanded, setExpanded] = reactExports.useState(false);
  const [activeView, setActiveView] = reactExports.useState("create");
  const layoutRestore = reactExports.useRef({
    element: null,
    paddingRight: null
  });
  const containerRef = reactExports.useRef(null);
  const [recentRefreshToken, setRecentRefreshToken] = reactExports.useState(Date.now());
  reactExports.useEffect(() => {
    let target = layoutRestore.current.element;
    if (!target || !document.contains(target)) {
      target = document.querySelector("#app") || document.body;
      layoutRestore.current.element = target;
      if (layoutRestore.current.paddingRight === null) {
        layoutRestore.current.paddingRight = target.style.paddingRight;
      }
    }
    if (target) {
      target.style.paddingRight = "95px";
    }
  }, [isExpanded]);
  reactExports.useEffect(() => {
    return () => {
      const { element, paddingRight } = layoutRestore.current;
      if (element) {
        element.style.paddingRight = paddingRight ?? "";
      }
    };
  }, []);
  reactExports.useEffect(() => {
    if (!isExpanded) {
      return void 0;
    }
    function handlePointerDown(event) {
      const root = containerRef.current;
      if (!root) return;
      if (!root.contains(event.target)) {
        setExpanded(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [isExpanded]);
  function handleActionClick(view) {
    setActiveView(view);
    setExpanded(true);
    if (view === "recent") {
      setRecentRefreshToken(Date.now());
    }
  }
  function handleCollapse() {
    setExpanded(false);
  }
  const panelWidth = isExpanded ? panelWidths.expanded : panelWidths.collapsed;
  function handleCardCreated() {
    setRecentRefreshToken(Date.now());
  }
  function handleRequireConfig() {
    setActiveView("config");
    setExpanded(true);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: "flex h-full justify-center flex-row bg-white/50 text-neutral-900 backdrop-blur-xl transition-[width] duration-200 ease-out dark:bg-neutral-900/70 dark:text-neutral-100",
      style: { width: `${panelWidth}px` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActionNav,
          {
            trelloActions: TRELLO_ACTIONS,
            configAction: CONFIG_ACTION,
            activeView,
            isExpanded,
            onSelect: handleActionClick
          }
        ),
        isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            PanelHeader,
            {
              title: VIEW_TITLES[activeView],
              onCollapse: handleCollapse
            }
          ),
          activeView === "config" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Config, { onClose: handleCollapse }) : activeView === "create" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            CreateCard,
            {
              onCardCreated: handleCardCreated,
              onRequireConfig: handleRequireConfig
            }
          ) : activeView === "templates" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TemplateCreatePanel, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(RecentList, { refreshToken: recentRefreshToken })
        ] })
      ]
    }
  );
}
function mount() {
  const id = "crm-whatsapp-trello-panel";
  if (document.getElementById(id)) return;
  const container = document.createElement("div");
  container.id = id;
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrelloProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
