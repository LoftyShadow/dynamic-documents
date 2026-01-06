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
  title: "动态文档中心",
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

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // 搜索配置
    search: {
      provider: 'local'
    },

    // 404 页面配置
    notFound: {
      title: '文档不存在',
      quote: '该文档可能已被删除、移动或重命名。',
      linkLabel: '返回首页',
      linkText: '返回首页',
      code: '404'
    },

    outline: {
      level: [1, 5], // 设置目录层级
      label: '页面导航', // 自定义标题
    },

    // 页脚配置
    footer: {
      copyright: 'Copyright © 2025'
    }
  }
})
