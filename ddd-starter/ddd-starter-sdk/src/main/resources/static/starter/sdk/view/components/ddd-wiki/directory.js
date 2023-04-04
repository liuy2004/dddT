const template = `
  <el-tree
      v-if="show"
      :data="dataSource"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
  ></el-tree>
`

import style from "./directory.css.js"
import axios from '../axios/index.js'
import {HttpType, RestApi} from '../ddd-sdk/api-rest.js'

const restApi = new RestApi(HttpType.AXIOS, axios)

const VueElement = defineCustomElement({
  template: template,
  styles: [style],
  props: {
    divId: {
      type: String,
      default: 'markdown_root'
    },
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      dirTree: [],
      show: true
    }
  },
  methods: {},
  mounted() {
    setTimeout(() => {
      this.dataSource = [
        {
          id: 1,
          label: '123',
          children: []
        }
      ]
    }, 100)

    /*this.dataSource.push(
      {
        id: 1,
        label: '123',
        children: []
      }
    )
    this.show = false
    this.show = true*/
  },
})

customElements.define('ddd-wiki-directory', VueElement)