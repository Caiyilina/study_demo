/**
 * @description: 数据转换为树状结构数据
 * @param {*} data 数据
 * @param {*} nodeWidth 节点宽度
 * @param {*} nodeHeight 节点高度
 * @param {*} layerGutter 层间距
 * @param {*} nodeGutter 节点间距
 */
export const dataToTreeData = (
  data = {},
  nodeWidth = 200,
  nodeHeight = 60,
  layerGutter = 100,
  nodeGutter = 30
) => {
  // 计算树的最大深度
  const calculateMaxDepth = (node) => {
    if (!node.children || node.children.length === 0) return 1;
    let maxDepth = 0;
    node.children.forEach((child) => {
      const depth = calculateMaxDepth(child);
      maxDepth = Math.max(maxDepth, depth);
    });
    return maxDepth + 1;
  };
  const maxDepth = calculateMaxDepth(data);

  // 递归计算子树宽度和布局
  const calculateLayout = (node, depth = 0) => {
    if (!node.children || node.children.length === 0) {
      // 叶子节点
      return {
        ...node,
        width: nodeWidth,
        height: nodeHeight,
        subtreeWidth: nodeWidth,
        subtreeHeight: nodeHeight,
        x: 0,
        y: depth * (nodeHeight + layerGutter),
        children: [],
      };
    }

    // 计算所有子节点的布局
    const childrenLayouts = node.children.map((child) =>
      calculateLayout(child, depth + 1)
    );

    // 计算当前子树宽度
    const subtreeWidth = Math.max(
      nodeWidth,
      childrenLayouts.reduce((sum, child) => sum + child.subtreeWidth, 0) +
        (childrenLayouts.length - 1) * nodeGutter
    );

    // 计算当前子树高度
    const subtreeHeight =
      nodeHeight +
      layerGutter +
      Math.max(...childrenLayouts.map((c) => c.subtreeHeight));

    // 计算子节点位置
    let childX =
      (subtreeWidth -
        childrenLayouts.reduce((sum, child) => sum + child.subtreeWidth, 0) -
        (childrenLayouts.length - 1) * nodeGutter) /
      2;

    childrenLayouts.forEach((child) => {
      child.x = childX;
      child.y = nodeHeight + layerGutter + depth * (nodeHeight + layerGutter);
      childX += child.subtreeWidth + nodeGutter;
    });

    return {
      ...node,
      width: nodeWidth,
      height: nodeHeight,
      subtreeWidth,
      subtreeHeight,
      x: 0,
      y: depth * (nodeHeight + layerGutter),
      children: childrenLayouts,
    };
  };

  // 计算完整布局
  const layout = calculateLayout(data);

  // 生成AntV X6所需的nodes和edges
  const nodes = [];
  const edges = [];
  const foldNodes = {}; // 存储折叠节点

  const traverse = (node, parentId = null) => {
    const nodeId = `node-${node.id}`;

    // 添加当前节点
    nodes.push({
      id: nodeId,
      shape: "rect",
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      data: node,
      attrs: {
        body: {
          stroke: "#5F95FF",
          strokeWidth: 1,
          fill: node.children && node.children.length ? "#E6F7FF" : "#FFF",
          rx: 4,
          ry: 4,
        },
        text: {
          text: node.name,
          fontSize: 12,
          fill: "#333",
        },
      },
    });

    // 添加与父节点的边
    if (parentId) {
      edges.push({
        source: parentId,
        target: nodeId,
        attrs: {
          line: {
            stroke: "#A2B1C3",
            strokeWidth: 1,
          },
        },
      });
    }

    // 处理子节点
    if (node.children && node.children.length) {
      // 创建折叠节点
      const foldNodeId = `fold-${node.id}`;
      foldNodes[foldNodeId] = {
        id: foldNodeId,
        parentId: nodeId,
        children: node.children.map((child) => `node-${child.id}`),
      };

      // 添加折叠节点
      nodes.push({
        id: foldNodeId,
        shape: "circle",
        x: node.x + node.width - 15,
        y: node.y + node.height / 2,
        width: 20,
        height: 20,
        data: {
          isFold: true,
          parentId: nodeId,
          children: node.children.map((child) => `node-${child.id}`),
        },
        attrs: {
          body: {
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#FFF",
          },
          text: {
            text: "-",
            fontSize: 14,
            fill: "#5F95FF",
          },
        },
      });

      // 递归处理子节点
      node.children.forEach((child) => traverse(child, nodeId));
    }
  };

  traverse(layout);

  return { nodes, edges, foldNodes };
};
