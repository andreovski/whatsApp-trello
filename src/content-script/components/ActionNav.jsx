import React from "react";
import PropTypes from "prop-types";
import { TrelloMark } from "./icons.jsx";

const baseButtonClasses =
  "flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

function buttonToneClasses(tone, isActive) {
  switch (tone) {
    case "accent":
      return isActive
        ? "bg-amber-500 text-white dark:text-neutral-900"
        : "bg-amber-500/20 text-amber-600 hover:bg-amber-500/30 dark:bg-white/10 dark:text-amber-300 dark:hover:bg-amber-400/20";
    default:
      return isActive
        ? "bg-primary text-white dark:bg-white dark:text-neutral-900"
        : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20";
  }
}

export function ActionNav({
  trelloActions,
  configAction,
  activeView,
  isExpanded,
  onSelect,
}) {
  return (
    <nav
      className="flex w-28 flex-col items-center gap-6 px-4 py-6 text-neutral-700 dark:text-white"
      aria-label="CRM WhatsApp"
    >
      <div className="flex w-full flex-col items-center gap-3 px-2 py-4">
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-zinc-100 px-3 py-3 text-neutral-600 dark:bg-zinc-800 dark:text-[#E4F0F6]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#026AA7]/90">
            <TrelloMark className="h-7 w-7 text-white" />
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-white/80">
            Trello
          </span>

          <div className="flex flex-col gap-3">
            {trelloActions.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                aria-label={label}
                title={label}
                onClick={() => onSelect(id)}
                className={`${baseButtonClasses} ${buttonToneClasses(
                  "neutral",
                  isExpanded && activeView === id
                )}`}
              >
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 items-center justify-center"
                >
                  {icon}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-auto">
        <button
          type="button"
          aria-label={configAction.label}
          title={configAction.label}
          onClick={() => onSelect(configAction.id)}
          className={`${baseButtonClasses} ${buttonToneClasses(
            "accent",
            isExpanded && activeView === configAction.id
          )}`}
        >
          <span
            aria-hidden="true"
            className="flex h-6 w-6 items-center justify-center"
          >
            {configAction.icon}
          </span>
        </button>
      </div>
    </nav>
  );
}

const actionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
});

ActionNav.propTypes = {
  trelloActions: PropTypes.arrayOf(actionShape).isRequired,
  configAction: actionShape.isRequired,
  activeView: PropTypes.string.isRequired,
  isExpanded: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

ActionNav.defaultProps = {
  isExpanded: true,
};
