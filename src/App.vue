<template>
  <div id="app">
    <nav>
      <router-link to="/about">About</router-link> |
      <router-link to="/antvX6">AntV6</router-link> |
      <router-link to="/OrgTree">OrgTree</router-link>
    </nav>
    <div class="view"><router-view /></div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.view {
  width: 100%;
  height: calc(100vh - 100px);
}
</style>
