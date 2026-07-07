const users = '/users/users';
const permissions = '/users/permissions';

export const usersSidebar = [
  {
    text: "Users", link: "",
    collapsed: true,
    items: [
      { text: 'USERS (КОРИСТУВАЧІ ТА ГРУПИ)', link: `${users}/users-and-groups` },
      { text: 'usermod', link: `${users}/usermod` }
    ]
  },
  {
    text: "Permissions", link: "",
    collapsed: true,
    items: [
      { text: "", link: `${permissions}/` }
    ]
  }
]