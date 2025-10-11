export const panelWidths = {
  collapsed: 96,
  expanded: 480,
};

export const classes = {
  primaryButton:
    "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50",
  secondaryButton:
    "inline-flex items-center justify-center rounded-md border border-primary/40 bg-white px-4 py-2 font-semibold text-primary shadow-sm transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-primary/30 dark:bg-neutral-900 dark:text-primary/80 dark:hover:bg-neutral-800",
  ghostCloseButton:
    "flex h-9 w-9 items-center justify-center rounded-lg text-lg transition hover:bg-primary/10",
  input:
    "rounded-md border border-black/20 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-neutral-500 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400",
};

export const textareaClasses = `${classes.input} resize-y`;
