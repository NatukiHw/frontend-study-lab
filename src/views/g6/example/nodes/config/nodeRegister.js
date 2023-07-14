import G6 from "@antv/g6";

import { StartNodeConfig } from "./startNodeConfig";
import { FinishNodeConfig } from "./finishNodeConfig";
import { ExecScriptConfig } from "./execScriptConfig";
import { DeployNodeConfig } from "./deployNodeConfig";

export const registerAllNode = () => {
  G6.registerNode(
    StartNodeConfig.type,
    StartNodeConfig.config,
    "single-node"
  );
  G6.registerNode(
    FinishNodeConfig.type,
    FinishNodeConfig.config,
    "single-node"
  );
  G6.registerNode(
    ExecScriptConfig.type,
    ExecScriptConfig.config,
    "single-node"
  );
  G6.registerNode(
    DeployNodeConfig.type,
    DeployNodeConfig.config,
    "single-node"
  );
};

export const nodeList = [
  {
    key: "graphicGroup",
    title: "图形节点",
    child: [
      {
        nodeName: "圆形",
        nodeType: "circle",
        nodeIcon: "prime:circle",
        nodeIconType: "iconfy"
      },
      {
        nodeName: "矩形",
        nodeType: "rect",
        nodeIcon: "ph:rectangle-bold",
        nodeIconType: "iconfy"
      }
    ]
  },
  {
    key: "processGroup",
    title: "流程节点",
    child: [
      {
        nodeName: "启动流程",
        nodeType: "startNode",
        nodeIcon: "icon-line_round_start",
        nodeIconType: "iconfont"
      },
      {
        nodeName: "结束流程",
        nodeType: "finishNode",
        nodeIcon: "icon-finished",
        nodeIconType: "iconfont"
      },
      {
        nodeName: "执行脚本",
        nodeType: "execScript",
        nodeIcon: "icon-zhihangjiaoben",
        nodeIconType: "iconfont"
      },
      {
        nodeName: "部署项目",
        nodeType: "deployNode",
        nodeIcon: "icon-bushu",
        nodeIconType: "iconfont"
      }
    ]
  }
];
