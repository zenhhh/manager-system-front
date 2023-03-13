<template>
  <UserManagement/>
</template>

<script>
import UserManagement from './components/UserManagement.vue'

export default {
  name: 'App',
  components: {
    UserManagement
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: -10px;
}
</style>
