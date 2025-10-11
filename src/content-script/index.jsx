import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { TrelloProvider } from "../shared/trelloContext.js";
import "./tailwind.css";

function mount() {
  const id = "crm-whatsapp-trello-panel";
  if (document.getElementById(id)) return;

  const container = document.createElement("div");
  container.id = id;
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <TrelloProvider>
      <App />
    </TrelloProvider>
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
