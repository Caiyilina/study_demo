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
const projectProgressTree = {
  id: 1,
  name: "项目总览",
  children: [
    {
      id: 2,
      name: "招投标阶段",
      children: [
        {
          id: 3,
          name: "采购文件准备",
          children: [
            {
              id: 4,
              name: "规格书编制",
              planTime: "2023-01-01",
              actualTime: "2023-01-05",
            },
            {
              id: 5,
              name: "总图绘制",
              planTime: "2023-01-06",
              actualTime: "2023-01-10",
            },
            {
              id: 6,
              name: "关键原材料（含焊材）技术规范WR制定",
              planTime: "2023-01-11",
              actualTime: "2023-01-15",
            },
          ],
        },
        {
          id: 7,
          name: "合同采购流程",
          children: [
            {
              id: 8,
              name: "立项",
              planTime: "2023-02-01",
              actualTime: "2023-02-01",
            },
            {
              id: 9,
              name: "发标",
              planTime: "2023-02-02",
              actualTime: "2023-02-02",
            },
            {
              id: 10,
              name: "收标",
              planTime: "2023-03-01",
              actualTime: "2023-03-01",
            },
            {
              id: 11,
              name: "合同签订",
              planTime: "2023-03-15",
              actualTime: "2023-03-15",
            },
            {
              id: 12,
              name: "执行策划",
              planTime: "2023-04-01",
              actualTime: "未完成",
            },
            {
              id: 122,
              name: "执行策划ces",
              planTime: "2023-04-01",
              actualTime: "未完成",
            },
          ],
        },
      ],
    },
    {
      id: 13,
      name: "项目实施阶段",
      children: [
        {
          id: 14,
          name: "设计环节",
          children: [
            {
              id: 15,
              name: "初步设计",
              planTime: "2023-05-01",
              actualTime: "2023-05-10",
            },
            {
              id: 16,
              name: "详细设计",
              planTime: "2023-05-11",
              actualTime: "2023-05-20",
            },
          ],
        },
        {
          id: 17,
          name: "施工准备",
          children: [
            {
              id: 18,
              name: "场地准备",
              planTime: "2023-06-01",
              actualTime: "2023-06-05",
            },
            {
              id: 19,
              name: "设备采购",
              planTime: "2023-06-06",
              actualTime: "2023-06-15",
            },
          ],
        },
        {
          id: 20,
          name: "施工建设",
          children: [
            {
              id: 21,
              name: "基础施工",
              planTime: "2023-07-01",
              actualTime: "2023-07-15",
            },
            {
              id: 22,
              name: "主体施工",
              planTime: "2023-07-16",
              actualTime: "进行中",
            },
          ],
        },
      ],
    },
    {
      id: 23,
      name: "项目验收阶段",
      children: [
        {
          id: 24,
          name: "预验收",
          planTime: "2023-10-01",
          actualTime: "未开始",
        },
        {
          id: 25,
          name: "正式验收",
          planTime: "2023-11-01",
          actualTime: "未开始",
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
export { orgTree, data1, projectProgressTree };
