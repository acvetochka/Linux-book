export const networkSidebar = [
  { text: "Networking", link: '/networking/README.md' },
  // items: [
  { text: "Основи комп'ютерних мереж", link: "/networking/Основи компютерних мереж" },
  { text: "Налаштування та контроль мережі", link: "/networking/Налаштування та контроль мережі" },
  { text: "NetworkManager", link: "/networking/NetworkManager" },
  { text: "Linux як роутер", link: "/networking/Linux як роутер" },
  {
    text: "Протоколи мереж",
    collapsed: true,
    link: "/networking/protocols/README",
    items: [
      { text: "ARP", link: "/networking/protocols/ARP" },
      { text: "IP", link: "/networking/protocols/IP" },
      { text: "ICMP", link: "/networking/protocols/ICMP" },
      { text: "TCP та UDP", link: "/networking/protocols/TCP and UDP" },
      { text: "DNS", link: "/networking/protocols/DNS" },
      { text: "HTTP/HTTPS", link: "/networking/protocols/HTTP-HTTPS" },
      { text: "", link: "/networking/protocols/" },
      { text: "", link: "/networking/protocols/" },
      { text: "", link: "/networking/protocols/" },
      { text: "", link: "/networking/protocols/" },
      { text: "", link: "/networking/protocols/" },
      { text: "", link: "/networking/protocols/" },
      { text: "", link: "/networking/protocols/" },


    ]

  },
  {
    text: "Firewall", items: [
      { text: "iptables", link: "/networking/firewall/iptables" }
    ]

  },
  {
    text: "Утиліти",
    collapsed: true,
    items: [
      { text: "ip", link: "/networking/ip" },
      { text: "traceroute", link: "/networking/traceroute" },
      { text: "ss", link: "/networking/ss" },
      { text: "tcpdump", link: "/networking/tcpdump" },
      { text: "nmcli", link: "/networking/nmcli" },
      { text: "dig", link: "/networking/dig" },
      { text: "lshw", link: "/networking/lshw" },
      { text: "dmicode", link: "/networking/dmicode" },
      { text: "nmap", link: "/networking/nmap" },
      { text: "nc", link: "/networking/nc" }

    ]
  }
]