/**
 * @description: 数据转换为树状结构数据
 * @param {*} data 数据
 * @param {*} nodeWidth 节点宽度
 * @param {*} nodeHeight 节点高度
 * @param {*} layerGutter 层间距
 * @param {*} nodeGutter 节点间距
 */
export const dataToTreeData = (
  data = [],
  nodeWidth = 80,
  nodeHeight = 80,
  layerGutter = 250,
  nodeGutter = 100
) => {
  const cloneData = JSON.parse(JSON.stringify(data)); // 不影响旧数据，copy一份
  const x6Nodes = []; // 转换后的X6节点数组
  const x6Edges = []; // 转换后的x6边组合
  const idToX6Map = {}; // id 对应对象map

  const calcNodes = []; // 用于计算节点下子树节点的宽高，x,y 数据

  const idToCalcNodesMap = {}; // 用于记录计算数据的 id 对应节点的map

  const collapsableNodes = {}; // 存在收缩展开子节点的功能， 用于记录收缩节点的数据

  cloneData.forEach((node) => {
    const x6Node = {
      id: node.id,
      shape: "treeNode",
      width: nodeWidth,
      height: nodeHeight,
      x: 0,
      y: 0,
      data: {
        ...node,
      },
    };
    idToX6Map[node.id] = x6Node;
    x6Nodes.push(x6Node);
    const calcNode = {
      ...node,
      width: nodeWidth,
      height: nodeHeight,
      subTreeWidth: 0,
      subTreeHeight: nodeHeight,
      usedWidth: 0, // 已经使用了的宽度
    };
    calcNodes.push(calcNode);
    idToCalcNodesMap[node.id] = calcNode;
  });
  // 排序
  cloneData.sort((a, b) => {
    // 1、根据layer降序
    if (a.layer !== b.layer) {
      return b.layer - a.layer;
    }
    // 2、根据父id 升序
    return a.parentId - b.parentId;
  });
  // 绘制 层数编号
  if (cloneData.length) {
    const maxLayer = cloneData[0].layer;
    for (let i = maxLayer; i >= 1; i--) {
      const layerNode = {
        shape: "rect", // 矩形
        x: -300, // 距离左侧
        y: 200 + i * (layerGutter + nodeHeight), // 距离顶部
        width: 100,
        height: 100,
        attrs: {
          body: {
            fill: "none",
            stroke: "none",
          },
          label: {
            // text: , //TODO 使用节点中的name属性
            fill: "#666",
            fontSize: 48,
          },
        },
      };
      x6Nodes.push(layerNode);
    }
  }

  // 计算节点的宽度，自底向上
  cloneData.forEach((node) => {
    const parentId = node.parentId;
    // 更新子树宽度
    const maxSubTreeWidth = Math.max(
      idToCalcNodesMap[node.id].subTreeWidth,
      idToCalcNodesMap[node.id].width
    );
    idToCalcNodesMap[node.id].subTreeWidth = maxSubTreeWidth;
    // 存在父节点，更新父节点数据
    if (parentId) {
      const parentNode = idToCalcNodesMap[parentId];
      if (parentNode.subTreeWidth == 0) {
        parentNode.subTreeWidth = maxSubTreeWidth + parentNode.subTreeWidth;
      } else {
        parentNode.subTreeWidth =
          parentNode.subTreeWidth + maxSubTreeWidth + nodeGutter;
      }
    }
  });
};
