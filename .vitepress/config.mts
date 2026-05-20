import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid"

import { nav } from './configs/nav'
import { sidebar } from './configs/sidebar'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    srcDir: "docs",

    title: "Linux Book",
    // description: "Linux Book",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      outline: [2, 4],
      nav,
      sidebar,

      socialLinks: [
        { icon: 'github', link: 'https://github.com/acvetochka/Linux-book' }
      ],

      search: {
        provider: 'local'
      },

      footer: {
        message: 'Released under CC BY 4.0 License',
        copyright: '© 2026 <a href="https://www.kuznietsova.org" target="_blank" rel="noopener">Alona Kuznietsova</a>'
      }
    }
  }))
