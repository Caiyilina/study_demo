<template>
  <div style="width: 100%">
    <div class="toggle-btn" @click="isHorizontal = !isHorizontal">切换布局</div>
    <vue2-org-tree
      :data="treeData"
      :horizontal="isHorizontal"
      collapsable
      expand-all
      :props="{
        label: 'name',
        children: 'children',
        expand: 'expand',
        draggable: 'drag', // 添加拖拽控制属性
      }"
      :render-content="renderContent"
      @on-expand="onExpand"
      @on-node-click="onNodeClick"
      @on-node-mouseover="onNodeMouseOver"
      @on-node-mouseout="onNodeMouseOut"
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
    editing: false, //编辑状态
    children: data.children ? data.children.map(initTreeData) : [],
  };
};
export default {
  name: "VueOrgTree",
  data() {
    return {
      treeData: initTreeData(projectProgressTree),
      isHorizontal: true,
    };
  },
  methods: {
    renderContent(h, data) {
      const isLeaf = !data.children || data.children.length == 0;
      if (data.editing) {
        // 编辑状态下禁止拖拽
        data.drag = false;
        this.$set(data, "drag", false);
        return h("input", {
          attrs: {
            type: "text",
            value: data.name,
          },
          on: {
            blur: () => this.endEditing(data),
            keyup: (e) => e.key === "Enter" && this.endEditing(data),
            input: (e) => this.$set(data, "name", e.target.value),
          },
          domProps: {
            value: data.name,
          },
          style: {
            border: "1px solid #dcdfe6",
            padding: "8px 15px",
            borderRadius: "4px",
            outline: "none",
            fontSize: "14px",
            color: "#606266",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
            transition: "border-color 0.2s",
            "&:focus": {
              borderColor: "#409eff",
              boxShadow: "0 0 8px rgba(64,158,255,0.3)",
            },
          },
          class: "node-edit-input",
        });
      } else {
        // 非编辑状态允许拖拽
        data.drag = true;
        this.$set(data, "drag", true);
        return h(
          "span",
          {
            on: {
              dblclick: () => this.startEditing(data),
            },
            class: isLeaf ? "leaf-node" : "normal-node",
          },
          data.name
        );
      }
    },
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
      // this.$set(data, "selectedKey", !data["selectedKey"]);
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
    startEditing(data) {
      this.$set(data, "editing", true);
      this.$set(data, "drag", false);
      this.$nextTick(() => {
        const input = this.$refs.editInput;
        input && input.focus();
      });
    },

    endEditing(data) {
      this.$set(data, "editing", false);
      this.$set(data, "drag", true);
      console.log("endediting", data);
    },
  },
};
</script>
<style lang="scss">
.toggle-btn {
  margin: 10px;
  padding: 10px 20px;
  background: orange;
  color: #fff;
  font-size: 16px;
  width: fit-content;
  height: 20px;
  line-height: 20px;
  cursor: pointer;
  &:hover {
    background: rgb(245, 164, 14);
  }
}
.selected-node {
  background: tomato;
}

.bg_node {
  cursor: pointer;
}
.node-edit-input {
  border: 1px solid #dcdfe6;
  padding: 8px 15px;
  border-radius: 4px;
  outline: none;
  font-size: 14px;
  color: #606266;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s;

  &:focus {
    border-color: #409eff;
    box-shadow: 0 0 8px rgba(64, 158, 255, 0.3);
  }
  /* 禁止拖拽 */
  -webkit-user-drag: none;
}
.leaf-node {
  color: blue;
  display: block;
  width: 100%;
  height: 100%;
}
</style>
