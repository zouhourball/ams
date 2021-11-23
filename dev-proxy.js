const trove = require(`./build-profile.js`)

const troveFullUrl = trove.PRODUCT_APP_URL_TROVE.replace(/"/g, '')
const troveUrl = troveFullUrl.replace(/^https?:\/\//, '')

const troveAppFullUrl = trove.PRODUCT_APP_URL_API.replace(/"/g, '')
const troveAppUrl = troveAppFullUrl.replace(/^https?:\/\//, '')

const proxyConfig = {
  '/projects-be': {
    target: troveAppFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveAppUrl,
      Origin: troveAppFullUrl,
    },
  },
  '/graphql': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/static-data': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/geoserver': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/web': {
    target: 'http://mozilla.github.com/pdf.js/',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/trove/api': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/wfs/api/v1/layers': {
    target: 'https://map.target.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/audit/api/v1': {
    target: `${troveFullUrl}:8091`,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/api': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/data': {
    target: 'http://ldr-trove.digitalenergycloud.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/service': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/spatial': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/spatial/api/v1/wfs/readjson': {
    target: troveFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveUrl,
      Origin: troveFullUrl,
    },
  },
  '/spatial/api/v1/crs': {
    target: 'http://ldr-map.digitalenergycloud.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/fm': {
    target: troveAppFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveAppUrl,
      Origin: troveAppFullUrl,
    },
  },
  '/pulse-be': {
    target: troveAppFullUrl,
    ssl: {},
    secure: false,
    changeOrigin: true,
    headers: {
      Host: troveAppUrl,
      Origin: troveAppFullUrl,
    },
  },
}

module.exports = proxyConfig
