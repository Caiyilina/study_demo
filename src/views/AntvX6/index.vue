<template>
  <div style="width: 100%; height: 800px">
    <!-- <div id="container"></div> -->
    <demo1></demo1>
  </div>
</template>
<script>
import { Graph } from "@antv/x6";
import { Snapline } from "@antv/x6-plugin-snapline";
import { data1 } from "@/data/mock";
import demo1 from "./demo1.vue";
export default {
  components: { demo1 },
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
    this.graph.fromJSON(data1);

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
