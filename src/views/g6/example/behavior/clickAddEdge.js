import { ElMessage } from "element-plus";

const behavior = {
  type: 'clickAddEdge',
  config: {
    isAdding: null,
    addingEdge: null,
    startNode: null,

    getEvents() {
      return {
        "node:click": "onNodeClick",
        "mousemove": "onMousemove",
        "edge:click": "onEdgeClick",
        "connector:click": "onConnectorClick"
      };
    },
    onConnectorClick(ev) {
      const node = ev.item;
      const graph = this.graph;
      const model = node.getModel();
      if (!this.isAdding) {
        // 开始添加边
        this.addingEdge = graph.addItem("edge", {
          source: model.id,
          target: model.id
        });
        this.startNode = node;
        this.isAdding = true;
      }
      ev.stopPropagation()
    },
    onNodeClick(ev) {
      const node = ev.item;
      const graph = this.graph;
      const model = node.getModel();
      if (this.isAdding && this.addingEdge) {
        // 边添加完成
        const startNodeId = this.startNode.getModel().id;
        const endNodeId = model.id;
        const fromToEdge = graph.findById(`edge:${startNodeId}-${endNodeId}`);
        const toFromEdge = graph.findById(`edge:${endNodeId}-${startNodeId}`);
        if (startNodeId === endNodeId) {
          // 不能为自己添加连线
          ElMessage.error("不能为自己添加连线");
        } else if (fromToEdge || toFromEdge) {
          // 两个节点间只能存在一条边
          ElMessage.error("不能重复添加连线");
        } else {
          // 由于需要为边添加id，因此删除临时边，为两个节点添加一个带id的新边
          // 创建新边才可以利用findById查询是否已存在边
          graph.addItem("edge", {
            id: `edge:${startNodeId}-${endNodeId}`,
            source: startNodeId,
            target: endNodeId
          });
        }
        graph.removeItem(this.addingEdge);
        this.addingEdge = null;
        this.isAdding = false;
      }
    },
    onMousemove(ev) {
      const graph = this.graph;
      const point = { x: ev.x, y: ev.y };
      if (this.isAdding && this.addingEdge) {
        // 边拖动
        graph.updateItem(this.addingEdge, {
          target: point
        });
      }
    },
    onEdgeClick(ev) {
      const graph = this.graph;
      const currentEdge = ev.item;
      if (this.isAdding && this.addingEdge === currentEdge) {
        // 取消添加边
        graph.removeItem(this.addingEdge);
        this.addingEdge = null;
        this.isAdding = false;
      }
    }
  }
}
export {
  behavior as clickAddEdge
}
