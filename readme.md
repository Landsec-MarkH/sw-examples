# Prerequisites 

* npm install http-server -g

# Angular Service Worker

Caches static files to enable offline content. Has no mechanism to configure replaying post request. Cannot extend functionality.

* ng new angular-sw --minimal=true 
* ng add @angular/pwa
* ng build --prod
* http-server -p 8080 -c-1 dist/angular-sw
* go to http://localhost:8080/index.html

# Workbox - Generate Service Worker

Caches static files to enable offline content. Can be extended to replay post request. Does not support more advanced customization such as client messaging.

* ng new workbox-sw --minimal=true 
* npm install @angular/service-worker (for registration only)
* npm install workbox-build
* add file generate-sw.js in root dir
```js
const build = require('workbox-build')
const BUILD_DIR = 'dist/workbox-sw'

const options = {
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR,
  clientsClaim: true,
  importWorkboxFrom: 'local'
}

build.generateSW(options).then(() => {
  console.log('Generated service worker with static cache')
})
```
* add the following line to the imports section of app.module.ts:
```js
    // import { ServiceWorkerModule } from '@angular/service-worker';
    ...
    ServiceWorkerModule.register('sw.js', { enabled: environment.production })
```
* ng build --prod
* node generate-sw.js
* http-server -p 8080 -c-1 dist/workbox-sw
* go to http://localhost:8080/index.html

## To include post requests:

* amend generate-sw.js:
```js
const build = require('workbox-build')
const BUILD_DIR = 'dist/workbox-sw'

const options = {
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR,
  clientsClaim: true,
  importWorkboxFrom: 'local',
  runtimeCaching: [
    {
      urlPattern: '/api/**',
      handler: 'NetworkOnly',
      method: 'POST',
      options: {
        backgroundSync: {
          name: 'signup',
          options: {
            maxRetentionTime: 60 * 24 * 7,
          },
        }
      }
    }
  ]
}

build.generateSW(options).then(() => {
  console.log('Generated service worker with static cache')
})
```
# Workbox - Inject precache manifest into custom service worker

* ng new workbox-custom-sw --minimal=true 
* npm install @angular/service-worker (for registration only)
* npm install workbox-build
* add file generate-sw.js in root dir:
```js
const build = require('workbox-build')
const SRC_DIR = './src'
const BUILD_DIR = 'dist/workbox-custom-sw'

const options = {
  swSrc: `${SRC_DIR}/sw.js`,
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR
}

build.injectManifest(options).then(() => {
  console.log('Generated service worker with static cache')
})
```
* add src/sw.js

```js
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
    maxRetentionTime: 60 * 24 * 7 //  7 days
});

workbox.routing.registerRoute(
    '/api/**',
    new workbox.strategies.NetworkOnly({
        plugins: [bgSyncPlugin]
    }),
    'POST'
);
```
* add the following line to the imports section of app.module.ts:
```js
    // import { ServiceWorkerModule } from '@angular/service-worker';
    ...
    ServiceWorkerModule.register('sw.js', { enabled: environment.production })
```
* ng build --prod
* node generate-sw.js
* http-server -p 8080 -c-1 dist/workbox-custom-sw
* go to http://localhost:8080/index.html

## Service worker apis

```js
// Service worker apis
// self.addEventListener('message', async (event) => {
//     if (event.data === 'ClientMessage') {
//         ... do some stuff e.g replay the post requests
//     }
// });

// self.addEventListener('fetch', async (event) => {
//  All reuqests will go through here
// });

// self.addEventListener('sync', async (event) => {
// Called when we have network connectivity again and periodically (undetermined) by the browser.
// });
```