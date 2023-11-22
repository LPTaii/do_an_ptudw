<script>
import CartModal from '@/components/Modal.vue';
import InputTypeNumber from '@/components/InputTypeNumber.vue';

export default {
  name: "Cart",
  props: {
    t: Number
  },
  data() {
    return {
      cartItems: [],
      origin: location.origin
    };
  },
  methods: {
    update() {
      if (this.currentUserC) {
        this.$store.dispatch("cart/setUser", this.currentUserC._id)
      }
      this.$store.dispatch("cart/getCartItems");
      this.cartItems = this.$store.getters['cart/cartItems'];
    },
    showModalHandler() {
      this.$refs.cartModal.show();
    },
    hideModalHandler() {
      this.$refs.cartModal.hide();
    },
    checkOutHandler() {
      this.$refs.cartModal.hide();
      this.$router.push({ name: "CustomerCheckout" })
    },
    toPrice(v = 0) {
      const result = parseInt(v).toLocaleString('vi', { style: 'currency', currency: 'VND' });
      return result;
    },
    removeAllCartItems() {
      if (window.confirm("Bạn chắc chằn muốn xóa!")) {
        this.$store.dispatch('cart/removeAllCartItems');
        this.$emit('notification', {
          message: "",
          type: "success"
        })
        this.update()

      }
    },
    removeCartItem($event) {
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
    cartChangedHandler(payload) {
      this.$store.dispatch('cart/updateQuantity', { index: payload.params.index, newQuantity: payload.value })
      this.update()
    }
  },
  computed: {
    currentUserC() {
      return this.$store.state.userC.user;
    },
    cartQuantity() {
      return this.$store.getters["cart/cartQuantity"]
    },

  },
  watch: {
    t() {
      this.update();
    }
  },
  created() {
    this.update();
  },
  components: { CartModal, InputTypeNumber }
}
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