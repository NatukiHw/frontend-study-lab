import G6 from "@antv/g6";
import { clickAddEdge } from "./clickAddEdge";

export const registerAllBehavior = () => {
  G6.registerBehavior(clickAddEdge.type, clickAddEdge.config);
};
