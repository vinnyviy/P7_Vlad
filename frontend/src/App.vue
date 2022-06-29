<script>
import NavBar from "./components/NavBar.vue";

export default {
  name: "App",
  components: { NavBar},
  
};
</script>

<template>
  <NavBar ></NavBar>
  <router-view />
</template>

<style lang="scss" >

$primary-color: #fd2d01;
$secondary-color: #ffd7d7;

#app {
  font-family: 'Lato', Arial, sans-serif;
  
  
}

body {
  
  background: linear-gradient( $secondary-color, $primary-color );
}


</style>
