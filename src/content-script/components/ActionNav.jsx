import React from "react";
import PropTypes from "prop-types";
import { TrelloMark } from "./icons.jsx";

const baseButtonClasses =
  "flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-xl transition-colors";

function buttonToneClasses(tone, isActive) {
  switch (tone) {
    case "accent":
      return isActive
        ? "bg-amber-500 text-foreground"
        : "bg-white/10 text-amber-400 hover:bg-amber-400/20";
    default:
      return isActive
        ? "bg-white text-neutral-900"
        : "bg-white/10 text-white hover:bg-white/20";
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
      className="flex w-28 flex-col items-center gap-6 bg-transparent px-4 py-6 text-white"
      aria-label="CRM WhatsApp"
    >
      <div className="flex w-full flex-col items-center gap-3 rounded-2xl px-2 py-4">
        <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-white/10 px-3 py-3 text-[#E4F0F6]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#026AA7]/90">
            <TrelloMark className="h-7 w-7 text-white" />
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/80">
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
