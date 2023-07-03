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
    },
    {
      path: "/kofExample",
      name: "kofExample",
      component: () => import("@/views/pixi/kofExample.vue"),
      meta: {
        title: "拳皇-动画精灵"
      }
    }
  ]
} as RouteConfigsTable;
