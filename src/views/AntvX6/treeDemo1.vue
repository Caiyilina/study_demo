<template>
  <div ref="treeDemo" id="treeDemo"></div>
</template>
<script>
import { Graph } from "@antv/x6";
import { projectProgressTree } from "@/data/mock";

// 注册自定义节点
Graph.registerNode("tree-node", {
  inherit: "rect",
  width: 150,
  height: 50,
  attrs: {
    body: {
      stroke: "#5F95FF",
      strokeWidth: 1,
      fill: "#fff",
      rx: 2,
      ry: 2,
      event: "click:org-node",
    },
    text: {
      text: "组织节点",
      fill: "#333",
      fontSize: 12,
      event: "click:org-node-label",
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
    // 渲染按钮组
    {
      tagName: "g",
      selector: "buttonGroup",
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
    {
      tagName: "rect",
      selector: "body",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ],
});
// 注册自定义叶子节点
Graph.registerNode("leaf-node", {
  inherit: "rect",
  width: 120,
  height: 50,
  attrs: {
    body: {
      strokeWidth: 1,
      fill: "#73d13d",
      stroke: "#237804",
      rx: 2,
      ry: 2,
      event: "click:leaf-node",
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
      fontSize: 16,
      fill: "orange",
      fontWeight: "bold",
    },
    {
      tagName: "text",
      selector: "planTime",
      attrs: {
        x: 0, // 居中显示
        y: 60, // 调整到节点底部
        fontSize: 10,
        fill: "#3c3c3c",
        textAnchor: "left", //
      },
    },
    {
      tagName: "text",
      selector: "actualTime",
      attrs: {
        x: 0, // 居中显示
        y: 70, // 调整到节点底部
        fontSize: 10,
        fill: "#3c3c3c",
        textAnchor: "left", //
      },
    },
  ],
});
export default {
  name: "treeDemo1",
  data() {
    return {
      treeGraph: null,
    };
  },
  mounted() {
    this.initTree();
  },
  methods: {
    initTree() {
      let container = document.getElementById("treeDemo");
      this.treeGraph = new Graph({
        container: container,
        width: container.offsetWidth,
        height: container.offsetHeight,
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
          type: "doubleMesh",
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
      this.renderData();
      this.treeGraph.centerContent();
    },
    renderData() {
      try {
        const data = projectProgressTree;
        // 确保数据是有效的树结构
        if (!data || typeof data !== "object") {
          throw new Error("无效的数据格式");
        }

        // 确保有根节点
        if (!data.id || !data.name) {
          throw new Error("数据缺少必要的id或name字段");
        }

        // 创建根节点
        const root = this.createNode(data);

        // 确保节点创建成功
        if (!root) {
          throw new Error("根节点创建失败");
        }

        this.layout(root);
        this.treeGraph.centerContent();

        // 强制重绘
        this.$nextTick(() => {
          this.treeGraph.resize();
        });
      } catch (error) {
        console.error("渲染组织架构图失败:", error);
        // 可以在这里添加备用渲染逻辑或错误提示
      }
    },
    // 创建节点
    createNode(data) {
      const isLeaf = !data.children || data.children.length === 0;
      const node = this.treeGraph.addNode({
        shape: isLeaf ? "leaf-node" : "tree-node",
        data: { ...data },
        zIndex: isLeaf ? 0 : 1,
        attrs: {
          text: {
            text: data.name,
          },
        },
      });
      // 如果是叶子节点，添加时间标注
      if (isLeaf) {
        node.attr("planTime/text", `计划: ${data.planTime}`);
        node.attr("actualTime/text", `实际: ${data.actualTime}`);
      }
      // 递归创建子节点
      if (data.children && data.children.length > 0) {
        data.children.forEach((childData) => {
          const childNode = this.createNode(childData);
          // 创建边
          this.treeGraph.addEdge({
            shape: "org-edge",
            router: {
              name: "orth",
              args: { padding: 10 },
            },
            connector: "smooth",
            source: node,
            target: childNode,
          });
        });
      }

      return node;
    },

    // 布局方法
    layout(root) {
      const options = {
        nodeWidth: 180,
        nodeHeight: 60,
        hgap: 40, // 增加水平间距
        vgap: 40, // 增加垂直间距
        direction: "horizontal",
        levelGap: 120, // 新增：层级之间的额外间距
      };

      // 计算子树高度（用于垂直居中）
      const getSubtreeHeight = (node) => {
        const children = this.graph.getSuccessors(node, { distance: 1 });
        if (children.length === 0) {
          return options.nodeHeight;
        }
        return (
          children.reduce((sum, child) => sum + getSubtreeHeight(child), 0) +
          (children.length - 1) * options.vgap
        );
      };
      // 计算子树数量（用于平分空间）
      const countSubtreeNodes = (node) => {
        const children = this.graph.getSuccessors(node, { distance: 1 });
        if (children.length === 0) return 1;
        return children.reduce(
          (sum, child) => sum + countSubtreeNodes(child),
          0
        );
      };
      // 递归布局
      const walk = (node, x, y, parentHeight = 0, level = 0) => {
        node.position(x, y);
        const children = this.graph.getSuccessors(node, { distance: 1 });

        if (children.length > 0) {
          const childX = x + options.nodeWidth + options.hgap;

          // 计算当前节点下所有子节点的总高度
          const totalHeight = getSubtreeHeight(node);

          // 计算起始Y坐标，使子节点组垂直居中
          let childY = y - totalHeight / 2 + options.nodeHeight / 2;

          // 如果是二级及以上节点，使用父节点高度计算位置
          if (level > 0) {
            childY = y - parentHeight / 2 + options.nodeHeight / 2;
            // 添加层级间距
            // childY += level * options.levelGap;
          }

          children.forEach((child) => {
            const subtreeHeight = getSubtreeHeight(child);
            walk(child, childX, childY, subtreeHeight, level + 1);
            childY += subtreeHeight + options.vgap;
          });
        }
      };

      walk(root, 0, 0);
      this.treeGraph.centerContent();
    },
  },
};
</script>
<style lang="scss" scoped>
#treeDemo {
  width: 100%;
  height: 100vh;
}
</style>
