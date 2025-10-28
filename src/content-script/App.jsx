import React, { useEffect, useRef, useState } from "react";
import { ActionNav } from "./components/ActionNav.jsx";
import { PanelHeader } from "./components/PanelHeader.jsx";
import { panelWidths } from "./styles.js";
import {
  PlusIcon,
  ListIcon,
  TemplateIcon,
  CogIcon,
} from "./components/icons.jsx";
import { Config } from "./modules/config/Config.jsx";
import { CreateCard } from "./modules/trello/CreateCard.jsx";
import { RecentList } from "./modules/trello/RecentList.jsx";
import { TemplateCreatePanel } from "./modules/trello/TemplateCreatePanel.jsx";

const TRELLO_ACTIONS = [
  {
    id: "create",
    label: "Novo card",
    icon: <PlusIcon />,
  },
  {
    id: "recent",
    label: "Cards recentes",
    icon: <ListIcon />,
  },
  {
    id: "templates",
    label: "Cadastrar template",
    icon: <TemplateIcon />,
  },
];

const CONFIG_ACTION = {
  id: "config",
  label: "Configurações",
  icon: <CogIcon />,
};

const VIEW_TITLES = {
  create: "Criar card no Trello",
  templates: "Cadastrar template",
  recent: "Cards recentes",
  config: "Configurações do Trello",
};

export default function App() {
  const [isExpanded, setExpanded] = useState(false);
  const [activeView, setActiveView] = useState("create");
  const layoutRestore = useRef({
    element: null,
    paddingRight: null,
  });
  const containerRef = useRef(null);
  const [recentRefreshToken, setRecentRefreshToken] = useState(Date.now());

  useEffect(() => {
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

  useEffect(() => {
    return () => {
      const { element, paddingRight } = layoutRestore.current;
      if (element) {
        element.style.paddingRight = paddingRight ?? "";
      }
    };
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
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

  function handleExpandForDrop() {
    if (!isExpanded) {
      setExpanded(true);
    }
    if (activeView !== "create") {
      setActiveView("create");
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex h-full justify-center flex-row bg-white/50 text-neutral-900 backdrop-blur-xl transition-[width] duration-200 ease-out dark:bg-neutral-900/70 dark:text-neutral-100"
      style={{ width: `${panelWidth}px` }}
    >
      <ActionNav
        trelloActions={TRELLO_ACTIONS}
        configAction={CONFIG_ACTION}
        activeView={activeView}
        isExpanded={isExpanded}
        onSelect={handleActionClick}
        onRequestExpand={handleExpandForDrop}
      />

      <div
        className={`flex flex-1 flex-col ${isExpanded ? "" : "hidden"}`}
        style={{ width: `${panelWidth - panelWidths.collapsed}px` }}
        aria-hidden={!isExpanded}
      >
        <PanelHeader
          title={VIEW_TITLES[activeView]}
          onCollapse={handleCollapse}
        />

        {activeView === "config" ? (
          <Config onClose={handleCollapse} />
        ) : activeView === "create" ? (
          <CreateCard
            onCardCreated={handleCardCreated}
            onRequireConfig={handleRequireConfig}
          />
        ) : activeView === "templates" ? (
          <TemplateCreatePanel />
        ) : (
          <RecentList refreshToken={recentRefreshToken} />
        )}
      </div>
    </div>
  );
}
