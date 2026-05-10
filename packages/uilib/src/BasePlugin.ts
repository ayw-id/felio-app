import type { App } from 'vue'
import { PageSpinner, AppBar } from './components'

export default {
  install: (app: App, options: { btnText: String } = { btnText: '' }) => {
    // app.component('NavDrawer', NavDrawer)
    app.component('TopBar', AppBar)
    app.component('PageSpinner', PageSpinner)
    app.provide('baseButtonProvide', options.btnText)
  }
}

export { AppBar, PageSpinner }
