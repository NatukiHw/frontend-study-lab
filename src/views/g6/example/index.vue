<template>
  <div class="container">
    <div class="nodePanel">
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
import { ref, onMounted, onUnmounted } from "vue";
import G6 from "@antv/g6";

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
      default: ["drag-canvas", "zoom-canvas", "drag-node", "click-add-edge"]
    },
    defaultEdge: {
      type: "flowEdge",
      style: {
        lineWidth: 2,
        stroke: "#bae7ff"
      }
    },
    connecting: {
      allowMulti: false,
      allowLoop: false,
      allowNode: true,
      allowPort: true,
      allowBlank: false,
      allowEdge: false
    }
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
import { registerAllNode, nodeList } from "./nodes/config/nodeRegister";

registerAllNode();
// 默认展开所有节点组
const nodePanelExpandArr = ref([]);
for (const item of nodeList) {
  nodePanelExpandArr.value.push(item.key);
}

// 添加节点
function addNode(node, e) {
  // 将屏幕/页面坐标转换为渲染坐标
  const point = graph.value.getPointByClient(e.x, e.y);
  // 新创建的节点信息
  const model = {
    id: `node${new Date().valueOf()}${parseInt(Math.random() * 1000)}`,
    title: node.nodeName,
    type: node.nodeType,
    x: point.x,
    y: point.y
  };
  graphData.nodes.push(model)
  graph.value.addItem("node", model, false);
}

// 注册边
import { registerAllEdge } from "./edges/edgeRegister";
registerAllEdge();

// Register a custom behavior: click two end nodes to add an edge
G6.registerBehavior("click-add-edge", {
  // Set the events and the corresponding responsing function for this behavior
  getEvents() {
    return {
      "node:click": "onClick", // The event is canvas:click, the responsing function is onClick
      mousemove: "onMousemove", // The event is mousemove, the responsing function is onMousemove
      "edge:click": "onEdgeClick" // The event is edge:click, the responsing function is onEdgeClick
    };
  },
  // The responsing function for node:click defined in getEvents
  onClick(ev) {
    const self = this;
    const node = ev.item;
    const graph = self.graph;
    // The position where the mouse clicks
    const point = { x: ev.x, y: ev.y };
    const model = node.getModel();
    if (self.addingEdge && self.edge) {
      if (model.in)
      graph.updateItem(self.edge, {
        target: model.id
      });
      console.log('edge', self.edge)
      self.edge = null;
      self.addingEdge = false;
    } else {
      // Add anew edge, the end node is the current node user clicks
      self.edge = graph.addItem("edge", {
        source: model.id,
        target: model.id
      });
      self.addingEdge = true;
    }
  },
  // The responsing function for mousemove defined in getEvents
  onMousemove(ev) {
    const self = this;
    // The current position the mouse clicks
    const point = { x: ev.x, y: ev.y };
    if (self.addingEdge && self.edge) {
      // Update the end node to the current node the mouse clicks
      self.graph.updateItem(self.edge, {
        target: point
      });
    }
  },
  // The responsing function for edge:click defined in getEvents
  onEdgeClick(ev) {
    const self = this;
    const currentEdge = ev.item;
    if (self.addingEdge && self.edge === currentEdge) {
      self.graph.removeItem(self.edge);
      self.edge = null;
      self.addingEdge = false;
    }
  }
});

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
