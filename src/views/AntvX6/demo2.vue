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
        shape: "custom-node-width-port",
        x: 40,
        y: 40,
        label: "hello",
        ports: {
          items: [
            {
              id: "port_1",
              group: "bottom",
            },
            {
              id: "port_2",
              group: "bottom",
            },
          ],
        },
      });

      const target = graph.addNode({
        shape: "custom-node-width-port",
        x: 160,
        y: 180,
        label: "world",
        ports: {
          items: [
            {
              id: "port_3",
              group: "top",
            },
            {
              id: "port_4",
              group: "top",
            },
          ],
        },
      });
      graph.addEdge({
        source: { cell: source, port: "port_2" },
        target: { cell: target, port: "port_3" },
        attrs: {
          line: {
            stroke: "#8f8f8f",
            strokeWidth: 1,
          },
        },
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
