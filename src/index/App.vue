<template>
  <div class="container">
    <img src="./logo.png" alt="" />
    <span class="text">hello</span>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss" scoped>
.container{
  background-color: blue;
  .text{
    font-size: 34px;
  }
}
// .img1{
//   width: 300px;
//   height: 100px;
// }
</style>