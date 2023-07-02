const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Pixi",
  component: Layout,
  redirect: "/treasureHunter",
  meta: {
    icon: "homeFilled",
    title: "Pixi学习",
    rank: 0
  },
  children: [
    {
      path: "/treasureHunter",
      name: "TreasureHunter",
      component: () => import("@/views/pixi/treasureHunter.vue"),
      meta: {
        title: "宝藏猎人"
      }
    }
  ]
} as RouteConfigsTable;
