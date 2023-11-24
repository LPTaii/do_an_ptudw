<script>

export default {
  data() {
    return {
      newProductCount: 0,
      newUserCount: 0,
      newOrderCount: 0,
      newProductCountTweened: 0,
      newUserCountTweened: 0,
      newOrderCountTweened: 0
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.userE.user;
    },
    loggedIn() {
      return this.$store.state.userE.status.loggedIn;
    },
    
  },
}
</script>

<template>
  <main id="main">
    <div class="menu">
    <h1>Chào {{ getTimeOfDay }}, {{ currentUser?.name }}!</h1>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 3rem 0px 0px 2rem;
}

.menu {
  width: 100%;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 18px;
  box-sizing: border-box;
}
h1{
  color: rgb(0, 141, 96);
}

</style>
