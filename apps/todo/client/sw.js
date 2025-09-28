const VERSION = "v1";

/** @type {Array<string>} */
const STATIC_ASSETS = [
  // HTML
  "/",

  // CSS
  "/shared-components/global.css",
  "/global.css",
  "/todo.css",

  // JS dependencies
  "https://esm.sh/@preact/signals-core@1.11.0",
  "https://esm.sh/@preact/signals-core@1.11.0/es2022/signals-core.mjs",

  // JS
  "/todo.js",
  "/shared-components/components.js",
  "/shared-components/utils.js",
  "/db.js",
  "/register.js",
  "/shared-components/custom-element.js",
  "/shared-components/button/button-custom-element.js",
  "/shared-components/card/card-custom-element.js",
  "/shared-components/circle-xmark/circle-xmark-custom-element.js",
  "/shared-components/dialog/dialog-custom-element.js",
  "/shared-components/pen-to-square/pen-to-square-custom-element.js",
  "/shared-components/text-input/text-input-custom-element.js",
  "/shared-components/default-styles.js",
  "/shared-components/button/button-template.js",
  "/shared-components/style-sheets.js",
  "/shared-components/card/card-template.js",
  "/shared-components/circle-xmark/circle-xmark-template.js",
  "/shared-components/pen-to-square/pen-to-square-template.js",
  "/shared-components/dialog/dialog-template.js",
  "/shared-components/text-input/text-input-template.js",
];

const unknownScope = /** @type {unknown} */ (self);
const globalScope = /** @type {ServiceWorkerGlobalScope} */ (unknownScope);

function getCacheName() {
  return `todo-cache-${VERSION}`;
}

async function getCache() {
  return caches.open(getCacheName());
}

async function cacheAssets() {
  try {
    const staticCache = await getCache();
    await staticCache.addAll(STATIC_ASSETS);
  } catch (err) {
    console.error(`Failed to cache app assets.\n${err}`);
  }
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  return fetch(request);
}

globalScope.addEventListener("install", (installEvent) => {
  installEvent.waitUntil(cacheAssets());
});

globalScope.addEventListener("fetch", (event) => {
  event.respondWith(handleAssetRequest(event.request));
});
