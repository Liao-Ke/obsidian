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
import './public/styles/my.css'

import mediumZoom from 'medium-zoom';
import { onMounted, watch, nextTick } from 'vue';
import { useRoute } from 'vitepress';
import Layout from './Layout.vue'

export const Theme: ThemeConfig = {
  extends: DefaultTheme,
  setup() {
    const route = useRoute();
    const initZoom = () => {
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom(".main p img", { background: "var(--vp-c-bg)" }); // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
      // mediumZoom(".main img")
    };
    onMounted(() => {
      initZoom(); 
    }); 
    watch(  
      () => route.path,
      () => nextTick(() => initZoom())
    );
  },
  Layout: () => {
    return h(Layout, null, {
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