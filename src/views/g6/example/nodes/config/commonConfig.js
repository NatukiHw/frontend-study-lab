const RADIUS = 2;

export const commonDrawShape = (params) => {
  return {
    drawShape(cfg, group) {
      cfg.params = {
        ...params,
        radius: RADIUS
      }

      const shape = group.addShape("rect", {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 60,
          stroke: params.nodeColor,
          radius: RADIUS,
          cursor: "pointer",
          fill: "#ffffff",
        },
        name: "main-box",
      });

      group.addShape("rect", {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 20,
          fill: params.nodeColor,
          radius: RADIUS,
          cursor: "pointer"
        },
        name: "title-box",
        draggable: true
      });

      // left icon
      group.addShape("image", {
        attrs: {
          x: 4,
          y: 2,
          height: 16,
          width: 16,
          img: params.iconUrl
        },
        name: "node-icon"
      });

      // title text
      group.addShape("text", {
        attrs: {
          textBaseline: "top",
          y: 5,
          x: 24,
          lineHeight: 20,
          text: cfg.title,
          fill: "#fff"
        },
        name: "title"
      });
      return shape;
    }
  }
}
