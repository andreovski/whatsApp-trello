import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { TrelloProvider } from "../shared/trelloContext.js";
import { Config } from "../content-script/modules/config/Config.jsx";
import "../content-script/tailwind.css";

function OptionsApp() {
  const [saveStatus, setSaveStatus] = useState("idle");

  useEffect(() => {
    if (saveStatus !== "success") {
      return undefined;
    }

    const timeoutId = setTimeout(() => setSaveStatus("idle"), 3500);
    return () => clearTimeout(timeoutId);
  }, [saveStatus]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-neutral-900 via-neutral-950 to-black text-neutral-100">
      <header className="border-b border-white/10 bg-black/40 px-6 py-6 shadow-lg">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          <h1 className="text-2xl font-semibold text-white">Configurações</h1>
          <p className="text-sm text-white/70">
            Conecte sua conta Trello e personalize a experiência de criação de
            cards do CRM.
          </p>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-4 py-10">
        <section className="flex w-full max-w-3xl flex-col gap-6">
          {saveStatus === "success" ? (
            <div className="rounded-lg border border-emerald-400/50 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 shadow">
              Configurações salvas com sucesso!
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/15 bg-white/5 shadow-xl backdrop-blur">
            <Config onClose={() => setSaveStatus("success")} />
          </div>
        </section>
      </main>
    </div>
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <TrelloProvider>
      <OptionsApp />
    </TrelloProvider>
  );
}
