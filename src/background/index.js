import handlers from "./handlers/index.js";
import { createMessageRouter } from "./router.js";

const router = createMessageRouter(handlers);

chrome.runtime.onMessage.addListener(router);
