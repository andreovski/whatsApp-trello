import { g as createRoot, j as jsxRuntimeExports, h as TrelloProvider, r as reactExports, b as Config } from "./tailwind-BvF4Prf2.js";
import "./storage-CLrKxZkh.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function OptionsApp() {
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  reactExports.useEffect(() => {
    if (saveStatus !== "success") {
      return void 0;
    }
    const timeoutId = setTimeout(() => setSaveStatus("idle"), 3500);
    return () => clearTimeout(timeoutId);
  }, [saveStatus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-neutral-100", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-white/10 bg-black/40 px-6 py-6 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex w-full max-w-3xl flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold text-white", children: "Configurações" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70", children: "Conecte sua conta Trello e personalize a experiência de criação de cards do CRM." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex flex-1 justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex w-full max-w-3xl flex-col gap-6", children: [
      saveStatus === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 shadow", children: "Configurações salvas com sucesso!" }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-white/15 bg-white/5 shadow-xl backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Config, { onClose: () => setSaveStatus("success") }) })
    ] }) })
  ] });
}
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(TrelloProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(OptionsApp, {}) })
  );
}
