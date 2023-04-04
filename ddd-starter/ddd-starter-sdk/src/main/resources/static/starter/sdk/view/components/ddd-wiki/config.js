'use strict'

const vditorConfig = {
  options: { //
    tab: '\t', //tab 键操作字符串，支持 \t 及任意字符串
    debugger: false,
    typewriterMode: true,
    after: null, //编辑器异步渲染完成后的回调方法
    width: '100%',
    height: '100%',
    theme: 'classic' || 'dark',
    icon: 'ant' || 'material',
    placeholder: '',
    emoji: {
      'sd': '💔',
      'j': 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/j.png',
    },
    cache: {
      enable: false,
      id: undefined,
    },
    resize: {
      enable: false
    },
    upload: {},
    toolbar: [
      'emoji',
      'headings',
      'bold',
      'italic',
      'strike',
      '|',
      'line',
      'quote',
      'list',
      'ordered-list',
      'check',
      'outdent',
      'indent',
      'code',
      'inline-code',
      'insert-after',
      'insert-before',
      'undo',
      'redo',
      'upload',
      'link',
      'table',
      'record',
      'edit-mode',
      'both',
      'preview',
      'fullscreen',
      'outline',
      'code-theme',
      'content-theme',
      'export',
      'devtools',
      'info',
      'help',
      'br'
    ],
    preview: {
      theme: {
        current: 'light' || 'ant-design' || 'dark' || 'wechat'
      },
      markdown: {
        toc: true
      }
    }
  }
}


export {vditorConfig}