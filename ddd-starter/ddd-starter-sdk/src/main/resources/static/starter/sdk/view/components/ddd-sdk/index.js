const template = `
  <div class="ddd-sdk-outer" :style="outerStyle">
    <div ref="logDiv" class="ddd-sdk-print" :style="printStyle">
      {{commandLog}}
    </div>
    <div ref="commandDiv" :style="commandDivStyle" class="ddd-sdk-command">
      <label>></label>
      <textarea
        spellcheck="false"
        :style="inputStyle"
        v-model="currentCommand"
        @input="commandChangeHandler"
        @keydown.delete="commandChangeHandler(true)"
        @keydown.enter.native.prevent="enterHandler"
        @keydown.tab.native.prevent="tabHandler"
        @keydown.up.native.prevent="prefHistory"
        @keydown.down.native.prevent="nextHistory"
        @keydown.right="completeCommand"
      />
      <label class="ddd-sdk-command-placeholder" :style="inputStyle" @click.stop >{{placeholder}}</label>
    </div>
  </div>
`

//监听鼠标右键
document.oncontextmenu = function (event) {
  return false
}
//禁用Ctrl+S
document.onkeydown = function (event) {
  if (event.ctrlKey && window.event.keyCode === 83) {
    return false
  }
}

import style from "./ddd-sdk.css.js"
import buffer from "../buffer/index.js"
import {SocketApi} from './api-socket.js'

window.Buffer = buffer.Buffer
const SUCCESS = 'success'
const ERROR = 'error'
const INFO = 'info'
const MESSAGE = 'message'
const WARN = 'warn'

const VueElement = defineCustomElement({
  template: template,
  styles: [style],
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    fontSize: {
      type: String,
      default: '16px'
    }
  },
  data() {
    return {
      outerStyle: {
        width: this.width,
        height: this.height,
        fontSize: this.fontSize,
        lineHeight: 'calc(' + this.fontSize + ' + 4px)'
      },
      printStyle: {
        maxHeight: 'calc(100% - ' + this.fontSize + ' - 8px)'
      },
      inputStyle: {
        fontSize: this.fontSize,
        height: 'calc(' + this.fontSize + ' + 4px)',
        paddingLeft: this.fontSize
      },
      commandDivStyle: {
        height: 'calc(' + this.fontSize + ' + 4px)',
      },
      commandLog: '',
      currentCommand: '',
      history: [''],
      historyIndex: 0,
      remindQuery: true,
      remindList: [],
      remindIndex: -1,
      placeholder: '',
      socketApi: null
    }
  },
  methods: {
    appendLog(content, type = INFO) {
      if (content instanceof Array) {
        content = content.join('\n')
      } else if (content instanceof Object) {
        let newContent = []
        Object.keys(content).forEach(key => newContent.push(`${key}: ${content[key]}`))
        content = newContent.join('\n')
      }
      const dom = window.document.createElement('span')
      dom.innerHTML = content
      dom.style.color = type === ERROR ? 'lightcoral'
        : type === SUCCESS ? 'lightseagreen'
          : type === MESSAGE ? 'lightskyblue'
            : type === WARN ? 'lightsalmon'
              : type === INFO ? 'white' : 'white'
      if (this.$refs.logDiv.children.length > 0) {
        this.$refs.logDiv.innerHTML += '\n'
      }
      this.$refs.logDiv.appendChild(dom)
      this.$nextTick(() => {
        this.$refs.logDiv.scrollTop = this.$refs.logDiv.offsetHeight
      })
    },
    enterHandler() {
      if (this.commandLog) {
        this.appendLog('\n')
      }
      this.appendLog('>' + this.currentCommand)
      if (/^\s*$/.test(this.currentCommand)) { //空指令
        return
      }
      this.history[this.historyIndex] = this.currentCommand
      if (this.history.length > 50) {
        this.history.shift()
      }
      this.history.push('')
      this.$nextTick(this.nextHistory)
      this.executeCommandHandler(this.currentCommand).then((res) => {
        this.appendLog(res.data, SUCCESS)
      })
    },
    tabHandler() {
      if (this.remindQuery) {
        this.queryRemindHandler().then(res => {
          this.remindList = res.data
          this.remindQuery = false
          this.$nextTick(() => {
            this.nextRemind()
          })
        }).catch(err => {
          this.remindList = []
          this.$nextTick(() => {
            this.nextRemind()
          })
        })
      } else {
        this.nextRemind()
      }
    },
    commandChangeHandler(force = false) {
      if (force || !this.placeholder.startsWith(this.currentCommand)) {
        this.remindIndex = -1
        this.remindQuery = true
      }
      this.showRemind()
    },
    queryRemindHandler() {
      return this.socketApi.remindCommand(this.currentCommand)
    },
    nextRemind() {
      if (this.remindList.length > 0) {
        this.remindIndex = (this.remindIndex + 1) % this.remindList.length
      } else {
        this.remindIndex = -1
      }
      this.showRemind()
    },
    prefHistory() {
      if (this.historyIndex > 0) {
        this.historyIndex--
        this.$nextTick(() => {
          this.currentCommand = this.history[this.historyIndex]
          this.commandChangeHandler()
        })
      }
    },
    nextHistory() {
      if (this.history.length - 1 > this.historyIndex) {
        this.historyIndex++
        this.$nextTick(() => {
          this.currentCommand = this.history[this.historyIndex]
          this.commandChangeHandler()
        })
      }
    },
    completeCommand() {
      if (this.placeholder.startsWith(this.currentCommand)) {
        this.currentCommand = this.placeholder
        this.commandChangeHandler(true)
      }
    },
    showRemind() {
      if (this.remindList.length > 0 && this.remindIndex >= 0) {
        this.placeholder = this.remindList[this.remindIndex]
      } else {
        this.placeholder = ''
      }
    },
    executeCommandHandler() {
      return this.socketApi.execute(this.currentCommand)
    }
  },
  mounted() {
    this.appendLog('[ddd-sdk socket版本]', MESSAGE)
    this.appendLog('正在连接服务器...', MESSAGE)
    const logger = {
      info: (content) => {
        this.appendLog(content, INFO)
      },
      error: (content) => {
        this.appendLog(content, ERROR)
      },
      warn: (content) => {
        this.appendLog(content, WARN)
      },
      success: (content) => {
        this.appendLog(content, SUCCESS)
      },
      message: (content) => {
        this.appendLog(content, MESSAGE)
      }
    }
    this.socketApi = new SocketApi(logger)
  },
  unmounted() {
    this.socketApi.disconnect()
  }
})

customElements.define('ddd-sdk', VueElement)