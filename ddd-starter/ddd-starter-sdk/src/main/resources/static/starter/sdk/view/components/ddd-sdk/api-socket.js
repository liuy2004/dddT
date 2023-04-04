'use strict';

import {encodeCompositeMetadata, encodeRoute, WellKnownMimeType} from '../rsocket-composite-metadata/index.js'
import {websocketConfig} from './config.js'
import {RSocketConnector} from "../rsocket-core/index.js";
import {WebsocketClientTransport} from "../rsocket-websocket-client/index.js";

const MESSAGE_RSOCKET_ROUTING = WellKnownMimeType.MESSAGE_RSOCKET_ROUTING
const connector = new RSocketConnector({
  transport: new WebsocketClientTransport({
    url: websocketConfig.url,
    wsCreator: (url) => {
      return new WebSocket(url)
    },
  }),
})

function requestResponse(rsocket, route, data, logger) {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  let compositeMetaData = undefined
  if (route) {
    const encodedRoute = encodeRoute(route)
    const map = new Map()
    map.set(MESSAGE_RSOCKET_ROUTING, encodedRoute)
    compositeMetaData = encodeCompositeMetadata(map)
  }
  return new Promise((resolve, reject) => {
    return rsocket.requestResponse(
      {
        data: Buffer.from(data),
        metadata: compositeMetaData,
      },
      {
        onError: (err) => {
          const msg = err.response ? err.response.data.message : err.message
          logger.error(msg)
          if (websocketConfig.debug && err.stack) {
            logger.warn(err.stack)
          }
          reject(err)
        },
        onNext: (payload, isComplete) => {
          logger.message(`payload[data: ${payload.data}; metadata: ${payload.metadata}]|${isComplete}`)
          resolve(payload);
        },
        onComplete: () => {
          logger.message('onComplete')
          resolve(null);
        },
        onExtension: () => {
          logger.message('onExtension')
        },
      }
    )
  })
}

const defLogger = {
  info: (msg) => {
    window.console.log(msg)
  },
  error: (msg) => {
    window.console.error(msg)
  },
  message: (msg) => {
    window.console.log(msg)
  },
  warn: (msg) => {
    window.console.warn(msg)
  },
  success: (msg) => {
    //window.console.log(msg)
  }
}

class SocketApi {
  _webSocket
  _logger = defLogger

  constructor(logger) {
    if(typeof logger === "function") {
      this._logger = {
        info: logger,
        error: logger,
        message: logger,
        warn: logger,
        success: logger
      }
    } else if(typeof logger === "object") {
      this._logger = Object.assign(this._logger, logger)
    }
    this._logger = logger
    connector.connect().then((rsocket) => {
      this._webSocket = rsocket
      this._logger.success('连接服务器成功!')
      rsocket.onClose(() => {
        this._logger.error('连接已断开')
      })
    })
  }

  disconnect() {
    if (this._webSocket) {
      this._webSocket.close()
    }
  }

  /**
   * 获取指令提示
   * @param command 当前已经输入的命令
   * @returns {*}
   */
  remindCommand(command) {
    return requestResponse(this._webSocket, 'AppFrameworkStarterSdkController.remindCommand', {command}, this._logger)
  }

  /**
   * 执行指令
   * @param command 需要执行的命令
   * @returns {*}
   */
  execute(command) {
    return requestResponse(this._webSocket, 'AppFrameworkStarterSdkController.execute', {command}, this._logger)
  }
}

export {SocketApi}