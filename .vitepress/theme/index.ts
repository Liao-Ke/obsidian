import DefaultTheme from 'vitepress/theme'
import { 
    NolebaseGitChangelogPlugin 
  } from '@nolebase/vitepress-plugin-git-changelog/client'
  
  import '@nolebase/vitepress-plugin-git-changelog/client/style.css'
  export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
      // 注册自定义全局组件
      app.use(NolebaseGitChangelogPlugin)  

    }
  }