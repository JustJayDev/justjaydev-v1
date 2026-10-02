/*
 * Registers the service worker.
 *
 * Kept out of the main bundle path that matters: it only runs after load, and
 * registration failure is non-fatal, so the site works with no service worker
 * support at all. The worker is deliberately not registered in dev, where stale
 * caching gets in the way of iterating.
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/justjaydev-v1/sw.js', { scope: '/justjaydev-v1/' })
      .catch(() => {
        /* offline support is a bonus, never a requirement */
      })
  })
}