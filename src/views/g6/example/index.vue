<template>
  <div class="container">
    <!-- 节点面板 -->
    <div class="node_panel">
      <div v-for="item in nodeList" :key="item" class="node_li">
        <div
          :class="['item_shape', item]"
          draggable="true"
          @dragend="addNode(item, $event)"
        />
        <div>{{ item }}</div>
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
const nodeList = ["rect", "circle"];

// 添加节点
function addNode(type, e) {
  // 将屏幕/页面坐标转换为渲染坐标
  const point = graph.value.getPointByClient(e.x, e.y);

  // 新创建的节点信息
  const model = {
    id: "node" + Math.random(), // id使用了随机数，尽可能避免重复
    label: type, // 文本标签
    type: type, // 图片类型的节点
    x: point.x,
    y: point.y
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

.node_panel {
  position: absolute;
  left: 10px;
  top: 10px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  padding: 10px 4px;
  border-radius: 4px;
  z-index: 10;
}

.node_li {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  user-select: none;

  &:last-child {
    margin-bottom: 0;
  }
}

.item_shape {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
}

.circle {
  border-radius: 50%;
}
</style>
