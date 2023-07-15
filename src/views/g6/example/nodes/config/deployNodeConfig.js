const ICON_URL = '/static/g6example/bushu.svg'
const node = {
  type: "deployNode",
  config: {
    drawShape(cfg, group) {
      const color = "#9621a2";
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

      // if (cfg.nodeLevel > 0) {
      //   group.addShape("marker", {
      //     attrs: {
      //       x: 184,
      //       y: 30,
      //       r: 6,
      //       cursor: "pointer",
      //       symbol: cfg.collapse ? G6.Marker.expand : G6.Marker.collapse,
      //       stroke: "#666",
      //       lineWidth: 1
      //     },
      //     name: "collapse-icon"
      //   });
      // }

      // The content list
      // cfg.panels.forEach((item, index) => {
      //   // name text
      //   group.addShape("text", {
      //     attrs: {
      //       textBaseline: "top",
      //       y: 25,
      //       x: 24 + index * 60,
      //       lineHeight: 20,
      //       text: item.title,
      //       fill: "rgba(0,0,0, 0.4)"
      //     },
      //     name: `index-title-${index}`
      //   });
      //
      //   // value text
      //   group.addShape("text", {
      //     attrs: {
      //       textBaseline: "top",
      //       y: 42,
      //       x: 24 + index * 60,
      //       lineHeight: 20,
      //       text: item.value,
      //       fill: "#595959"
      //     },
      //     name: `index-value-${index}`
      //   });
      // });
      return shape;
    }
  }
};

export {
  node as DeployNodeConfig
}
