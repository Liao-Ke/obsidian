import DefaultTheme from 'vitepress/theme'
import {
  NolebaseGitChangelogPlugin
} from '@nolebase/vitepress-plugin-git-changelog/client'

import {
  NolebaseHighlightTargetedHeading,
} from '@nolebase/vitepress-plugin-highlight-targeted-heading/client'
import MyLayout from './MyLayout.vue'
import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
import type { Theme as ThemeConfig } from 'vitepress'
import { h } from 'vue'
import '/public/style/my.css'
export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // 其他的配置...
      'layout-top': () => [
        h(NolebaseHighlightTargetedHeading),
      ],
      'not-found':()=>[
        h(MyLayout)
      ]
    })
  },
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.use(NolebaseGitChangelogPlugin)

  }
}
export default Theme