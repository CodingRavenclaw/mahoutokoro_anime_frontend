<template>
  <Home></Home>
</template>
<style lang="scss">
#app {
  font-family: Calibri, Helvetica, Arial, sans-serif;
  background: linear-gradient(rgba(0, 0, 0, 0.60), rgba(0, 0, 0, 0.60)), url("assets/wallaper/mahoutokoro.jpeg") no-repeat center center fixed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}
</style>
<script>
import Home from '@/components/Home'
export default {
  components: { Home }
}
</script>
