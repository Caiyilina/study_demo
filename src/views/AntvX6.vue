<template>
  <div style="width: 100%; height: 800px">
    <div id="container"></div>
  </div>
</template>
<script>
import { Graph } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
const data = {
  nodes: [
    {
      id: "node1",
      shape: "rect",
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: "hello",
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
          fill: "#fff",
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      id: "node2",
      shape: "rect",
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: "world",
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
  ],
  edges: [
    {
      shape: "edge",
      source: "node1",
      target: "node2",

      label: "x6",
      attrs: {
        // line 是选择器名称，选中的边的 path 元素
        line: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
        },
      },
    },
  ],
};

export default {
  name: "AntvX6",
  data() {
    return {
      graph: null,
    };
  },
  mounted() {
    this.graph = new Graph({
      container: document.getElementById("container"),
      // width: 1000,
      // height: 800,
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
    this.graph.fromJSON(data);

    this.graph.centerContent();
    this.graph.use(new Snapline({ enabled: true }));
    this.graph.addNode({
      shape: "rect",
      x: 100,
      y: 40,
      width: 100,
      height: 40,
    });
  },
};
</script>
<style lang="scss"></style>
