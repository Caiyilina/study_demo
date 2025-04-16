const orgTree = {
  name: "招投标阶段",
  children: [
    {
      name: "采购文件",
      children: [
        {
          name: "规格书、总图、关键原材料（含焊材）技术规范WR",
          status: "已完成",
          plan: "2019-11-15",
          actual: "2019-11-15",
        },
      ],
    },
    {
      name: "合同采购",
      children: [
        {
          name: "立项",
          status: "已完成",
          plan: "2019-11-15",
          actual: "2019-11-15",
        },
        {
          name: "发标",
          status: "已完成",
          plan: "2019-11-15",
          actual: "2019-11-15",
        },
        {
          name: "收标",
          status: "已完成",
          plan: "2021-01-15",
          actual: "2021-01-15",
        },
        {
          name: "合同签订",
          status: "已完成",
          plan: "2021-03-02",
          actual: "2021-03-02",
        },
        {
          name: "执行策划",
          status: "未完成",
          plan: "",
        },
      ],
    },
  ],
};
const data1 = {
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
// 导出对象，若在模块中使用
export { orgTree, data1 };
