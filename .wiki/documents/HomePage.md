# 开发者文档中心

## 前言

- 致力于打造一个对开发友好的小工具，关于项目的一切都可以写进来，尤其是挖坑与填坑。程序会做分词索引的。Don't be shy. 坑是客观存在的。
- 如果没有文档，项目将很快变质，**而且是以指数的速度迅速腐烂**。(与人员流动性正相关，与需求迭代速度正相关)
- 是否在为每周的周报发愁？在这里写任务吧！
- 是否经常自认为记住了一些待办工作，然后被琐事打断，再之后就忘记了？在这里写待办吧！
- 是否调研一个问题，调研到一半，打开了一堆页面，好像哪个都有用，又好像哪个都没用，不知道该关哪个了？把你认为有价值的内容或网址复制进来吧！
- 是否遇到了不清楚的问题，又不知道去问谁？来这里尝试一下关键词搜索吧！
- 是否遇到了前任程序员挖的坑，很想打他一顿？大家都是成年人了，用文明的语句好好吐槽一下吧！
- 每当我们多写了任何类型的文档，项目都会变得更加可维护一点。

## 基本信息

- 文档类型：Markdown文件
- 功能定位：项目的架构设计与中间件方案、挖坑填坑、工作待办、生成个人周报
- 实现方式：本地文档方式。Lucene实现分词索引，以有操作权限、无登录限制的用户去维护（表现为：虽然每个用户都有各自的目录权限，但是你可以随意切换用户）
- 页面依赖：用java的thymeleaf模板引擎渲染html页面，html页面里引用了vue3原生js模式的esModules模块，页面功能使用Vditor这个开源的markdown在线编辑器

## 希望大家都能养成编写文档的习惯

## 开发者文档中心TODO

- [X]  集成Vditor在线MD编辑器
- [ ]  文件目录的树形结构展示
- [ ]  用户权限的实现
- [ ]  Lucene实现分词索引与检索
- [X]  在命令行里添加一个入口，`wiki`指令
