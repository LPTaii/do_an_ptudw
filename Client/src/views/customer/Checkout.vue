<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from 'vee-validate';
import InputTypeNumber from '@/components/InputTypeNumber.vue';
import InputTypeSelect from '@/components/InputTypeSelect.vue';

export default {
  name: "CheckoutCustomer",
  components: {
    Form,
    Field,
    ErrorMessage,
    InputTypeNumber,
    InputTypeSelect
  },
  data() { //Định nghĩa trạng thái ban đầu của component. Trong trường hợp này, nó có nhiều trạng thái như
//id, cart, paymentMethods, paymentMethod, origin, và schema.
    const schema = yup.object().shape({
      receiverName: yup.string().required("Vui lòng nhập tên!"),
      receiverPhone: yup.string().required("Vui lòng nhập SĐT!"),
      receiverAddress: yup.string().required("Vui lòng nhập địa chỉ!"),
      paymentMethod: yup.string().required("Vui lòng chọn Phương thức thanh toán"),
      shippingFee: yup.number(),
      subTotal: yup.number(),
      message: yup.string(),
    });
    return {
      id: "", //Một chuỗi rỗng, có thể được sử dụng để lưu trữ ID của một đối tượng nào đó.
      cart: [], //Một mảng rỗng, có thể được sử dụng để lưu trữ các mục trong giỏ hàng.
      paymentMethods: [{ //Một mảng chứa các phương thức thanh toán. Hiện tại, nó chỉ có một phương thức là “Thanh toán khi giao hàng”
        label: "Thanh toán khi giao hàng",
        value: "CASH_ON_DELIVERY",
      },],
      paymentMethod: null, //Một giá trị null, có thể được sử dụng để lưu trữ phương thức thanh toán được chọn
      origin: location.origin, //Địa chỉ gốc của trang web hiện tại.
      schema //Một đối tượng Yup được sử dụng để xác nhận dữ liệu. Nó định nghĩa các quy tắc xác nhận cho các trường như
// receiverName, receiverPhone, receiverAddress, paymentMethod, shippingFee, subTotal, và message
    }
  },
  methods: { //Định nghĩa các phương thức mà component này sử dụng. Có nhiều phương thức được định nghĩa ở đây,
//bao gồm fetchProduct, toPrice, changePaymentMethod, và submitHandler.
    async fetchProduct(id) { //Phương thức này nhận vào một ID sản phẩm, sau đó gửi một yêu cầu đến Vuex store để lấy thông tin về sản phẩm đó. 
//Nếu yêu cầu thành công, nó sẽ cập nhật product và productImages với dữ liệu trả về. Nếu có lỗi xảy ra, nó sẽ phát ra một thông báo lỗi.

      this.$refs.inputQuantity.reset();
      try {
        this.$store.dispatch('product/getProduct', id)
          .then((data) => {
            this.product = data.product;
            this.productImages = data.images;
          })
          .catch((err) => {
            this.$emit('notification', { message: err.message, type: 'error' });
          })
      } catch (err) {
        err.message = "Dispatching ('product/getProduct'): " + err.message
        this.$emit('notification', { message: err.message, type: 'error' });
      }
    },
    toPrice(value = "") { //: Phương thức này nhận vào một giá trị (mặc định là chuỗi rỗng), chuyển đổi giá trị đó thành định dạng tiền tệ Việt Nam (VND).
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    },
    changePaymentMethod(newMethod) { //Phương thức này nhận vào một phương thức thanh toán mới, cập nhật paymentMethod với phương thức mới, 
//sau đó cập nhật giá trị của input phương thức thanh toán và phát ra một sự kiện thay đổi.
      this.paymentMethod = newMethod;
      this.$refs.paymentMethodInput.$el.value = newMethod?.value || "";
      this.$refs.paymentMethodInput.$el.dispatchEvent(new Event('change'));
    },
    async submitHandler(order) { //Phương thức này nhận vào một đối tượng đơn hàng, sau đó gửi một yêu cầu đến Vuex store để đặt đơn hàng.
//Nếu yêu cầu thành công, nó sẽ phát ra một thông báo thành công, xóa tất cả các mục trong giỏ hàng, 
//và chuyển hướng người dùng đến trang “CustomerOrderSuccess”. Nếu có lỗi xảy ra, nó sẽ phát ra một thông báo lỗi.
      console.log(order.paymentMethod);
      order.list = JSON.parse(JSON.stringify(this.cart))
      console.log(order);
      await this.$store.dispatch('order/placeorder', order)
        .then((res) => {
          this.$emit('notification', {
            message: res.message,
            type: "success"
          })
          this.$store.dispatch('cart/removeAllCartItems')
          this.$router.push({ name: "CustomerOrderSuccess" })
        })
        .catch(err => {
          this.$emit('notification', {
            message: err.message,
            type: "error"
          })
        })
    }
  },
  computed: { //Định nghĩa các thuộc tính được tính toán dựa trên trạng thái hiện tại của component. Trong trường hợp này,
//có nhiều thuộc tính được tính toán như cartQuantity, cartTotal, currentUserC, và shippingFee.
    cartQuantity() { //Trả về số lượng mục trong giỏ hàng, được lấy từ Vuex store.
      return this.$store.getters['cart/cartQuantity'];
    },
    cartTotal() { //Trả về tổng giá trị của các mục trong giỏ hàng, được lấy từ Vuex store.
      return this.$store.getters['cart/cartTotal'];
    },
    currentUserC() { //Trả về thông tin về người dùng hiện tại, được lấy từ trạng thái userC trong Vuex store.
      return this.$store.state.userC.user;
    },
    shippingFee() { //Trả về phí vận chuyển, trong trường hợp này là 0.
      return 0;
    }
  },
  mounted() { //Một hook vòng đời của Vue.js, được gọi ngay sau khi một instance Vue được gắn vào DOM. Trong trường hợp này,
//nó lấy giỏ hàng từ localStorage.
    this.cart = JSON.parse(localStorage.getItem('cartItems' + this.currentUserC._id));//để lấy dữ liệu giỏ hàng đã được lưu trữ dưới dạng chuỗi
//JSON trong localStorage, sau đó chuyển đổi chuỗi JSON này thành một đối tượng JavaScript và gán nó cho this.cart.
  }
}
//orm @submit="submitHandler" :validation-schema="schema": Đây là một component Form với sự kiện submit được xử lý bởi phương thức submitHandler và sử dụng schema như là lược đồ xác thực.

//Field type="text" name="receiverName": Đây là một component Field dùng để nhập tên người nhận.

//v-for="cartitem in cart": Đây là một vòng lặp Vue.js, tạo ra một hàng trong bảng cho mỗi mục trong cart.

//div class="section": Đây là một thẻ div chứa một phần của form đặt hàng, bao gồm thông tin về phương thức thanh toán và tổng số tiền.

//InputTypeSelect @changed="changePaymentMethod" :options="paymentMethods": Đây là một component InputTypeSelect với sự kiện changed được xử lý bởi phương thức changePaymentMethod và sử dụng paymentMethods như là các tùy chọn.

//Field name="subTotal" type="hidden" :value="cartTotal": Đây là một component Field dùng để lưu trữ tổng số tiền của các mục trong giỏ hàng. Nó được ẩn đi và không hiển thị cho người dùng.

//button class="block primary" type="submit": Đây là một nút để gửi form. Khi người dùng nhấp vào nút này, form sẽ được gửi đi.
</script>

<template>
  <main>
    <Form @submit="submitHandler" :validation-schema="schema" class="wrapper">
    <div class="menu">  
      <div class="section header">
        <div class="strip"></div>
        <div class="form-group">
          <h2 style="display: block; width: 100%; padding: 8px;">Đặt hàng</h2>
        </div>
      </div>
      <div class="section">
        <h4>Địa chỉ giao hàng</h4>
        <div class="form-group">
          <label class="w-50">
            Họ và tên:
            <Field type="text" name="receiverName" placeholder="" />
          </label>
          <label class="w-50">
            Số điện thoại:
            <Field type="tel" name="receiverPhone" placeholder="" />
          </label>
          <label>
            Địa chỉ:
            <Field type="text" autocomplete="address" :rows="2" name="receiverAddress" />
          </label>
          <ErrorMessage name="receiverName" />
          <ErrorMessage name="receiverPhone" />
          <ErrorMessage name="receiverAddress" />
        </div>
      </div>
      <div class="section">
        <h4>Sản phẩm đã đặt</h4>
        <div class="form-group">
          <table>
            <tr>
              <th class="" style="text-align: left;"> Tên Sản Phẩm</th>
              <th></th>
              <th class="">Số lượng</th>
              <th class="shrink">Giá</th>
            </tr>
            <tr v-for="cartitem in cart">
              <td>{{ cartitem.productName }}</td>
              <td></td>
              
              <td class="center">{{ cartitem.quantity }}</td>
              <td class="right">{{ toPrice(cartitem.orderPrice) }}</td>
            </tr>
            <tr>
              <td colspan="3" class="right">Tổng đơn hàng({{ cartQuantity }} sản phẩm):&NonBreakingSpace;&NonBreakingSpace;
              </td>
              <td class="right important">{{ toPrice(cartTotal) }}</td>
            </tr>
          </table>
        </div>
      </div>
      
      <div class="section">
        <h4>Phương thức thanh toán</h4>
        <div class="form-group">
          <table>
            <tr>
              <td class=" right"> Phương thức: </td>
              <td class="shrink has-select">
                <InputTypeSelect @changed="changePaymentMethod" :options="paymentMethods" label="" />
                <Field ref="paymentMethodInput" name="paymentMethod" type="hidden" />
                <ErrorMessage name="paymentMethod" style="display: block; width: 100%; text-align: left;" />
              </td>
            </tr>
            <tr>
              <td class="right">Tổng phụ hàng hóa: </td>
              <td class="right">{{ toPrice(cartTotal) }}</td>
              <Field name="subTotal" type="hidden" :value="cartTotal" />
            </tr>
            <tr>
              <td class="right">Phí vận chuyển: </td>
              <td class="right">{{ toPrice(shippingFee) }}</td>
              <Field name="shippingFee" type="hidden" :value="shippingFee" />

            </tr>
            <tr>
              <td class="right">Tổng đơn hàng: </td>
              <td class="right">
                <h3 class="totalPrice">{{ toPrice(cartTotal + shippingFee) }}</h3>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="section">
        <div class="form-group">
          <label>
            Ghi chú:
            <Field name="message" placeholder="" />
          </label>
          <hr>
          <button class="block primary" type="submit">Đặt hàng</button>
        </div>
      </div>
    </div>
    </form>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}

main>* {
  padding: 8px;
}

.wrapper {
  max-width: calc(768px - var(--sidebar-icon-width));
  margin: 8px;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
  border-radius: 8px;
  flex: 1 0 auto;
  box-sizing: border-box;

}

.products-list {
  --column: 1;
  --gap: 8px;
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;

  background-color: #ffffff99;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  row-gap: var(--gap);
  overflow: visible;
}

.wrapper {
  display: block;
}
.menu {
  width: 100%;
  border-radius: 8px;
  background-color: #ffffffaa;
  padding: 8px;
  box-sizing: border-box;
}
.section {
  background-color: #ffffffcc;
  max-width: inherit;
  border-radius: 8px;
  margin-bottom: 8px;
  padding-inline: 16px;
  overflow: hidden;
  box-sizing: border-box;
}

.section.header {
  padding: 0px;
  padding-top: 0px !important;
}

.form-group {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 8px;

  &>* {
    width: 100%;
  }

  & .w-50 {
    width: 50%;

    @media (width <=768px) {
      width: 100%;
    }
  }

}

.strip {
  height: 3px;
  width: 100%;
  background-position-x: -30px;
  background-size: 116px 3px;
  background-image: repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px);
}

label {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px;

  box-sizing: border-box;

  &::after {
    content: none;
  }

  @media screen and (max-width:512px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;

    & input {
      width: 100% !important;
    }
  }
}

input {
  width: calc(100% - 10rem) !important;
  float: right;
  background-color: transparent;

  transition: (transform, padding) .5s ease-in-out;
  font-size: 16px;
  line-height: 8px;
  color: #575756;
  background-color: transparent;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  -webkit-transition: (transform, padding) .5s ease-in-out;
  -moz-transition: (transform, padding) .5s ease-in-out;
  -ms-transition: (transform, padding) .5s ease-in-out;
  -o-transition: (transform, padding) .5s ease-in-out;
  padding: 12px 0;
  outline: 0;
  border: 1px solid transparent;
  border-bottom: 1px solid #575756;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
}

table {
  margin: 8px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgb(222, 222, 222);


 

  & tr {
    display: table-row;
    height: 2em;
  }

  & td {
    display: table-cell;
    padding-inline: 4px;

    &.center {
      text-align: center;
    }

    &.right {
      text-align: right;
    }

    &.important {
      font-size: larger;
      font-weight: 700;
    }
  }

  & .shrink {
    
    width: 1%;
    padding-inline: 8px;
    min-width: 20px;
    white-space: nowrap;
    
  }

  & .shrink.has-select {
    min-width: fit-content;
  }

  &>tr:last-child {
    height: 3em;
  }
}

.totalPrice {
  color: red;
}

button.primary {
  background-color: var(--primary-color);
  color: #fff;
}
</style>
