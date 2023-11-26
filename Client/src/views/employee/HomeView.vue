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
  },//Đây là định nghĩa dữ liệu ban đầu của component. Có sáu thuộc tính được khởi tạo:
//newProductCount, newUserCount, newOrderCount, newProductCountTweened, newUserCountTweened,
//và newOrderCountTweened. Tất cả đều được khởi tạo với giá trị là 0.
  computed: {
    currentUser() {
      return this.$store.state.userE.user;
    },
    loggedIn() {
      return this.$store.state.userE.status.loggedIn;
    },
  },//Đây là các thuộc tính được tính toán (computed properties) trong Vue.js. 
//Chúng được tính toán dựa trên các giá trị khác trong component và sẽ được cập nhật mỗi khi giá trị
//phụ thuộc thay đổi. Trong trường hợp này, currentUser và loggedIn đều phụ thuộc vào trạng thái của Vuex store.
}
//<main id="main">...</main>: Đây là thẻ HTML chính của template, có id là “main”.
//<div class="menu">...</div>: Đây là một thẻ div với class là “menu”, được sử dụng để định dạng phần tử
//bên trong nó.

//<h1>Chào {{ getTimeOfDay }}, {{ currentUser?.name }}!</h1>: Đây là một thẻ tiêu đề h1. 
//Nội dung của nó sẽ được hiển thị dựa trên giá trị của getTimeOfDay và currentUser?.name. getTimeOfDay
//là một phương thức hoặc thuộc tính được tính toán (computed property) trong component, và currentUser?.name 
//là tên của người dùng hiện tại.
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
