import { commonDrawShape } from "@/views/g6/example/nodes/config/commonConfig";

const ICON_URL = '/static/g6example/ios-git-merge.svg'
const NODE_COLOR = "#202D40";

const node = {
  type: "pullCode",
  config: {
    drawShape: commonDrawShape({
      iconUrl: ICON_URL,
      nodeColor: NODE_COLOR
    }).drawShape
  }
};

export {
  node as PullCodeConfig
}
