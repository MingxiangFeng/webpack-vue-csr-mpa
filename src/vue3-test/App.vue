<template>
<div>
  <img alt="Vue logo" src="./logo.png" />
  <div>
    {{name}}
  </div>
</div>
</template>

<script>
import { reactive } from '@vue/composition-api'

export default {
  name: 'App',
  setup() {
    const state = reactive({
      name: 'fengmingxiang'
    })
    return {...state}
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
