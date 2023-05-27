import { createApp, createGlobalAPI } from 'vue'
// import Client from './client/App.vue'
// import Server from './server/App.vue'
import App from './App.vue'
import router from './router'
// main.ts
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import store from '@/utils/store'

const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
}

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.use(router)

const vm = app.mount("#app")
window.$vm = vm