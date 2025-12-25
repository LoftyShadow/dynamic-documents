import { defineConfig } from 'vitepress'
import { sidebar as autoSidebar, nav as autoNav } from './config/sidebar'

const baseNav = [
  { text: '首页', link: '/' },
]

const fallbackSidebar = [
  {
    text: 'Examples',
    items: [
      { text: 'Markdown Examples', link: '/markdown-examples' },
      { text: 'Runtime API Examples', link: '/api-examples' }
    ]
  }
]

const resolvedNav = autoNav.length > 0 ? [...baseNav, ...autoNav] : baseNav
const resolvedSidebar = Object.keys(autoSidebar).length > 0 ? autoSidebar : fallbackSidebar

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DynamicDocuments",
  description: "动态文档中心",
  head: [['link', {rel: 'icon', href: '/icons/favicon.ico'}]],
  vite: {
    server: {
      port: 4569
    }
  },
  themeConfig: {
    logo: '/icons/favicon.ico',
    // https://vitepress.dev/reference/default-theme-config
    nav: resolvedNav,

    // 使用自动生成的侧边栏配置
    sidebar: resolvedSidebar,

    // 禁用右侧目录导航
    outline: false,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // 搜索配置
    search: {
      provider: 'local'
    },

    // 页脚配置
    footer: {
      copyright: 'Copyright © 2025'
    }
  }
})
