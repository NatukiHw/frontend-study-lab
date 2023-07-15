import { commonDrawShape } from "@/views/g6/example/nodes/config/commonConfig";

const ICON_URL = '/static/g6example/build-outline.svg'
const NODE_COLOR = "#46A2FF";

const node = {
  type: "buildProject",
  config: {
    drawShape: commonDrawShape({
      iconUrl: ICON_URL,
      nodeColor: NODE_COLOR
    }).drawShape
  }
};

export {
  node as BuildProjectConfig
}
