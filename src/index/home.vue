<template>
  <div>home
    <button @click="toSearch">to search</button>
  </div>
</template>

<script>
export default {
  methods: {
    toSearch() {
      this.$router.push({name: 'search'})
    }
  }
}
</script>

<style>

</style>