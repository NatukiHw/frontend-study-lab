const ICON_URL = '/static/g6example/zhihangjiaoben.svg'
const node = {
  type: "execScript",
  config: {
    drawShape(cfg, group) {
      const color = "#3f85ff";
      const radius = 2;
      const shape = group.addShape("rect", {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 60,
          stroke: color,
          radius: radius,
          cursor: "pointer"
        },
        name: "main-box",
        draggable: true
      });

      group.addShape("rect", {
        attrs: {
          x: 0,
          y: 0,
          width: 200,
          height: 20,
          fill: color,
          radius: [radius, radius, 0, 0],
          cursor: "move",
        },
        name: "title-box",
        draggable: true
      });

      group.addShape("rect", {
        attrs: {
          x: 0,
          y: 20,
          width: 200,
          height: 40,
          fill: "#fff",
          cursor: "pointer"
        },
        name: "fill-content"
      });

      // left icon
      group.addShape("image", {
        attrs: {
          x: 4,
          y: 2,
          height: 16,
          width: 16,
          img: ICON_URL
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
};

export {
  node as ExecScriptConfig
}
