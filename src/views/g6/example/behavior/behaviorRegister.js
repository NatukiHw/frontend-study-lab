import G6 from "@antv/g6";
import { clickAddEdge } from "./clickAddEdge";
import { nodeHover } from "./nodeHover";
import { edgeHover } from "./edgeHover";

export const registerAllBehavior = () => {
  G6.registerBehavior(clickAddEdge.type, clickAddEdge.config);
  G6.registerBehavior(nodeHover.type, nodeHover.config);
  G6.registerBehavior(edgeHover.type, edgeHover.config);
};
