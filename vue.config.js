const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 禁用eslint
  pages: {
    app1: {
      entry: 'src/main.js', // 指定默认的入口点位置
      template: 'public/server.html',
      filename: 'server.html'
    },
    app2: {
      entry: 'src/main.js', // 指定另一个入口点的位置
      template: 'public/client.html',
      filename: 'client.html'
    }
  }
})
