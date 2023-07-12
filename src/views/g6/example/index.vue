<template>
  <div class="container">
    <div class="nodePanel">
      <div class="panelTitle">节点面板</div>
      <div class="panelContent">
        <el-collapse v-model="nodePanelExpandArr">
          <el-collapse-item v-for="group in nodeList" :key="group.key" :title="group.title" :name="group.key">
            <el-row>
              <el-col :span="12" v-for="item in group.child" :key="item.nodeType">
                <div class="nodeBtn" draggable="true" @dragend="addNode(item.nodeType, $event)">
                  <IconifyIconOnline :icon="item.nodeIcon" />
                  <div class="nodeName">{{ item.nodeName }}</div>
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <!-- 画板 -->
    <div id="graph" ref="graphRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import G6 from "@antv/g6";

const graphRef = ref(null); // 画布元素

const graph = ref(null); // 画布实例

// 数据
const graphData = {
  // 点集
  nodes: [
    {
      id: "node1",
      x: 300,
      y: 200
    },
    {
      id: "node2",
      x: 600,
      y: 200
    }
  ],
  // 边集
  edges: [
    // 表示一条从 node1 节点连接到 node2 节点的边
    {
      source: "node1",
      target: "node2"
    }
  ]
};

// 初始化画布
function initGraph() {
  graph.value = new G6.Graph({
    container: graphRef.value,
    width: window.innerWidth,
    height: window.innerHeight - 48,
    modes: {
      default: ["drag-canvas", "zoom-canvas", "drag-node"]
    }
  });

  graph.value.data(graphData);
  graph.value.render();
}

// 节点列表
const nodeList = [
  {
    key: "graphicGroup",
    title: "图形节点",
    child: [
      {
        nodeName: "圆形",
        nodeType: "circle",
        nodeIcon: "carbon:executable-program"
      },
      {
        nodeName: "矩形",
        nodeType: "rect",
        nodeIcon: "ph:rectangle-bold"
      }
    ]
  },
  {
    key: "processGroup",
    title: "流程节点",
    child: [
      {
        nodeName: "启动",
        nodeType: "startCard",
        nodeIcon: "gridicons:create"
      },
      {
        nodeName: "审批",
        nodeType: "approvalCard",
        nodeIcon: "akar-icons:chat-approve"
      },
      {
        nodeName: "条件",
        nodeType: "conditionCard",
        nodeIcon: "ph:git-branch"
      },
      {
        nodeName: "执行",
        nodeType: "executionCard",
        nodeIcon: "carbon:executable-program"
      }
    ]
  }
];
// 节点面板展开列表
const nodePanelExpandArr = ref([]);
for (const item of nodeList) {
  nodePanelExpandArr.value.push(item.key);
}

// 注册节点
const ICON_MAP = {
  startCard: 'http://127.0.0.1:8848/src/assets/user.jpg',
  approvalCard: 'http://127.0.0.1:8848/src/assets/user.jpg',
};
G6.registerNode(
  'startCard',
  {
    drawShape: function drawShape(cfg, group) {
      const color = cfg.error ? '#F4664A' : '#30BF78';
      const r = 2;
      const shape = group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 60,
          stroke: color,
          radius: r,
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'main-box',
        draggable: true,
      });

      group.addShape('rect', {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 20,
          fill: color,
          radius: [r, r, 0, 0],
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'title-box',
        draggable: true,
      });

      // left icon
      group.addShape('image', {
        attrs: {
          x: 4,
          y: 2,
          height: 16,
          width: 16,
          cursor: 'pointer',
          img: ICON_MAP[cfg.nodeType || 'app'],
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'node-icon',
      });

      // title text
      group.addShape('text', {
        attrs: {
          textBaseline: 'top',
          y: 2,
          x: 24,
          lineHeight: 20,
          text: cfg.title,
          fill: '#fff',
        },
        // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
        name: 'title',
      });

      if (cfg.nodeLevel > 0) {
        group.addShape('marker', {
          attrs: {
            x: 184,
            y: 30,
            r: 6,
            cursor: 'pointer',
            symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
            stroke: '#666',
            lineWidth: 1,
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'collapse-icon',
        });
      }

      // The content list
      cfg.panels.forEach((item, index) => {
        // name text
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            y: 25,
            x: 24 + index * 60,
            lineHeight: 20,
            text: item.title,
            fill: 'rgba(0,0,0, 0.4)',
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: `index-title-${index}`,
        });

        // value text
        group.addShape('text', {
          attrs: {
            textBaseline: 'top',
            y: 42,
            x: 24 + index * 60,
            lineHeight: 20,
            text: item.value,
            fill: '#595959',
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: `index-value-${index}`,
        });
      });
      return shape;
    },
  },
  'single-node',
);

// 添加节点
function addNode(type, e) {
  // 将屏幕/页面坐标转换为渲染坐标
  const point = graph.value.getPointByClient(e.x, e.y);

  // 新创建的节点信息
  const model = {
    id: "node" + Math.random(), // id使用了随机数，尽可能避免重复
    title: type, // 文本标签
    type: type, // 图片类型的节点
    nodeType: type,
    x: point.x,
    y: point.y,
    nodeLevel: 0,
    panels: [
      { title: '成功率', value: '11%' },
      { title: '耗时', value: '111' },
      { title: '错误数', value: '111' },
    ]
  };

  graph.value.addItem("node", model, false);
}

onMounted(() => {
  initGraph();
});
</script>

<style lang="scss" scoped>
.page {
  margin: 0 !important;
  padding: 0;
  width: 100%;
  max-width: 100%;
  position: relative;
}

#graph {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background-color: #fff;
}

.nodePanel {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 150px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  border-radius: 4px;
  z-index: 10;

  .panelTitle {
    background-color: rgba(0, 0, 0, .2);
    padding: 4px 10px;
  }

  .panelContent {
    padding: 10px;

    ::v-deep .el-collapse-item__content {
      padding-bottom: 0;
    }

    .nodeBtn {
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: all .3s;
      padding: 8px 0;
      cursor: pointer;
      border-radius: 6px;

      &:hover {
        background-color: rgba(0, 0, 0, .1);
      }

      .iconify {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
