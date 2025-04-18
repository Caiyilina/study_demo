import { Graph } from "@antv/x6";

export default function nodeRegister() {
  // 注册自定义节点
  Graph.registerNode("org-node", {
    inherit: "rect",
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
      foldButton: {
        x: 180,
        y: 30,
        cursor: "pointer",
      },
    },
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
        tagName: "g",
        selector: "foldButton",
        children: [
          {
            tagName: "circle",
            attrs: {
              r: 8,
              fill: "#ffffff",
              stroke: "#5B8FF9",
              strokeWidth: 1,
            },
          },
          {
            tagName: "path",
            attrs: {
              d: "M -4 0 L 4 0 M 0 -4 L 0 4",
              stroke: "#5B8FF9",
              strokeWidth: 1.5,
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
    attrs: {
      line: {
        stroke: "#A3B1BF",
        strokeWidth: 1,
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
