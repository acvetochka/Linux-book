export const performanceSidebar = [
  {
    text: "Performance",
    link: '/performance/README.md',
    collapsed: true,
    items: [
      { text: "Траблшутінг швидкодії", link: '/performance/Troubleshooting' },
      { text: "Траблшутінг по рівням", link: '/performance/Troubleshooting by levels' },
      { text: "Методологія УМУН (UTP)", link: '/performance/UTP' },
      { text: "OOM killer", link: '/performance/OOM killer' },

      {
        text: "Utilites", items: [
          { text: "sar", link: '/performance/sar' }
        ]
      }
    ]
  }
]