const VERSION = "v1.1.1";

const STATIC_ASSET_CACHE = `static_asset_cache_${VERSION}`;

/**
 * All static assets used by the application. These assets are cached when the
 * service worker is installed to provide offline support.
 *
 * @type {Array<string>}
 */
const STATIC_ASSETS = [
  // App assets
  "/",

  "/images/favicon.png",

  "/styles/global.css",

  "/scripts/todo.js",
  "/scripts/db.js",
  "/scripts/register.js",

  // App dependencies
  "/shared-components/custom-element.js",
  "/shared-components/utils.js",

  "/shared-components/styles/tokens.css",
  "/shared-components/styles/style-sheets.js",
  "/shared-components/styles/shared-styles.js",

  "/shared-components/button/custom-element.js",
  "/shared-components/button/template.js",

  "/shared-components/card/custom-element.js",
  "/shared-components/card/template.js",

  "/shared-components/circle-xmark/custom-element.js",
  "/shared-components/circle-xmark/template.js",

  "/shared-components/dialog/custom-element.js",
  "/shared-components/dialog/template.js",

  "/shared-components/pen-to-square/custom-element.js",
  "/shared-components/pen-to-square/template.js",

  "/shared-components/text-input/custom-element.js",
  "/shared-components/text-input/template.js",

  // Third-party dependencies
  "/preact/signals-core/signals-core.mjs",
];

// Cast the global object to `ServiceWorkerGlobalScope` since TypeScript will not
// automatically identify that this code is running in a service worker environment.
const UNKNOWN_SCOPE = /** @type {unknown} */ (self);
const GLOBAL_SCOPE = /** @type {ServiceWorkerGlobalScope} */ (UNKNOWN_SCOPE);

// -----------------------------------------------------------------------------
// Cache utils.
// -----------------------------------------------------------------------------

async function getStaticAssetCache() {
  return GLOBAL_SCOPE.caches.open(STATIC_ASSET_CACHE);
}

async function deleteUnusedCaches() {
  const cacheKeys = await GLOBAL_SCOPE.caches.keys();
  const unusedCacheKeys = cacheKeys.filter(
    (cacheKey) => cacheKey !== STATIC_ASSET_CACHE,
  );

  return Promise.all(
    unusedCacheKeys.map((cacheKey) => GLOBAL_SCOPE.caches.delete(cacheKey)),
  );
}

async function cacheStaticAssets() {
  const staticAssetCache = await getStaticAssetCache();
  return staticAssetCache.addAll(STATIC_ASSETS);
}

/**
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleStaticAssetRequest(request) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  return fetch(request);
}

// -----------------------------------------------------------------------------
// Service worker lifecycle utilities and event handlers.
// -----------------------------------------------------------------------------

/**
 * Setup steps to be run during service worker installation.
 */
async function install() {
  try {
    await cacheStaticAssets();
  } catch (err) {
    console.error(`Failed to cache app assets.\n${err}`);
  }
}

/**
 * Manages all cleanup steps that should be run during service worker activation.
 */
async function activate() {
  try {
    await deleteUnusedCaches();
  } catch (err) {
    console.error(`Failed to delete unused caches.\n${err}`);
  }

  try {
    await GLOBAL_SCOPE.clients.claim();
  } catch (err) {
    console.error(`Failed to claim clients.\n${err}`);
  }
}

GLOBAL_SCOPE.addEventListener("install", (installEvent) => {
  GLOBAL_SCOPE.skipWaiting();

  installEvent.waitUntil(install());
});

GLOBAL_SCOPE.addEventListener("activate", (activateEvent) => {
  activateEvent.waitUntil(activate());
});

GLOBAL_SCOPE.addEventListener("fetch", (event) => {
  event.respondWith(handleStaticAssetRequest(event.request));
});
