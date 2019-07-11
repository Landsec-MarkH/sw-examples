importScripts('workbox-v4.3.1/workbox-sw.js');

self.addEventListener('message', async (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

workbox.setConfig({
    debug: true,
    modulePathPrefix: 'workbox-v4.3.1/'
});
workbox.core.clientsClaim();
workbox.precaching.precacheAndRoute([])

const bgSyncPlugin = new workbox.backgroundSync.Plugin('posts', {
    maxRetentionTime: 60 * 24 * 7 // 7 days
});

workbox.routing.registerRoute(
    '/api/sign-up',
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);