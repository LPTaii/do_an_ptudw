<script>
import CartModal from '@/components/Modal.vue';
import InputTypeNumber from '@/components/InputTypeNumber.vue';

export default {
  name: "Cart",
  props: { // Định nghĩa các thuộc tính mà component này nhận từ component cha. Trong trường hợp này, nó chỉ nhận một thuộc tính là t với kiểu Number.
    t: Number
  },
  data() { // Định nghĩa trạng thái ban đầu của component. Trong trường hợp này, nó có hai trạng thái là cartItems (một mảng rỗng)
    // và origin (được đặt thành location.origin).
    return {
      cartItems: [],
      origin: location.origin
    };
  },
  methods: { // Định nghĩa các phương thức mà component này sử dụng. Có rất nhiều phương thức được định nghĩa ở đây,
    //bao gồm update, showModalHandler, hideModalHandler, checkOutHandler, toPrice, removeAllCartItems, removeCartItem, và cartChangedHandler.
    update() { // Phương thức này được gọi để cập nhật giỏ hàng. Nếu người dùng hiện tại tồn tại,
//nó sẽ gửi một action đến Vuex store để thiết lập người dùng cho giỏ hàng. Sau đó, nó sẽ lấy các mục giỏ hàng từ Vuex store
//và cập nhật trạng thái cartItems của component.
      if (this.currentUserC) {
        this.$store.dispatch("cart/setUser", this.currentUserC._id)
      }
      this.$store.dispatch("cart/getCartItems");
      this.cartItems = this.$store.getters['cart/cartItems'];
    },
    showModalHandler() {// Phương thức này được gọi để hiển thị modal giỏ hàng.
      this.$refs.cartModal.show();
    },
    hideModalHandler() {//Phương thức này được gọi để ẩn modal giỏ hàng.
      this.$refs.cartModal.hide();
    },
    checkOutHandler() {//Phương thức này được gọi khi người dùng nhấp vào nút “Đặt hàng”. 
//Nó sẽ ẩn modal giỏ hàng và chuyển hướng người dùng đến trang “CustomerCheckout”.
      this.$refs.cartModal.hide();
      this.$router.push({ name: "CustomerCheckout" })
    },
    toPrice(v = 0) { //Phương thức này chuyển đổi một số thành định dạng tiền tệ Việt Nam (VND).
      const result = parseInt(v).toLocaleString('vi', { style: 'currency', currency: 'VND' });
      return result;
    },
    removeAllCartItems() {//Phương thức này được gọi khi người dùng muốn xóa tất cả các mục trong giỏ hàng. 
//Nó sẽ hiển thị một hộp thoại xác nhận, và nếu người dùng đồng ý, nó sẽ gửi một action đến Vuex store để xóa tất cả các mục giỏ hàng.
      if (window.confirm("Bạn chắc chằn muốn xóa!")) {
        this.$store.dispatch('cart/removeAllCartItems');
        this.$emit('notification', {
          message: "",
          type: "success"
        })
        this.update()

      }
    },
    removeCartItem($event) { //Phương thức này được gọi khi người dùng muốn xóa một mục cụ thể khỏi giỏ hàng. 
//Nó sẽ lấy id sản phẩm từ sự kiện, gửi một action đến Vuex store để xóa mục giỏ hàng, và sau đó cập nhật giỏ hàng
      this.$emit('notification', {
        message: "",
        type: "success"
      })
      const pid = $event.currentTarget.getAttribute('data-pid');
      this.$store.dispatch('cart/removeCartItem', { productId: pid })

      this.cartItems = [];
      this.$forceUpdate();
      this.update()
    },
    cartChangedHandler(payload) { //Phương thức này được gọi khi số lượng một mục trong giỏ hàng thay đổi. 
//Nó sẽ gửi một action đến Vuex store để cập nhật số lượng của mục giỏ hàng, và sau đó cập nhật giỏ hàng.
      this.$store.dispatch('cart/updateQuantity', { index: payload.params.index, newQuantity: payload.value })
      this.update()
    }
  },
  computed: { //Định nghĩa các thuộc tính được tính toán dựa trên trạng thái hiện tại của component.
    // Trong trường hợp này, có hai thuộc tính được tính toán là currentUserC và cartQuantity.
    currentUserC() { //Đây là một thuộc tính được tính toán trả về người dùng hiện tại từ Vuex store.
      return this.$store.state.userC.user;
    },
    cartQuantity() { //Đây là một thuộc tính được tính toán trả về tổng số lượng mục trong giỏ hàng từ Vuex store.
      return this.$store.getters["cart/cartQuantity"]
    },

  },
  watch: { //Theo dõi sự thay đổi của các thuộc tính hoặc trạng thái và thực hiện hành động khi chúng thay đổi.
    // Trong trường hợp này, nó theo dõi sự thay đổi của thuộc tính t và gọi phương thức update khi nó thay đổi.
    t() {
      this.update();
    }
  },
  created() {// Một hook vòng đời của Vue.js, được gọi ngay sau khi một instance Vue được tạo. Trong trường hợp này, nó gọi phương thức update.
    this.update();
  },
  components: { CartModal, InputTypeNumber } // Định nghĩa các component con được sử dụng trong component này. 
  //Trong trường hợp này, nó sử dụng hai component con là CartModal và InputTypeNumber.
}
//div class="menu": Đây là thẻ div chính chứa toàn bộ nội dung của component.

//@click="showModalHandler": Khi người dùng nhấp vào thẻ div này, hàm showModalHandler sẽ được gọi.

//Teleport to="body": Teleport là một tính năng của Vue.js cho phép bạn di chuyển một phần nội dung HTML tới một nơi khác trên trang.

//CartModal: Đây là một component con được sử dụng trong template này. Nó có các slot tùy chỉnh cho header, body và footer.

//v-for="(item, index) in cartItems": Đây là một vòng lặp Vue.js, tạo ra một hàng trong bảng cho mỗi mục trong cartItems.

//@click.self="removeCartItem": Khi người dùng nhấp vào nút này, hàm removeCartItem sẽ được gọi.

//v-if="cartItems?.length > 0": Điều kiện này kiểm tra xem cartItems có phần tử nào không. 
//Nếu có, nó sẽ hiển thị bảng giỏ hàng. Nếu không, nó sẽ hiển thị hình ảnh giỏ hàng trống.

</script>
<template>
  <div class="menu">
    <div @click="showModalHandler" class="menu-label">
      <img class="icon" :src="origin + '/cart.png'" alt="">
      <a href="#" class="text">Giỏ hàng: {{ cartQuantity }}</a>
    </div>
    <Teleport to="body">
      <CartModal width="500px" ref="cartModal">
        <template #header v-once>
          <h3>GIỎ HÀNG</h3>
        </template>
        <template #body>
          <table class="table" v-if="cartItems?.length > 0">
            <tr>
              <th>Tên</th>
              <th class="shrink">Số lượng</th>
              <th class="shrink">Giá</th>
              <th class="shrink">Hủy</th>
            </tr>
            <tr v-for="(item, index) in cartItems" :key="index" :data-pid="item.productId">
              
              <td>{{ item.productName }}</td>
              <td class="shrink">
                <InputTypeNumber :params="{ index }" @changeWithParams="cartChangedHandler" width="2em"
                  :value="item.quantity" :max="item.maxQuantity" :min="1" />
              </td>
              <td class="shrink">{{ toPrice(item.orderPrice) }}</td>
              <td>
                <button type="button" class="remove-item-button" role="remove" @click.self="removeCartItem"
                  :data-pid="item.productId" :data-quantity="item.quantity"></button>
              </td>
            </tr>
            <tr>
              <th colspan="3">Tổng:</th>
              <th>{{ toPrice($store.getters['cart/cartTotal']) }}</th>
            </tr>
          </table>
          <div v-else v-once>
            <img class="empty-cart-img" :src="origin + '/emptycart.webp'" alt="">
          </div>
        </template>
        <template #footer v-once>
          <button class="modal-default-button" @click="hideModalHandler">Thoát</button>
          <button v-if="cartItems?.length > 0" class="modal-default-button " @click="checkOutHandler">Đặt hàng</button>
          <button v-if="cartItems?.length > 0" class="modal-default-button " @click="removeAllCartItems">Xóa tất cả</button>
        </template>
      </CartModal>
    </Teleport>
  </div>
</template>
<style scoped>
.icon {
  border-radius: 50%;
  overflow: hidden;
  width: 25px;
  height: 25px;
  padding: 5px;
}

.menu {
  max-width: 140px;
  height: 32px;
  display: block;
  overflow: hidden;
  box-shadow: rgba(0, 0, 0, 0.21) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  border-radius: 16px;
}

.menu-label {
  height: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  &>.text {
    text-align: center;
    overflow: hidden;
    border-radius: 25px;
    font-weight: 800;
    width: calc(140px - 40px - 10px);
    padding-right: 5px;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #000;
  }
}

.table {
  width: 100%;
  border-spacing: 2px;
  background-color: var(--primary-color);


  &>tr {
    background-color: white;
  }
}

[role=remove] {
  margin: 4px;
  padding: 4px;
  background-color: transparent;
  border: none;
}

button.primary {
  color: #ddd;
  background-color: var(--primary-color);
}

button.danger {
  color: #ddd;
  background-color: rgb(255, 56, 56);
}

button.remove-item-button {
  width: 30px;
  color: red;
  font-size: 1.2em;

  &::after {
    content: "🗑";
  }

  &:hover {
    box-shadow: none;
    background-color: rgb(255, 214, 214);
  }
}

.shrink {
  width: 1%;
  padding-inline: 8px;
  min-width: 20px;
  white-space: nowrap;
  text-align: right;
}

th.shrink {
  text-align: center;
}

.empty-cart-img {
  width: 100%;
}
</style>