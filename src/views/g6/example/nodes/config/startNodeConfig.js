import { commonDrawShape } from "@/views/g6/example/nodes/config/commonConfig";

const ICON_URL = "/static/g6example/line_round_start.svg";
const NODE_COLOR = "#30BF78";

const node = {
  type: "startNode",
  config: {
    drawShape: commonDrawShape({
      iconUrl: ICON_URL,
      nodeColor: NODE_COLOR
    }).drawShape
  }
};

export {
  node as StartNodeConfig
};
