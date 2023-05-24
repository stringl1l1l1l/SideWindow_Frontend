import { createApp } from 'vue'
import Client from './client/App.vue'
import Server from './server/App.vue'
// main.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const server = createApp(Server)
server.use(ElementPlus)
server.mount('#server')

const client = createApp(Client)
client.use(ElementPlus)
client.mount('#client')
