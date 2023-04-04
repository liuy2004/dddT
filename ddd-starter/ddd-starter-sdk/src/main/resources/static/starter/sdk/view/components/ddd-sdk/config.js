'use strict'
//custom config
const restConfig = {
  prefixUri: '/starter/sdk',
}

const websocketConfig = {
  url: 'ws://127.0.0.1:3001',
  debug: true,
}

const tcpConfig = {
  host: "127.0.0.1",
  port: 3001,
}

export {restConfig, websocketConfig, tcpConfig}