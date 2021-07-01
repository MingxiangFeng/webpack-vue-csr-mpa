<template>
  <h1>search</h1>
  <button @click="toHome">to home</button>
</template>

<script>
export default {
  methods: {
    toHome() {
      this.$router.push({name: 'home'})
    }
  }
}
</script>

<style>

</style>