const template = `
  <div :ref="divId"></div>
`

import style from "./editor.css.js"
import debounce from "../ddd-sdk/debounce.js"
import {vditorConfig} from './config.js'
import axios from '../axios/index.js'
import {RestApi, HttpType} from '../ddd-sdk/api-rest.js'
const restApi = new RestApi(HttpType.AXIOS, axios)

const options = vditorConfig.options

const DddWikiEditor = defineCustomElement({
  template: template,
  styles: [style],
  props: {
    divId: {
      type: String,
      default: 'markdown_root'
    },
    path: {
      type: String,
      default: '/HomePage.md'
    }
  },
  data() {
    return {
      instance: null
    }
  },
  watch: {
    path: {
      handler(nValue, oValue) {
        if(nValue !== oValue) {
          this.loadHandler(this.nValue)
        }
      },
    }
  },
  methods: {
    loadHandler(path) {
      restApi.execute('wiki --text -path ' + this.path).then(res => {
        if(res.data) {
          options.after = () => {
            this.instance.setValue(res.data)
          }
          this.instance = new Vditor(this.divId, options)
        } else {
          console.error('加载失败')
        }
      })
    },
    keydownHandler(event) {
      if (window.event.ctrlKey && event && event.keyCode === 83) {
        this.saveHandler()
        return false
      }
    },
    saveHandler: debounce(function () {
      restApi.execute('wiki -save ' + encodeURI(this.instance.getValue())+ ' -path '+ this.path).then(res => {
        if(res.data) {
          ElMessage({
            message: '保存成功',
            type: 'success',
            duration: 3000
          })
        } else {
          ElMessage({
            message: '保存失败',
            type: 'error',
            duration: 3000
          })
        }
      })
    }, 1000)
  },
  mounted() {
    window.document.onkeydown = this.keydownHandler
    this.loadHandler(this.path)
  },
})

customElements.define('ddd-wiki-editor', DddWikiEditor)