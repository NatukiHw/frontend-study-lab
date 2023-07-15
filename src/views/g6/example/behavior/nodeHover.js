const behavior = {
  type: "nodeHover",
  config: {
    getEvents() {
      return {
        "node:mouseover": "onNodeHover",
        "mousemove": "onNodeNormal",
        "connector:mouseover": "onNodeHover"
      };
    },
    onNodeHover(ev) {
      const node = ev.item;
      const model = node.getModel()
      const group = node.getContainer();
      // 悬浮样式
      const dashBorder = group.find(function(item) {
        return item.get("name") === "dashBorder";
      });
      if (!dashBorder) {
        group.addShape("rect", {
          attrs: {
            x: -5,
            y: -5,
            width: 209,
            height: 69,
            stroke: "#001529",
            lineWidth: 2,
            lineDash: [5]
          },
          name: "dashBorder"
        });
      }
      //连接点
      const CONNECTOR_OFFSET = -5
      const connectorPosList = [
        {x: 100, y: CONNECTOR_OFFSET},
        {x: 200 - CONNECTOR_OFFSET, y: 30},
        {x: 100, y: 60 - CONNECTOR_OFFSET},
        {x: CONNECTOR_OFFSET, y: 30}
      ]
      for (const pos of connectorPosList) {
        group.addShape("circle", {
          attrs: {
            x: pos.x,
            y: pos.y,
            r: 5,
            stroke: model.params.nodeColor,
            lineWidth: 1,
            fill: "#ffffff",
            cursor: "pointer"
          },
          name: "connector"
        });
      }
      this.hoverNode = node;
    },
    onNodeNormal(ev) {
      const node = ev.item
      if (this.hoverNode && this.hoverNode !== node) {
        const group = this.hoverNode.getContainer();
        // 悬浮样式清除
        const dashBorder = group.find(function(item) {
          return item.get("name") === "dashBorder";
        });
        if (dashBorder) {
          group.removeChild(dashBorder);
        }
        // 移除连接点
        let connector = group.find(function(item) {
          return item.get("name") === "connector";
        });
        while (connector) {
          group.removeChild(connector)
          connector = group.find(function(item) {
            return item.get("name") === "connector";
          });
        }
        this.hoverNode = null;
      }
    }
  }
};
export {
  behavior as nodeHover
};
