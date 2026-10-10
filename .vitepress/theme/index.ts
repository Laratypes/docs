import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import Planned from './components/Planned.vue'
import "./theme.css"
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('Planned', Planned)
  }
} satisfies Theme
