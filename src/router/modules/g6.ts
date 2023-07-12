const Layout = () => import("@/layout/index.vue");

export default {
  path: "/g6",
  name: "G6Study",
  component: Layout,
  redirect: "/example",
  meta: {
    icon: "homeFilled",
    title: "g6学习",
    rank: 2
  },
  children: [
    {
      path: "/example",
      name: "G6Example",
      component: () => import("@/views/g6/example/index.vue"),
      meta: {
        title: "g6示例"
      }
    }
  ]
} as RouteConfigsTable;
