<template>
  <div style="width: 100%">
    <vue2-org-tree
      :data="treeData"
      :horizontal="true"
      collapsable
      expand-all
      :props="{
        label: 'name',
        children: 'children',
        expand: 'expand',
      }"
      @on-expand="onExpand"
      @on-node-click="onNodeClick"
      @on-node-mouseover="onNodeMouseOver"
      @on-node-mouseout="onNodeMouseOut"
      @on-node-drop="onNodeDrop"
      selected-class-name="selected-node"
      selected-key="selectedKey"
    />
  </div>
</template>
<script>
import { projectProgressTree } from "@/data/mock";
// 初始化时添加expand属性
const initTreeData = (data) => {
  return {
    ...data,
    expand: true, // 默认展开状态
    children: data.children ? data.children.map(initTreeData) : [],
  };
};
export default {
  name: "VueOrgTree",
  data() {
    return {
      treeData: initTreeData(projectProgressTree),
    };
  },
  methods: {
    onExpand(e, data) {
      console.log("onExpand", e, data, data.expand);
      "onExpand", e, data;
      if ("expand" in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        // this.$set(data, "expand", true);
        this.$set(data, "expand", !data.expand);
      }
    },
    collapse(nodes) {
      // console.log("collapse", nodes);

      nodes.forEach((node) => {
        // console.log("collapse-node", node);
        if (node.expand) {
          node.expand = false;
          this.$set(node, "expand", false);
        }

        node.children && this.collapse(node.children);
      });
    },
    onNodeClick(e, data) {
      console.log("CLICK", e);
      this.$set(data, "selectedKey", !data["selectedKey"]);
    },
    onNodeMouseOver(e, data) {
      // console.log("MOUSE OVER", e, data);
    },
    onNodeMouseOut(e, data) {
      // console.log("MOUSE OUT", e);
    },
    onNodeDrop(e, drag, drop) {
      console.log("DROP", e);
      console.log("drag:", drag);
      console.log("drop:", drop);
    },
  },
};
</script>
<style lang="scss">
.selected-node {
  background: tomato;
}

.bg_node {
  cursor: pointer;
}
</style>
