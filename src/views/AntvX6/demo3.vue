<template>
  <div id="test"></div>
</template>
<script>
import { Graph } from "@antv/x6";
// 自定义连接桩
Graph.registerNode(
  "custom-node-width-port",
  {
    inherit: "rect",
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
        rx: 6,
        ry: 6,
      },
    },
    ports: {
      groups: {
        top: {
          position: "top",
          attrs: {
            circle: {
              magnet: true,
              stroke: "#8f8f8f",
              r: 5,
            },
          },
        },
        bottom: {
          position: "bottom",
          attrs: {
            circle: {
              magnet: true,
              stroke: "#8f8f8f",
              r: 5,
            },
          },
        },
      },
    },
  },
  true
);
// 自定义节点
Graph.registerNode(
  "custom-node",
  {
    inherit: "rect",
    width: 100,
    height: 40,
    attrs: {
      body: {
        stroke: "#8f8f8f",
        strokeWidth: 1,
        fill: "#fff",
        rx: 6,
        ry: 6,
      },
    },
  },
  true
);
export default {
  name: "Demo",
  methods: {
    init() {
      const graph = new Graph({
        container: document.getElementById("test"),
        // width: 1000,
        height: 800,
        autoResize: true,
        // panning: true,
        mousewheel: {
          // enabled: true,
          modifiers: ["ctrl", "meta"],
          minScale: 0.1,
          maxScale: 10,
          factor: 0.9,
        },

        background: {
          color: "#F2F7FA",
        },
        grid: {
          visible: true,
          type: "mesh",
          args: [
            {
              color: "#eee", // 主网格线颜色
              thickness: 1, // 主网格线宽度
            },
            {
              color: "#ddd", // 次网格线颜色
              thickness: 1, // 次网格线宽度
              factor: 4, // 主次网格线间隔
            },
          ],
        },
        // 连线
        connecting: {
          allowNode: false,
          allowBlank: false,
          highlight: true,
          createEdge() {
            return this.createEdge({
              attrs: {
                line: {
                  stroke: "#8f8f8f",
                  strokeWidth: 1,
                },
              },
            });
          },
          validateMagnet({ magnet }) {
            // 节点上方的连接桩无法创建连线
            return magnet.getAttribute("port-group") !== "top";
          },
          validateConnection({
            sourceCell,
            targetCell,
            sourceMagnet,
            targetMagnet,
          }) {
            // 不能连接自身
            if (sourceCell === targetCell) {
              return false;
            }

            // 只能从 bottom 连接桩开始连接，连接到 top 连接桩
            if (
              !sourceMagnet ||
              sourceMagnet.getAttribute("port-group") === "top"
            ) {
              return false;
            }
            if (
              !targetMagnet ||
              targetMagnet.getAttribute("port-group") !== "top"
            ) {
              return false;
            }

            // 不能重复连线
            const edges = this.getEdges();
            const portId = targetMagnet.getAttribute("port");
            if (edges.find((edge) => edge.getTargetPortId() === portId)) {
              return false;
            }

            return true;
          },
        },
        // 组合
        embedding: {
          enabled: true,
          findParent({ node }) {
            // 获取移动节点的包围盒
            const bbox = node.getBBox();
            // 找到 data 中配置 { parent: true } 的节点，并且移动节点和找到的节点包围盒相交时，返回 true
            return this.getNodes().filter((node) => {
              const data = node.getData();
              if (data && data.parent) {
                const targetBBox = node.getBBox();
                return bbox.isIntersectWithRect(targetBBox);
              }
              return false;
            });
          },
        },
        // 高亮
        highlighting: {
          // 连接桩可以被连接时在连接桩外围围渲染一个包围框
          magnetAvailable: {
            name: "stroke",
            args: {
              attrs: {
                fill: "#fff",
                stroke: "#A4DEB1",
                strokeWidth: 4,
              },
            },
          },
          // 连接桩吸附连线时在连接桩外围围渲染一个包围框
          // magnetAdsorbed: {
          //   name: "stroke",
          //   args: {
          //     attrs: {
          //       fill: "#fff",
          //       stroke: "#31d0c6",
          //       strokeWidth: 4,
          //     },
          //   },
          // },
        },
      });
      window.__x6_instances__.push(graph);

      graph.addNode({
        shape: "custom-node-width-port",
        x: 40,
        y: 40,
        label: "hello",
        ports: {
          items: [
            {
              id: "port_1",
              group: "top",
            },
            {
              id: "port_2",
              group: "top",
            },
            {
              id: "port_3",
              group: "bottom",
            },
            {
              id: "port_4",
              group: "bottom",
            },
          ],
        },
      });

      graph.addNode({
        shape: "custom-node-width-port",
        x: 160,
        y: 180,
        label: "world",
        ports: {
          items: [
            {
              id: "port_5",
              group: "top",
            },
            {
              id: "port_6",
              group: "top",
            },
            {
              id: "port_7",
              group: "bottom",
            },
            {
              id: "port_8",
              group: "bottom",
            },
          ],
        },
      });
      graph.addNode({
        shape: "custom-node",
        x: 40,
        y: 140,
        width: 120,
        height: 60,
        label: "Child\n(unembed)",
        zIndex: 10,
      });

      graph.addNode({
        shape: "custom-node",
        x: 500,
        y: 100,
        width: 120,
        height: 60,
        label: "Child\n(unembed)",
        zIndex: 10,
      });
      graph.addNode({
        shape: "custom-node",
        x: 300,
        y: 200,
        width: 240,
        height: 160,
        zIndex: 1,
        label: "Parent",
        data: {
          parent: true,
        },
      });
      graph.on("node:change:parent", ({ node }) => {
        console.log(
          "node:change:parent",
          { node },
          node.parent,
          node.getLabel()
        );
        let label = node.getLabel();
        label = label.split("\n")[0];
        if (node.parent) {
          node.attr({
            label: {
              text: label + "\n(embed)",
            },
          });
        } else {
          node.attr({
            label: {
              text: label + "\n(unembed)",
            },
          });
        }
      });
      graph.centerContent();
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss" scoped></style>
