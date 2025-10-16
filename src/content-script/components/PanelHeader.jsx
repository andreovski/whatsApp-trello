import React from "react";
import PropTypes from "prop-types";
import { classes } from "../styles.js";

export function PanelHeader({ title, onCollapse }) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <button
        className={`${classes.ghostCloseButton} text-neutral-500 dark:text-neutral-300`}
        type="button"
        aria-label="Recolher painel"
        onClick={onCollapse}
      >
        <span aria-hidden="true">×</span>
      </button>
    </header>
  );
}

PanelHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onCollapse: PropTypes.func.isRequired,
};
