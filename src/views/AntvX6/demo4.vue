<template>
  <div ref="container" style="width: 100%; height: 100vh"></div>
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
    };
  },
  methods: {
    initGraph() {
      this.graph = new Graph({
        container: this.$refs.container,
        width: "100%",
        height: "800px",
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
      // this.graph.use(
      //   new Transform({
      //     resizing: true,
      //     rotating: false,
      //   })
      // );

      // 渲染组织架构图
      this.renderOrgChart();
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

      // 新增文本测量方法
      const textWidth = this.calculateTextWidth(data.name);
      const nodeWidth = Math.max(textWidth + 40, 120); // 设置最小宽度120px

      const node = this.graph.addNode({
        id: data.id,
        shape: isLeaf ? "org-leaf-node" : "org-node",
        x: 0,
        y: 0,
        width: nodeWidth, // 使用动态计算宽度
        height: isLeaf ? 60 : 40,
        data: data,
        attrs: {
          text: {
            text: data.name,
          },
        },
      });

      // 添加点击事件调整层级
      node.on("click", () => {
        node.bringToFront();
        this.graph.getEdges().forEach((edge) => {
          if (edge.getTargetCell() === node) {
            edge.bringToFront();
          }
        });
      });

      // 如果是叶子节点，添加时间标注
      if (isLeaf) {
        node.attr("timeLabel/text", `计划: ${data.planTime}`);
        node.attr("sjLabel/text", `实际: ${data.actualTime}`);
      } else {
        // 设置ann
        node.attr("buttonSign", { d: "M 1 5 9 5 M 5 1 5 9", strokeWidth: 1.6 });
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
      console.log("点击了折叠按钮", data);

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
        hgap: 40,
        vgap: 40,
        direction: "horizontal",
        levelGap: 120,
      };

      // 新增：计算子树尺寸（宽度和高度）
      const getSubtreeSize = (node) => {
        const children = this.graph.getSuccessors(node, { distance: 1 });
        if (children.length === 0) {
          return { width: options.nodeWidth, height: options.nodeHeight };
        }

        // 根据布局方向计算尺寸
        if (options.direction === "horizontal") {
          const totalHeight =
            children.reduce(
              (sum, child) => sum + getSubtreeSize(child).height,
              0
            ) +
            (children.length - 1) * options.vgap;
          return {
            width:
              options.nodeWidth + options.hgap + children[0].getSize().width,
            height: totalHeight,
          };
        } else {
          const totalWidth =
            children.reduce(
              (sum, child) => sum + getSubtreeSize(child).width,
              0
            ) +
            (children.length - 1) * options.hgap;
          return {
            width: totalWidth,
            height:
              options.nodeHeight + options.vgap + children[0].getSize().height,
          };
        }
      };

      // 递归布局（自底向上）
      const walk = (node, x, y) => {
        const children = this.graph.getSuccessors(node, { distance: 1 });

        // 先布局子节点
        children.forEach((child) => {
          const childSize = getSubtreeSize(child);
          walk(child, x + options.nodeWidth + options.hgap, y);
          y += childSize.height + options.vgap;
        });

        // 计算父节点居中位置
        if (children.length > 0) {
          const firstChild = children[0];
          const lastChild = children[children.length - 1];
          const childrenHeight =
            lastChild.getPosition().y -
            firstChild.getPosition().y +
            lastChild.getSize().height;

          node.position(
            x,
            firstChild.getPosition().y +
              childrenHeight / 2 -
              node.getSize().height / 2
          );
        } else {
          node.position(x, y);
        }
      };

      // 从根节点开始布局
      const rootSize = getSubtreeSize(root);
      walk(root, 0, (this.graph.getContentBBox().height - rootSize.height) / 2);
      this.graph.centerContent();
    },
    layout2(root) {
      const options = {
        nodeWidth: 180,
        nodeHeight: 60,
        hgap: 40, // 增加水平间距
        vgap: 40, // 增加垂直间距
        direction: "horizontal",
        // direction: "vertical",
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
            // walk(child, childX, childY, subtreeHeight, level + 1);
            // childY += subtreeHeight + options.vgap;
            if (options.direction == "vertical") {
              walk(child, x, y + options.nodeHeight + options.vgap);
              x += childSize.width + options.hgap;
            } else if (options.direction == "horizontal") {
              walk(child, childX, childY, subtreeHeight, level + 1);
              childY += subtreeHeight + options.vgap;
            }
          });
        }
      };

      walk(root, 0, 0);
      this.graph.centerContent();
    },
    // 新增文本测量方法
    calculateTextWidth(text) {
      const svgNS = "http://www.w3.org/2000/svg";
      const textEl = document.createElementNS(svgNS, "text");
      textEl.setAttribute("font-family", "Arial");
      textEl.setAttribute("font-size", "14px");
      textEl.textContent = text;

      const svg = document.createElementNS(svgNS, "svg");
      svg.style.position = "absolute";
      svg.style.visibility = "hidden";
      svg.appendChild(textEl);
      document.body.appendChild(svg);

      const width = textEl.getBBox().width;
      document.body.removeChild(svg);
      return width;
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
