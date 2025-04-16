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

// 导出对象，若在模块中使用
export { orgTree };
