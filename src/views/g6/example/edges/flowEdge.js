const edge = {
  type: "flowEdge",
  config: {
    afterDraw(cfg, group) {
      // get the first shape in the group, it is the edge's path here=
      const shape = group.get("children")[0];
      // the start position of the edge's path
      const startPoint = shape.getPoint(0);

      // add red circle shape
      const circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: "#1890ff",
          r: 3
        },
        name: "circle-shape"
      });

      // animation for the red circle
      circle.animate(
        (ratio) => {
          // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
          // get the position on the edge according to the ratio
          const tmpPoint = shape.getPoint(ratio);
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint.x,
            y: tmpPoint.y
          };
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 3000 // the duration for executing once
        }
      );
    }
  }
};
export {
  edge as FlowEdge
};
