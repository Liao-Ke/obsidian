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
        repoURL: () => 'https://github.com/Liao-Ke/obsidian', 
        mapAuthors: [ 
          { 
            name: 'lk', 
            username: 'Liao-Ke', 
            mapByEmailAliases: ['c1824503917@outlook.com'] 
          } ,
          { 
            name: 'lik', 
            username: 'Liao-Ke', 
            mapByEmailAliases: ['c1824503917@outlook.com'] 
          } 
        ] 
      }), 
      GitChangelogMarkdownSection(), 
    ],
    ssr: { 
      noExternal: [ 
        // 如果还有别的依赖需要添加的话，并排填写和配置到这里即可
        '@nolebase/vitepress-plugin-highlight-targeted-heading', 
      ], 
    }, 

  }, 
  title: "我的黑曜石",
  description: "我的黑曜石",
  lang:'zh-CN',
  lastUpdated: true,
  themeConfig: {
    outline: {
      label:'大纲',
      level: 'deep'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    lastUpdated: {
      text: '最后更新时间'
    },
    editLink: {
      pattern: 'https://github.com/Liao-Ke/obsidian/blob/master/:path',
       text: '在 GitHub 上编辑此页面'
    },
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '浅色模式',
    darkModeSwitchTitle: '深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '返回顶部',
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
      { icon: 'gitee', link: 'https://gitee.com/lZao/obsidian'},
   
    ]
  },
  markdown: {
    config: (md) => {
      md.use(BiDirectionalLinks()) 
    },
    math: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },
})
