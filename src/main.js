import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import VueLazyload from 'vue-lazyload'
import VueLive2d from 'vue-live2d-model'

import { mock } from './utils/mock'

Vue.use(VueLazyload)
Vue.use(VueLive2d)

if (process.env.NODE_ENV === 'production') {
  mock()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
