<template>
  <div style="width: 100%; height: 100vh">
    <!-- <div id="container"></div> -->
    <!-- <demo1></demo1> -->
    <!-- <demo2></demo2> -->
    <!-- <demo3></demo3> -->
    <demo4></demo4>
  </div>
</template>
<script>
import { data1 } from "@/data/mock";
import demo1 from "./demo1.vue";
import demo2 from "./demo2.vue";
import demo3 from "./demo3.vue";
import demo4 from "./demo4.vue";
export default {
  components: { demo1, demo2, demo3, demo4 },
  name: "AntvX6",

  data() {
    return {
      graph: null,
    };
  },
  mounted() {},
};
</script>
<style lang="scss"></style>
