<template>
  <div class="container">
    <div class="component-switcher">
      <button
        v-for="comp in components"
        :key="comp.name"
        @click="currentComponent = comp.name"
        :class="{ active: currentComponent === comp.name }"
      >
        {{ comp.displayName }}
      </button>
    </div>
    <div style="width: 100%; height: cal(100vh - 100px)">
      <component :is="currentComponent"></component>
    </div>
  </div>
</template>
<script>
// 自动引入当前目录下的所有.vue文件（除了index.vue）
const requireComponent = require.context(
  "./",
  false,
  /^(?!.*index\.vue$).*\.vue$/
);
const components = requireComponent.keys().map((fileName) => {
  const componentConfig = requireComponent(fileName);
  const componentName = fileName.replace(/^\.\/(.*)\.\w+$/, "$1");
  return {
    name: componentName,
    displayName: componentName.replace("demo", "Demo "),
    componentConfig,
  };
});
// 导入 tool/nodeRegister方法并使用
import nodeRegister from "./tool/nodeRegister";
nodeRegister();
export default {
  components: {
    ...requireComponent.keys().reduce((acc, fileName) => {
      const componentName = fileName.replace(/^\.\/(.*)\.\w+$/, "$1");
      acc[componentName] = requireComponent(fileName).default;
      return acc;
    }, {}),
  },
  name: "AntvX6",

  data() {
    return {
      components,
      currentComponent: components[0].componentName,
    };
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.component-switcher {
  display: flex;
  gap: 10px;
  height: 50px;
  padding: 10px;
  button {
    padding: 5px 10px;
    background: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      background: #1890ff;
      color: white;
    }

    &:hover {
      background: #e0e0e0;
    }
  }
}
</style>
