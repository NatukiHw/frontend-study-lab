import { commonDrawShape } from "@/views/g6/example/nodes/config/commonConfig";

const ICON_URL = '/static/g6example/zhihangjiaoben.svg'
const NODE_COLOR = "#3f85ff";

const node = {
  type: "execScript",
  config: {
    drawShape: commonDrawShape({
      iconUrl: ICON_URL,
      nodeColor: NODE_COLOR
    }).drawShape
  }
};

export {
  node as ExecScriptConfig
}
