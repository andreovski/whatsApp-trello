export default {
  manifest_version: 3,
  name: "CRM WhatsApp Trello",
  description: "Side panel CRM for WhatsApp Web with Trello card creation.",
  version: "0.1.1",
  action: {
    default_title: "CRM WhatsApp Trello",
  },
  options_ui: {
    page: "src/options/index.html",
    open_in_tab: true,
  },
  permissions: ["storage", "scripting", "activeTab"],
  host_permissions: ["https://web.whatsapp.com/*", "http://localhost:5173/*"],
  content_security_policy: {
    extension_pages:
      "script-src 'self'; object-src 'self'; connect-src https://api.trello.com http://localhost:5173; img-src 'self' data:; style-src 'self' 'unsafe-inline'",
  },
  background: {
    service_worker: "src/background/index.js",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://web.whatsapp.com/*"],
      js: ["src/content-script/index.jsx"],
      run_at: "document_idle",
    },
  ],
};
