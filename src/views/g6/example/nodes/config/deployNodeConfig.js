import { commonDrawShape } from "@/views/g6/example/nodes/config/commonConfig";

const ICON_URL = '/static/g6example/bushu.svg'
const NODE_COLOR = "#9621a2";

const node = {
  type: "deployNode",
  config: {
    drawShape: commonDrawShape({
      iconUrl: ICON_URL,
      nodeColor: NODE_COLOR
    }).drawShape
  }
};

export {
  node as DeployNodeConfig
}
