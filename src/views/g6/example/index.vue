<template>
  <div class="container">
    <div class="asidePanel nodePanel">
      <div class="panelTitle">节点面板</div>
      <div class="panelContent">
        <el-collapse v-model="nodePanelExpandArr">
          <el-collapse-item v-for="group in nodeList" :key="group.key" :title="group.title" :name="group.key">
            <el-row>
              <el-col :span="12" v-for="item in group.child" :key="item.nodeType">
                <div class="nodeBtn" draggable="true" @dragend="addNode(item, $event)">
                  <IconifyIconOnline v-if="item.nodeIconType === 'iconfy'" :icon="item.nodeIcon" />
                  <FontIcon v-else-if="item.nodeIconType === 'iconfont'" :icon="item.nodeIcon" />
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
import G6 from "@antv/g6";
import { ref, onMounted, onUnmounted } from "vue";
import { registerAllNode, nodeList } from "./nodes/config/nodeRegister";
import { registerAllEdge } from "./edges/edgeRegister";
import { registerAllBehavior } from "./behavior/behaviorRegister";
import { ElMessage } from "element-plus";

const graphRef = ref(null); // 画布元素
const graph = ref(null); // 画布实例

// 数据
const graphData = {
  // 点集
  nodes: [
    // {
    //   id: "node1",
    //   x: 300,
    //   y: 200
    // },
    // {
    //   id: "node2",
    //   x: 600,
    //   y: 200
    // }
  ],
  // 边集
  edges: [
    // 表示一条从 node1 节点连接到 node2 节点的边
    // {
    //   source: "node1",
    //   target: "node2"
    // }
  ]
};

// 初始化画布
function initGraph() {
  graph.value = new G6.Graph({
    container: graphRef.value,
    width: window.innerWidth,
    height: window.innerHeight - 48,
    modes: {
      default: [
        "drag-canvas",
        "zoom-canvas",
        "drag-node",
        "clickAddEdge",
        "nodeHover",
        "edgeHover"
      ]
    },
    defaultEdge: {
      type: "flowEdge",
      style: {
        lineWidth: 2,
        stroke: "#bae7ff"
      }
    }
    // nodeStateStyles: {
    //   selected: {
    //     lineWidth: 2,
    //     stroke: 'red'
    //   },
    // }
  });
  graph.value.data(graphData);
  graph.value.render();
}

// 画布大小自适应
function resizeGraph() {
  if (!graph.value || graph.value.get("destroyed")) return;
  graph.value.changeSize(window.innerWidth, window.innerHeight - 48);
}

// 注册节点
registerAllNode();

// 默认展开所有节点组
const nodePanelExpandArr = ref([]);
for (const item of nodeList) {
  nodePanelExpandArr.value.push(item.key);
}

// 添加节点
function addNode(node, e) {
  // 判断节点是否已达到上线
  if (node.numLimit !== null || typeof node.numLimit !== "undefined") {
    const arr = graph.value.findAll("node", (item) => {
      const model = item.getModel();
      return model && model.type === node.nodeType;
    });
    if (arr && arr.length >= node.numLimit) {
      ElMessage.error(`[${node.nodeName}]节点数量已达到上限`);
      return;
    }
  }
  // 将屏幕/页面坐标转换为渲染坐标
  const point = graph.value.getPointByClient(e.x, e.y);
  // 新创建的节点信息
  const model = {
    id: `node:${new Date().valueOf()}${parseInt(Math.random() * 1000)}`,
    title: node.nodeName,
    type: node.nodeType,
    x: point.x,
    y: point.y,
    // 连接点配置
    anchorPoints: [
      [0.5, 0],
      [0.5, 1],
      [0, 0.5],
      [1, 0.5]
    ],
    nodeDesc: node
  };
  graph.value.addItem("node", model);
}

// 注册边
registerAllEdge();

// 注册动作
registerAllBehavior();
const selectedElement = ref(null);

function handleElementClick(ev) {
  const element = ev.item;
  if (!selectedElement.value) {
    graph.value.set("selectedElement", element);
    selectedElement.value = element;
    setElementSelected(element);
  } else if (selectedElement.value.get("id") === element.get("id")) {
    clearElementSelected(element);
    graph.value.set("selectedElement", null);
    selectedElement.value = null;
  } else {
    clearElementSelected(selectedElement.value, true);
    graph.value.set("selectedElement", element);
    selectedElement.value = element;
    setElementSelected(element);
  }
}

function setElementSelected(element) {
  const type = element.get("type");
  const model = element.getModel();
  const group = element.getContainer();
  if (type === "node") {
    const dashBorder = group.find(function(item) {
      return item.get("name") === "dashBorder";
    });
    if (dashBorder) {
      group.removeChild(dashBorder);
    }
    group.addShape("rect", {
      attrs: {
        x: -5,
        y: -5,
        width: 209,
        height: 69,
        stroke: "#326DE6",
        lineWidth: 2,
        lineDash: [5]
      },
      name: "dashBorder",
      zIndex: 8
    });
    group.sort();
  } else if (type === "edge") {
    if (model && model.target && typeof model.target === "string") {
      graph.value.updateItem(element, {
        // 节点的样式
        style: {
          lineWidth: 4,
          stroke: "#8db6cc"
        }
      });
    }
  }
}

function clearElementSelected(element, isRemoveBorder) {
  const type = element.get("type");
  const model = element.getModel();
  const group = element.getContainer();
  if (type === "node") {
    const dashBorder = group.find(function(item) {
      return item.get("name") === "dashBorder";
    });
    if (dashBorder) {
      if (!isRemoveBorder) {
        dashBorder.attr("stroke", "#001529");
      } else {
        group.removeChild(dashBorder);
      }
    }
  } else if (type === "edge") {
    if (model && model.target && typeof model.target === "string") {
      graph.value.updateItem(element, {
        style: {
          lineWidth: 2,
          stroke: "#bae7ff"
        }
      });
    }
  }
}

// 注册监听器
function registerListener() {
  window.addEventListener("resize", resizeGraph, false);
}

// 移除监听器
function destroyListener() {
  window.removeEventListener("resize", resizeGraph, false);
}

onMounted(() => {
  initGraph();
  registerListener();
  graph.value.on("node:click", handleElementClick);
  graph.value.on("edge:click", handleElementClick);
});
onUnmounted(() => {
  destroyListener();
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

.asidePanel {
  position: absolute;
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
  }
}

.nodePanel {
  left: 10px;
  top: 10px;

  .panelContent {
    :deep(.el-collapse-item__content) {
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
