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