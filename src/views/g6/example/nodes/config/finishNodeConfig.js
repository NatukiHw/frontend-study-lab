import { commonDrawShape } from "@/views/g6/example/nodes/config/commonConfig";

const ICON_URL = '/static/g6example/finished.svg'
const NODE_COLOR = "#909090";

const node = {
  type: "finishNode",
  config: {
    drawShape: commonDrawShape({
      iconUrl: ICON_URL,
      nodeColor: NODE_COLOR
    }).drawShape
  }
};

export {
  node as FinishNodeConfig
}
