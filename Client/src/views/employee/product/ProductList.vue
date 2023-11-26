<script>
import ProductListItem from '@/components/ProductListItem.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';//Đây là các câu lệnh import trong JavaScript, nó đang nhập hai component Vue.js từ các file tương ứng.
export default {
  name: "ProductList",//Đây là tên của component.
  components: {//Đây là định nghĩa các component con được sử dụng trong component này. Trong trường hợp này, 
//có hai component con là “ProductListItem” và “ConfirmDialog”.
    ProductListItem,
    ConfirmDialog
  },
  data() {
    const title = document.title;
    const headerItem = {
      name: "Tên sản phẩm",
      quantity: "Số lượng",
      price: "Giá",
      actions: "Actions"
    }
    return {
      title,
      headerItem,
    }
  },//Đây là định nghĩa dữ liệu ban đầu của component. Có hai thuộc tính được khởi tạo: title và headerItem.
  methods: {
    editProductHandler(id) { //Phương thức này nhận vào một id sản phẩm và chuyển hướng người dùng đến trang chỉnh sửa sản phẩm tương ứng.
      this.$router.push({ name: "AdminProductEdit", params: { id: id } })
    },
    deleteProductHandler(id) { // Phương thức này nhận vào một id sản phẩm và hiển thị một hộp thoại xác nhận để xóa sản phẩm. 
//Nếu người dùng xác nhận, nó sẽ gọi đến phương thức deleteproduct.
      this.$refs.confirmDialog.show('Bạn chắc chắn muốn xóa?', { id, handler: "deleteproduct" });
    },
    deleteproduct(id) {//Phương thức này nhận vào một id sản phẩm và gọi đến action product/delete trong Vuex store để xóa sản phẩm. 
//Nếu thành công, nó sẽ hiển thị thông báo thành công và làm mới trang. Nếu có lỗi, nó sẽ hiển thị thông báo lỗi.
      this.$store.dispatch('product/delete', id)
        .then((res) => {
          this.isProcessing = false;

          this.$emit('notification', { message: res.message, type: 'success' })
          this.$router.go(0);
        })
        .catch((error) => {
          this.message =
            (error.response &&
              error.response?.data &&
              error.response?.data.message) ||
            error.message ||
            error.toString();
          this.$emit('notification', { message: error.response?.data.message || error.message, type: "danger" });
        });;
    },
    dialogHandler(payload) {//Phương thức này nhận vào một payload từ hộp thoại xác nhận và kiểm tra xem hành động cần thực hiện là gì. 
//Nếu hành động là “deleteproduct”, nó sẽ gọi đến phương thức deleteproduct.
      if (payload.handler == "deleteproduct")
        this.deleteproduct(payload.id);
    }
  },//Đây là các phương thức được định nghĩa trong component. Các phương thức này có thể được gọi từ template của component 
//hoặc từ các phương thức khác trong component.
  computed: {
    productItems() {
      return JSON.parse(JSON.stringify(this.$store.getters['product/productItems']));
    }
  },//Đây là các thuộc tính được tính toán (computed properties) trong Vue.js. Chúng được tính toán dựa trên các giá trị khác trong component 
//và sẽ được cập nhật mỗi khi giá trị phụ thuộc thay đổi.
  created() {
    this.$store.dispatch('product/getProductItems');
  }//Đây là một vòng đời của component Vue.js, được gọi ngay sau khi một instance của component được tạo. 
//Trong trường hợp này, nó đang gọi một action trong Vuex store để lấy danh sách sản phẩm.
};
//<main class="container">...</main>: Đây là thẻ HTML chính của template, có class là “container”.

//<ProductListItem header :productItem="headerItem" />: Đây là cách sử dụng component “ProductListItem”. 
//Thuộc tính header được đặt là true, và thuộc tính productItem được đặt bằng biến headerItem.

//<ProductListItem @edit="editProductHandler" @delete="deleteProductHandler" v-for="productItem in productItems" :key="productItem.id" 
//:productItem="productItem" />: Đây là một vòng lặp Vue.js (v-for) tạo ra một component “ProductListItem” cho mỗi sản phẩm trong mảng 
//productItems. Mỗi component này sẽ có một sự kiện edit và delete gọi đến các phương thức tương ứng, và một thuộc tính productItem được 
//đặt bằng sản phẩm tương ứng.

//<router-link :to="{ name: 'AdminProductAdd' }"><button class="block">Thêm sản phẩm</button></router-link>: 
//Đây là một liên kết đến trang thêm sản phẩm. Khi người dùng nhấp vào nút “Thêm sản phẩm”, họ sẽ được chuyển hướng đến trang thêm sản phẩm.

//<ConfirmDialog title="" ref="confirmDialog" @confirmed="dialogHandler" :countdown="3"> </ConfirmDialog>: 
//Đây là cách sử dụng component “ConfirmDialog”. Khi có sự kiện confirmed, nó sẽ gọi đến phương thức dialogHandler.
</script>
<template>
  <main class="container">
    
    <div class="is-ancestor">
      <div class="is-parent" style="font-size: 20px; font-family: Arial, Helvetica, sans-serif;">
        <ProductListItem header :productItem="headerItem" />
        <ProductListItem @edit="editProductHandler" @delete="deleteProductHandler" v-for="productItem in productItems"
          :key="productItem.id" :productItem="productItem" />
      </div>
      <router-link :to="{ name: 'AdminProductAdd' }"><button class="block">Thêm sản phẩm</button></router-link>
    </div>
    <ConfirmDialog title="" ref="confirmDialog" @confirmed="dialogHandler" :countdown="3">
    </ConfirmDialog>
  </main>
</template>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: transparent;

  &>div,
  &>h3 {
    padding-inline: 16px;
  }
}

.is-ancestor {
  background-color: transparent;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.is-parent {
  width: 100%;

  display: table;
  flex-wrap: wrap;
  border-spacing: 4px;
  
  gap: 8px;
  row-gap: 8px;

  &>*:nth-child(odd) {
    background-color: #ededed;
  }

  &>*:nth-child(even) {
    background-color: #ffffff;
  }
}
</style>