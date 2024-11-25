import { defineConfig } from 'vitepress'
import { BiDirectionalLinks } from '@nolebase/markdown-it-bi-directional-links'
import { calculateSidebar } from '@nolebase/vitepress-plugin-sidebar'
import { 
  GitChangelog, 
  GitChangelogMarkdownSection, 
} from '@nolebase/vitepress-plugin-git-changelog/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: { 
    plugins: [ 
      GitChangelog({ 
        // 填写在此处填写您的仓库链接
        repoURL: () => 'https://gitee.com/lZao/obsidian', 
      }), 
      GitChangelogMarkdownSection(), 
    ],
  }, 
  title: "My Obsidian",
  description: "My Obsidian",
  lang:'zh',
  lastUpdated: true,
   base: '/obsidian/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '数学大纲', link: '/笔记/专升本/数学/大纲.md' },
      { text: '英语大纲', link: '/笔记/专升本/英语/大纲.md' }
    ],
    sidebar: calculateSidebar([
      { folderName: '笔记', separate: true }, 
      { folderName: '卡片盒', separate: true }, 
    ]), 

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Liao-Ke/obsidian' },
      { icon: 'gitee', link: 'https://gitee.com/lZao/obsidian' }

    ]
  },
  markdown: {
    config: (md) => {
      md.use(BiDirectionalLinks()) 
    },
    math: true
  },
})
