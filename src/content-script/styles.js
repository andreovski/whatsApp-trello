export const panelWidths = {
  collapsed: 96,
  expanded: 480,
};

export const classes = {
  primaryButton:
    "inline-flex items-center justify-center rounded-md bg-primary gap-2 px-4 py-2 font-semibold text-white transition hover:bg-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-50",
  secondaryButton:
    "inline-flex items-center justify-center rounded-md bg-neutral-200 px-3 py-1 font-semibold text-neutral-700 transition-colors hover:bg-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 gap-2 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
  ghostCloseButton:
    "flex h-9 w-9 items-center justify-center rounded-lg text-lg text-neutral-500 transition hover:bg-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:text-neutral-300 dark:hover:bg-primary/10",
  input:
    "rounded-md border border-black/15 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-neutral-500 placeholder:opacity-75 dark:border-white/20 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-400 dark:placeholder:opacity-80 placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-60",
  card: "flex rounded-xl p-4 bg-zinc-100 dark:bg-zinc-800",
};

export const textareaClasses = `${classes.input} resize-y`;
