import { Graph } from "@antv/x6";

export default function nodeRegister() {
  // 注册自定义节点
  Graph.registerNode("org-node", {
    inherit: "rect",
    zIndex: 9,
    width: 180,
    height: 60,
    attrs: {
      body: {
        stroke: "#5B8FF9",
        strokeWidth: 1,
        fill: "#E6F7FF",
        rx: 4,
        ry: 4,
      },
      text: {
        fontSize: 16,
        fill: "#1890FF",
        fontWeight: "bold",
      },
      // 按钮组的属性
      buttonGroup: {
        refX: "100%",
        refY: "50%",
      },
      button: {
        fill: "#5F95FF",
        stroke: "none",
        x: -10,
        y: -10,
        height: 20,
        width: 30,
        rx: 10,
        ry: 10,
        cursor: "pointer",
        event: "node:collapse",
      },
      buttonSign: {
        refX: 5,
        refY: -5,
        stroke: "#FFFFFF",
        strokeWidth: 1.6,
      },
    },
    markup: [
      {
        tagName: "rect",
        selector: "body",
        attrs: {
          zIndex: 9, // 节点主体层级最高
        },
      },
      {
        tagName: "text",
        selector: "text",
      },
      {
        tagName: "g",
        selector: "buttonGroup",
        attrs: {
          zIndex: 6, // 按钮组层级次之（保持原值）
        },
        children: [
          {
            tagName: "rect",
            selector: "button",
            attrs: {
              "pointer-events": "visiblePainted",
            },
          },
          {
            tagName: "path",
            selector: "buttonSign",
            attrs: {
              fill: "none",
              "pointer-events": "none",
            },
          },
        ],
      },
    ],
  });

  // 注册叶子节点（无子节点的特殊节点）
  Graph.registerNode("org-leaf-node", {
    inherit: "org-node", // 添加相同的ports配置
    width: 150,
    height: 60,
    zIndex: 8,
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "text",
        selector: "text",
      },
      {
        tagName: "text",
        selector: "timeLabel",
        attrs: {
          x: 0, // 居中显示
          y: 75, // 调整到节点底部
          fontSize: 10,
          fill: "#666",
          textAnchor: "left", // 文字居中
        },
      },
      {
        tagName: "text",
        selector: "sjLabel",
        attrs: {
          x: 0, // 居中显示
          y: 85, // 调整到节点底部
          fontSize: 10,
          fill: "#666",
          textAnchor: "left", // 文字居中
        },
      },
    ],
  });

  // 注册边
  Graph.registerEdge("org-edge", {
    inherit: "edge",
    zIndex: 8,
    attrs: {
      line: {
        stroke: "#A3B1BF",
        strokeWidth: 1,
        zIndex: 0, // 边层级最低
      },
    },
    router: {
      name: "manhattan",
      args: {
        padding: 10,
      },
    },
    connector: {
      name: "rounded",
      args: {
        radius: 8,
      },
    },
  });
}
