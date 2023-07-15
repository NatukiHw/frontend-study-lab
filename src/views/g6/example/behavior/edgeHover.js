const behavior = {
  type: "edgeHover",
  config: {
    getEvents() {
      return {
        "edge:mouseover": "onEdgeHover",
        "edge:mouseout": "onEdgeNormal"
      };
    },
    onEdgeHover(ev) {
      const edge = ev.item;
      const model = edge.getModel();
      const graph = this.graph;
      // 边已有终点
      if (model && model.target && typeof model.target === "string") {
        graph.updateItem(edge, {
          // 节点的样式
          style: {
            lineWidth: 4,
            cursor: "pointer"
          }
        });
      }
    },
    onEdgeNormal(ev) {
      const edge = ev.item;
      const model = edge.getModel();
      const graph = this.graph;
      if (model && model.target && typeof model.target === "string") {
        graph.updateItem(edge, {
          // 节点的样式
          style: {
            lineWidth: 2,
            cursor: "default"
          }
        });
      }
    }
  }
};
export {
  behavior as edgeHover
};
