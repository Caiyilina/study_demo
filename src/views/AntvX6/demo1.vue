<template>
  <div id="test"></div>
</template>
<script>
import { Graph } from "@antv/x6";
export default {
  name: "Demo",
  methods: {
    init() {
      const graph = new Graph({
        container: document.getElementById("test"),
        // width: 1000,
        height: 800,
        autoResize: true,
        panning: true,
        mousewheel: {
          enabled: true,
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
      });
      const source = graph.addNode({
        shape: "custom-node", // 可以直接使用上面注册过的 shape
        x: 40,
        y: 40,
        label: "hello",
        id: "node1",
      });

      const target = graph.addNode({
        shape: "custom-node",
        x: 300,
        y: 220,
        label: "world",
        id: "node2",
      });

      graph.addEdge({
        source,
        target,
        labels: [
          {
            attrs: {
              label: {
                text: "40%",
                stroke: "#aaa",
              },
            },
            position: 0.4,
          },
          {
            attrs: {
              label: {
                text: "60%",
                stroke: "#aaa",
              },
            },
            position: 0.6,
          },
        ],

        attrs: {
          line: {
            sourceMarker: {
              tagName: "path",
              d: "M 20 -10 0 0 20 10 Z",
            },
            targetMarker: {
              tagName: "path",
              fill: "yellow", // 使用自定义填充色
              stroke: "green", // 使用自定义边框色
              strokeWidth: 2,
              d: "M 20 -10 0 0 20 10 Z",
            },
          },
        },

        vertices: [
          { x: 100, y: 200 },
          { x: 300, y: 120 },
        ],
        // 如果没有 args 参数，可以简写为 router: 'orth'
        router: {
          name: "orth",
          args: {},
        },
        connector: {
          name: "jumpover",
          args: {},
        },
      });

      graph.centerContent();
    },
    // 注册节点
    registerNode() {
      // 检查节点是否已存在

      Graph.unregisterNode("custom-node");

      // 注册节点
      Graph.registerNode(
        "custom-node",
        {
          inherit: "rect", // 继承于 rect 节点
          width: 100,
          height: 40,
          markup: [
            {
              tagName: "rect", // 标签名称
              selector: "body", // 选择器
            },
            {
              tagName: "image",
              selector: "img",
            },
            {
              tagName: "text",
              selector: "label",
            },
          ],
          attrs: {
            body: {
              stroke: "#8f8f8f",
              strokeWidth: 1,
              fill: "#fff",
              rx: 6,
              ry: 6,
            },
            img: {
              "xlink:href":
                "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
              width: 16,
              height: 16,
              x: 12,
              y: 12,
            },
          },
        },
        true
      );
    },
  },

  mounted() {
    console.log("demo1-mounted");

    this.registerNode();
    this.init();
  },
  activated() {
    console.log("demo1-activated");
    this.registerInit();
    this.init();
  },
};
</script>
<style lang="scss" scoped></style>
