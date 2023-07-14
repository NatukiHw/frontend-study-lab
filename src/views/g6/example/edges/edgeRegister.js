import G6 from "@antv/g6";
import { FlowEdge } from "./flowEdge";

export const registerAllEdge = () => {
  G6.registerEdge(
    FlowEdge.type,
    FlowEdge.config,
    "cubic"
  );
};
