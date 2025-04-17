<template>
  <div ref="container" style="width: 100%; height: 100%"></div>
</template>

<script>
import { Graph, Shape } from "@antv/x6";
import { Transform } from "@antv/x6-plugin-transform";
import { register } from "@antv/x6-vue-shape";
import { projectProgressTree } from "@/data/mock";

export default {
  name: "Demo4",
  data() {
    return {
      graph: null,
      isRegistered: false, // 添加注册状态标记
    };
  },
  methods: {
    initGraph() {
      this.graph = new Graph({
        container: this.$refs.container,
        width: "100%",
        height: "100%",
        grid: true,
        scroller: true,
        autoResize: true,
        panning: true,
        mousewheel: {
          enabled: true,
          modifiers: ["ctrl", "meta"],
          minScale: 0.1,
          maxScale: 10,
          factor: 0.9,
        },
        interacting: {
          nodeMovable: true,
        },
      });

      // 启用变换插件
      this.graph.use(
        new Transform({
          resizing: true,
          rotating: false,
        })
      );
      // 只在第一次初始化时注册节点类型
      if (!this.isRegistered) {
        this.registerNodeTypes();
        this.isRegistered = true;
      }

      // 渲染组织架构图
      this.renderOrgChart();
    },
    // 注册自定义形状
    registerNodeTypes() {
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
          // {
          //   tagName: "g",
          //   selector: "foldButton",
          //   children: [
          //     {
          //       tagName: "circle",
          //       attrs: {
          //         r: 8,
          //         fill: "#ffffff",
          //         stroke: "#5B8FF9",
          //         strokeWidth: 1,
          //       },
          //     },
          //     {
          //       tagName: "path",
          //       attrs: {
          //         d: "M -4 0 L 4 0 M 0 -4 L 0 4",
          //         stroke: "#5B8FF9",
          //         strokeWidth: 1.5,
          //       },
          //     },
          //   ],
          // },
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
              x: 75, // 居中显示
              y: 80, // 调整到节点底部
              fontSize: 10,
              fill: "#666",
              textAnchor: "middle", // 文字居中
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
    },

    renderOrgChart() {
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
        this.graph.centerContent();

        // 强制重绘
        this.$nextTick(() => {
          this.graph.resize();
        });
      } catch (error) {
        console.error("渲染组织架构图失败:", error);
        // 可以在这里添加备用渲染逻辑或错误提示
      }
    },

    createNode(data) {
      const isLeaf = !data.children || data.children.length === 0;
      const node = this.graph.addNode({
        id: data.id,
        shape: isLeaf ? "org-leaf-node" : "org-node",
        x: 0,
        y: 0,
        width: isLeaf ? 200 : 160,
        height: isLeaf ? 60 : 40,
        data: data,
        attrs: {
          text: {
            text: data.name,
          },
        },
      });

      // 如果是叶子节点，添加时间标注
      if (isLeaf) {
        node.attr(
          "timeLabel/text",
          `计划: ${data.planTime}\n 实际: ${data.actualTime}`
        );
      }

      // 添加折叠/展开按钮点击事件
      if (!isLeaf) {
        node.on("click", ({ e }) => {
          if (e.target.tagName === "circle" || e.target.tagName === "path") {
            this.toggleChildren(node);
          }
        });
      }

      // 递归创建子节点
      if (data.children && data.children.length > 0) {
        data.children.forEach((childData) => {
          const childNode = this.createNode(childData);
          this.graph.addEdge({
            shape: "org-edge",
            source: node,
            target: childNode,
          });
        });
      }

      return node;
    },

    toggleChildren(node) {
      const data = node.getData();
      const children = this.graph.getSuccessors(node, { distance: 1 });

      if (data.collapsed) {
        // 展开子节点
        children.forEach((child) => {
          child.show();
        });
        data.collapsed = false;
      } else {
        // 折叠子节点
        children.forEach((child) => {
          child.hide();
        });
        data.collapsed = true;
      }
    },

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
      this.graph.centerContent();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initGraph();
    });
  },
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 800px;
  border: 1px solid #eee;
}
</style>
