const build = require('workbox-build')
const SRC_DIR = './src'
const BUILD_DIR = 'dist/workbox-custom-sw'

const options = {
  swSrc: `${SRC_DIR}/sw.js`,
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR
}

build.copyWorkboxLibraries(BUILD_DIR);

build.injectManifest(options).then(() => {
  console.log('Generated service worker with static cache')
})