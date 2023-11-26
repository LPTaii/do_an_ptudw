<script>
import { ref } from 'vue';
import InputTypeDate from '@/components/InputTypeDate.vue';
import InputTypeSelect from '@/components/InputTypeSelect.vue';
import Modal from '@/components/Modal.vue';
import { OrderStatus } from '@/config/index.config';

export default {
  name: "OrderList",
  components: {
    Modal,
    InputTypeDate,
    InputTypeSelect
  },
  data() {
    return {
      origin: location.origin,
      OrderStatus,
      orderStatus: [],
      orderStatusOption: [],
      userSuggest: [],
      filters: {},
      orders: [],
      mongoObjectIdRegExp: '^([0-9a-fA-F]){24}$',
      currentOrderDetail: {},
      newOrderStatus: ""
    }
  },
  methods: {
    getDetail(e) {// Phương thức này sẽ lấy chi tiết đơn hàng dựa trên index của phần tử được click và hiển thị modal chi tiết đơn hàng.
      this.currentOrderDetail = (this.orders[e.currentTarget.getAttribute('data-index')]);
      this.$refs.detailModal.show();
    },
    showModalHandler() {//Các phương thức này sẽ hiển thị và ẩn modal.
      this.showModal = true;
    },
    hideModalHandler() {//Các phương thức này sẽ hiển thị và ẩn modal.
      this.showModal = false;
    },
    toPrice(value = "") {//Phương thức này sẽ chuyển đổi giá trị thành định dạng tiền tệ Việt Nam.
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    },
    addFilter(filter) {//Phương thức này sẽ thêm bộ lọc vào filters.
      this.filters = {
        ...this.filters,
        ...filter
      }
    },
    orderStatusFilter(e) {//Phương thức này sẽ thêm bộ lọc trạng thái đơn hàng vào filters dựa trên phần tử được click.
      const siblings = e.target.parentNode.querySelectorAll(e.target.localName)//Dòng này lấy tất cả các phần tử anh chị em của phần tử được click.
      siblings.forEach(element => {
        element.classList.remove('active');
      });//Dòng này xóa class active khỏi tất cả các phần tử anh chị em.
      e.target.classList.add('active');//Dòng này thêm class active vào phần tử được click.

      const q = JSON.parse(e.target.getAttribute('data-query'));//Dòng này lấy giá trị của thuộc tính data-query của phần tử được click và 
//chuyển đổi nó từ chuỗi JSON thành một đối tượng JavaScript.
      this.addFilter({ status: q.status });//Dòng này thêm bộ lọc trạng thái đơn hàng vào filters với trạng thái là q.status.
    },//Vì vậy, khi một phần tử được click, phương thức này sẽ đặt trạng thái của phần tử đó thành active, xóa trạng thái active khỏi tất cả các
//phần tử khác, và thêm bộ lọc trạng thái đơn hàng vào filters dựa trên trạng thái của phần tử được click. Điều này cho phép bạn lọc các đơn 
//hàng dựa trên trạng thái của chúng.

    searchCustomer(e) {//Phương thức này sẽ tìm kiếm khách hàng dựa trên giá trị của input và thêm bộ lọc customerId vào filters.
      this.userSuggest = [];//Dòng này đặt lại mảng userSuggest thành một mảng rỗng.
      if (e.target.value) {
        this.$store.dispatch('order/searchUser', e.target.value)
          .then(res => {
            console.log(res);
            this.userSuggest = res.data;
          })
      }//Nếu input có giá trị, phương thức này sẽ gửi yêu cầu lên Vuex store để tìm kiếm người dùng với giá trị của input. Kết quả sẽ được gán 
//cho userSuggest.

      if (e.target.checkValidity()) {//Nếu input hợp lệ, phương thức này sẽ thêm bộ lọc customerId vào filters với customerId là giá trị của 
//input nếu giá trị đó không phải là chuỗi rỗng. Nếu không, customerId sẽ được đặt thành undefined.
        this.addFilter({ customerId: (e.target.value !== "") ? e.target.value : undefined })
      } else {
        this.addFilter({ customerId: undefined })
      }
    },//Vì vậy, khi một người dùng nhập vào input, phương thức này sẽ tìm kiếm khách hàng dựa trên giá trị đó và thêm bộ lọc customerId vào 
//filters dựa trên giá trị của input. Điều này cho phép bạn lọc các đơn hàng dựa trên khách hàng.

    getSuggest(e) {//Phương thức này sẽ cập nhật giá trị của input gợi ý với id của phần tử được click.
      this.$refs.suggestInput.value = e.target.getAttribute('data-id');
      this.$refs.suggestInput.dispatchEvent(new Event('input'))
    },
    inputTypeDateChangeHandler(d) {//Phương thức này sẽ thêm bộ lọc createdAt vào filters dựa trên giá trị của input ngày. Nếu giá trị là
//“Invalid Date”, createdAt sẽ được đặt thành undefined. Nếu không, createdAt sẽ được đặt thành một đối tượng với thuộc tính $gt là giá trị của
//input ngày.
      if (d == "Invalid Date") {
        this.addFilter({ createdAt: undefined })
      } else {
        this.addFilter({
          createdAt: {
            $gt: d
          }
        })
      }
    },
    saveNewOrderStatus(newVal) {//Phương thức này sẽ lưu trạng thái mới của đơn hàng vào newOrderStatus. 
//Trạng thái mới này sẽ được lấy từ newVal.query.status.
      this.newOrderStatus = newVal.query.status
    },
    processOrder() {// Phương thức này sẽ xử lý đơn hàng bằng cách gửi yêu cầu lên server với id của đơn hàng hiện tại và trạng thái mới. 
//Sau khi xử lý xong, nó sẽ cập nhật lại danh sách đơn hàng và phát sự kiện thông báo.
      this.$refs.processOrderModal.hide()//Đầu tiên, phương thức này sẽ ẩn modal xử lý đơn hàng và modal chi tiết đơn hàng.
      this.$refs.detailModal.hide()//Đầu tiên, phương thức này sẽ ẩn modal xử lý đơn hàng và modal chi tiết đơn hàng.

      this.$store.dispatch('order/processOrder', {//Sau đó, nó sẽ gửi yêu cầu lên Vuex store để xử lý đơn hàng với id của đơn hàng hiện tại 
//(this.currentOrderDetail._id) và trạng thái mới (this.newOrderStatus).
        orderId: this.currentOrderDetail._id,
        newStatus: this.newOrderStatus
      }).then(res => {//Nếu yêu cầu thành công, phương thức này sẽ cập nhật lại danh sách đơn hàng bằng cách gọi this.addFilter({}) và phát sự
//kiện thông báo với thông điệp từ server và loại là ‘success’.
        this.addFilter({});
        this.$emit('notification', {
          message: res.message,
          type: 'success'
        })
      }).catch(errres => {//Nếu yêu cầu thất bại, phương thức này sẽ phát sự kiện thông báo với thông điệp lỗi từ server và loại là ‘error’.
        this.$emit('notification', {
          message: errres.response.data.message,
          type: 'error'
        })
      })
    }
  },
  computed: {//Đây là nơi khai báo các thuộc tính được tính toán. Các thuộc tính này sẽ được tính lại mỗi khi có sự thay đổi trong các phụ thuộc
//của chúng.
    productItems() {//Thuộc tính này trả về một bản sao của productItems từ Vuex store.
      return JSON.parse(JSON.stringify(this.$store.getters['product/productItems']));
    }
  },
  watch: {//Đây là nơi khai báo các watcher. Các watcher này sẽ được gọi mỗi khi có sự thay đổi trong các phụ thuộc của chúng.
    async filters(newVal) {//Đây là watcher cho thuộc tính filters. Mỗi khi filters thay đổi, hàm getorderlistadmin từ Vuex store sẽ được gọi với
//newVal (giá trị mới của filters) làm tham số. Kết quả sẽ được gán cho orders, cập nhật danh sách các đơn hàng hiển thị cho người dùng.
      console.log(newVal);
      this.orders = [];
      this.$store.dispatch('order/getorderlistadmin', newVal)
        .then(res => {
          console.log(res);
          this.orders = res.data
        });
    }//Vì vậy, watcher này cho phép bạn cập nhật danh sách đơn hàng mỗi khi có sự thay đổi trong bộ lọc đơn hàng. Điều này rất hữu ích khi bạn 
//muốn danh sách đơn hàng phản ánh các bộ lọc mà người dùng đã chọn.
  },

  created() {//Đây là một lifecycle hook của Vue.js, được gọi sau khi instance được tạo nhưng trước khi nó được gắn vào DOM. Trong trường hợp này,
//nó được sử dụng để khởi tạo orderStatus và orderStatusOption dựa trên OrderStatus.
    this.orderStatus = ref([]);//Đầu tiên, orderStatus và orderStatusOption được khởi tạo như là một mảng rỗng.
    this.orderStatusOption = ref([]);//Đầu tiên, orderStatus và orderStatusOption được khởi tạo như là một mảng rỗng.
    Object.keys(OrderStatus).forEach((os, index) => {//Sau đó, phương thức này duyệt qua tất cả các key của OrderStatus.
      this.orderStatus.push(OrderStatus[os])//Mỗi key của OrderStatus được thêm vào orderStatus.
      this.orderStatusOption.push({
        label: OrderStatus[os].name.toString(),
        value: os,
      })//Đối với mỗi key, một đối tượng với label là tên của trạng thái đơn hàng và value là key được thêm vào orderStatusOption.
    });
  }//Vì vậy, sau khi created() được gọi, orderStatus và orderStatusOption sẽ chứa thông tin về tất cả các trạng thái đơn hàng có sẵn.
};
//<main class="container">: Đây là thẻ chính chứa tất cả các thành phần khác.
//<div class="is-ancestor">: Đây là một thẻ chứa các thành phần con.
//<div class="filters">: Đây là một thẻ chứa các bộ lọc.
//<div class="suggest-wrapper" ref="suggestUser">: Đây là một thẻ chứa các gợi ý người dùng.
//<div id="suggests">: Đây là một thẻ chứa các gợi ý.

//<div class="suggest-item" v-for="(user, ind) in userSuggest" @click="getSuggest" :data-id="user._id">: Đây là một thẻ chứa các mục gợi ý. 
//Nó sử dụng vòng lặp v-for để lặp qua mỗi người dùng trong userSuggest và gán sự kiện click vào hàm getSuggest.

//<div class="filter-item" @click="orderStatusFilter" v-for="item in orderStatus" :data-query="JSON.stringify(item.query)">{{item.label }}</div>:
//Đây là một thẻ chứa các mục bộ lọc. Nó sử dụng vòng lặp v-for để lặp qua mỗi mục trong orderStatus và gán sự kiện click vào hàm 
//orderStatusFilter.

//<div class="is-parent" v-if="orders.length > 0">: Đây là một thẻ chứa các đơn hàng. Nó chỉ hiển thị nếu có ít nhất một đơn hàng.

//<div class="card" v-for="(item, index) in orders" @click="getDetail" :data-index="index">: Đây là một thẻ chứa thông tin chi tiết về mỗi đơn
//hàng. Nó sử dụng vòng lặp v-for để lặp qua mỗi đơn hàng trong orders và gán sự kiện click vào hàm getDetail.

//<Teleport to="body">: Đây là một thẻ Teleport trong Vue.js, cho phép di chuyển một thành phần đến một nơi khác trong DOM. Trong trường hợp này,
//nó đang di chuyển cửa sổ modal đến thẻ body của trang.

//<Modal width="800px" ref="detailModal">: Đây là một thẻ Modal, tạo ra một cửa sổ modal với chiều rộng 800px. ref="detailModal" cho phép tham 
//chiếu đến cửa sổ modal này trong các phương thức và thuộc tính khác của Vue.js.

//<template #header> và <template #body>: Đây là các slots trong Vue.js, cho phép chèn nội dung vào các phần cụ thể của một thành phần. Trong 
//trường hợp này, chúng đang được sử dụng để chèn tiêu đề và nội dung vào cửa sổ modal.

//<div class="order-item" v-for="orderItem in currentOrderDetail.list">: Đây là một thẻ chứa thông tin về mỗi mặt hàng trong đơn hàng. Nó sử
//dụng vòng lặp v-for để lặp qua mỗi mặt hàng trong currentOrderDetail.list.

//<div class="order-card footer">: Đây là một thẻ chứa thông tin về tổng tiền hàng và tổng đơn hàng. Nó hiển thị tổng tiền hàng và tổng đơn hàng
//(bao gồm phí vận chuyển) của đơn hàng hiện tại.

//<button style="background-color: var(--primary-color); color: #fff;" @click="$refs.processOrderModal.show()">Xử lý đơn hàng</button>: Đây là
//một nút cho phép người dùng mở cửa sổ modal để xử lý đơn hàng. Khi nút này được nhấn, hàm show() của processOrderModal sẽ được gọi.

//<button @click="$refs.detailModal.hide()">Thoát</button>: Đây là một nút cho phép người dùng đóng cửa sổ modal hiển thị chi tiết đơn hàng. 
//Khi nút này được nhấn, hàm hide() của detailModal sẽ được gọi.

//<Modal width="400px" ref="processOrderModal">: Đây là một cửa sổ modal cho phép người dùng xử lý đơn hàng. Nó chứa một danh sách các trạng thái
//đơn hàng mà người dùng có thể chọn để cập nhật trạng thái của đơn hàng.

//<InputTypeSelect :options="orderStatus" @changed="saveNewOrderStatus" style="min-width:100% !important;margin-left: auto;margin-right:auto; 
//box-shadow: 0 0 5px #888;">: Đây là một thẻ chọn cho phép người dùng chọn trạng thái mới cho đơn hàng. Khi trạng thái được thay đổi, 
//hàm saveNewOrderStatus sẽ được gọi.

//<button @click="processOrder" style="background-color: var(--primary-color); color:#fff">Xử lý</button>: Đây là một nút cho phép người dùng xử
//lý đơn hàng. Khi nút này được nhấn, hàm processOrder sẽ được gọi.
</script>
<template>
  <main class="container">
    
    <div class="is-ancestor">
      <div class="filters">
        <div class="suggest-wrapper" ref="suggestUser">
          
          <div id="suggests">
            <div class="suggest-item" v-for="(user, ind) in userSuggest" @click="getSuggest" :data-id="user._id">
              {{
                user.receiverName }}</div>
          </div>
        </div>
        
        <div class="filter-item" @click="orderStatusFilter" v-for="item in orderStatus"
          :data-query="JSON.stringify(item.query)">{{item.label }}</div>

      </div>
      <transition name="fade" mode="out-in">
        <div class="is-parent" v-if="orders.length > 0">
          <div class="card header">
            <div class="cell shrink">
              ID
            </div>
            <div class="cell shrink">
              Tên người đặt
            </div>
            <div class="cell shrink">
              <p>Trạng thái</p>
            </div>
            <div class="cell">
              <strong>Giá</strong>
            </div>
            <div class="cell shrink">
              Ngày cập nhật
            </div>
          </div>
          <div class="card" v-for="(item, index) in orders" @click="getDetail" :data-index="index">
            <div class="cell">
              <p>{{ item._id}}</p>
            </div>
            <div class="cell">
              <p>{{ item.receiverName}}</p>
            </div>
            <div class="cell shrink">
              <p>{{ OrderStatus[item.status].label }}</p>
            </div>
            <div class="cell shrink">
              <strong>{{ toPrice(item.subTotal + item.shippingFee) }}</strong>
            </div>
            <div class="cell shrink">
              <p>{{ item.createdAt }}</p>
            </div>
          </div>
        </div>
        <div style="background-color: #ededed; margin:4px; display: table-cell;box-sizing: border-box;border-radius: 4px;"
          v-else>
          <img :src="origin + '/noorders.png'" alt=""
            style=" margin-top:2rem;width: 200px; aspect-ratio: 4/3; margin-left: auto;margin-right: auto; display: block;"
            v-once>
          <h4 style="text-align: center;"></h4>
        </div>
      </transition>
    </div>
    <Teleport to="body">
      <Modal width="800px" ref="detailModal">
        <template #header>
          <h3>Chi tiết đơn hàng ({{ currentOrderDetail._id }})</h3>
        </template>
        <template #body>
          <div style="display: flex; align-items: stretch;">
            <div style="width: 400px; height: inherit; padding-inline: 1rem;">
              <div class="strip"></div>
              <div style="display: block; margin-block:1rem">
                <div style="display: flex;flex-wrap: wrap;  width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Tên người nhận: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.receiverName }}</span>
                </div>
                <div style="display: flex;flex-wrap: wrap;  width: 100%; justify-content: space-between;margin-block:8px">
                  <span>SĐT người nhận: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.receiverPhone }}</span>
                </div>
                <div
                  style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between; align-items: start;margin-block:8px">
                  <span>Địa chỉ người nhận: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.receiverAddress }}</span>
                </div>
                <div style="display: flex;flex-wrap: wrap;  width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Trạng thái đon hàng: </span>
                  <span style="color: red; text-align: right;">{{ currentOrderDetail.status }}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Thời gian đặt: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.createdAt }}</span>
                </div>
                <div style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between;margin-block:8px">
                  <span>Phương thức thanh toán: </span>
                  <span style="text-align: right;">{{ currentOrderDetail.paymentMethod }}</span>
                </div>
              </div>
            </div>
            <div style="width:calc(100% - 400px);">
              <div class="order-card body">
                <div class="order-items">
                  <div class="order-item" v-for="orderItem in currentOrderDetail.list">
                    <div>
                      <span>
                        {{ orderItem.productName }}
                      </span>
                      <span style="font-size: 0.9em; color: gray;">
                        x{{ orderItem.quantity }}
                      </span>
                    </div>
                    <div>
                      {{ toPrice(orderItem.orderPrice) }}
                    </div>
                  </div>

                </div>
              </div>
              <div class="order-card footer">
                <div style="text-align: right ; display: flex; align-items: end; min-height: 1.6em;">
                  <span>Tổng tiền hàng:</span>
                  <span style="margin-left:1rem; width: 9rem;">
                    {{ toPrice(currentOrderDetail.subTotal) }}
                  </span>
                </div>
                
                <div style="text-align: right ; display: flex; align-items: end; min-height: 1.6em;">
                  <span>Tổng đơn hàng:</span>
                  <span style="margin-left:1rem; font-size: 1.5em; color: red; font-weight: 550;width: 9rem;">
                    {{ toPrice(currentOrderDetail.subTotal + currentOrderDetail.shippingFee) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div style="display: flex; align-items: end; justify-content: flex-end;">
            <button style="background-color: var(--primary-color); color: #fff;"
              @click="$refs.processOrderModal.show()">Xử lý đơn hàng</button>
            <button @click="$refs.detailModal.hide()">Thoát</button>

          </div>
        </template>
      </Modal>
      <Modal width="400px" ref="processOrderModal">
        <template #header>
          <h3>Đơn hàng</h3>
        </template>
        <template #body>
          <InputTypeSelect :options="orderStatus" @changed="saveNewOrderStatus"
            style="min-width:100% !important;margin-left: auto;margin-right:auto; box-shadow: 0 0 5px #888;">
          </InputTypeSelect>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <button @click="processOrder" style="background-color: var(--primary-color); color:#fff">Xử lý</button>
            <button @click="$refs.processOrderModal.hide()">Thoát</button>
          </div>

        </template>
      </Modal>
    </Teleport>
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

.filters {
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 8px;
}

.filter-item {
  display: block;
  background-color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 25px;
  box-sizing: border-box;
  transition: all .2s ease;
  cursor: pointer;

  &:hover,
  &:focus,
  &:valid,
  &.active {
    background-color: var(--primary-color);
    color: #fff;
    outline: none;
  }
}

input.filter-item.suggest {
  padding: 8px 16px;
  width: 30ch !important;
  margin-bottom: 0 !important;
  box-sizing: border-box;
  user-select: all;

  &:invalid {
    background-color: rgb(198, 52, 52);
    color: #fff;
  }

  &::placeholder {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: lightgray;
  }
}

#suggests {
  width: 30ch;
  font-size: 1.1em;
  box-sizing: border-box;
  margin: 0 !important;

  position: absolute;
  z-index: 1000;
  background-color: beige;
  border-radius: 8px;
}

.suggest-item {
  margin: 4px;
  padding: 8px 16px !important;
  flex-direction: column;
  position: relative;
  border-radius: 4px;

  &:hover {
    background-color: var(--primary-color);
    color: #fff;
  }
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

  .card.header {
    text-align: center;
    font-size: 1.1em;
    font-weight: bold !important;
    background-color: rgb(0, 141, 96);
    color: white;
  }

  .card {
    width: inherit;
    flex-wrap: nowrap;
    display: table-row;
    overflow: hidden;
  }

  .cell {
    padding-inline: 16px;
    display: table-cell;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .card:hover .cell {
    background-color: rgb(189, 189, 189);
  }

  

  [data-name] {
    width: auto;
  }

  .cell.shrink {
    text-align: center;
    width: 1%;
    white-space: nowrap;
  }
}

.section {
  background-color: #ffffff99;
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

.order-card {
  padding: 8px
}

.order-card.header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid lightgray;
}

.order-items {
  display: block;

  &>*:nth-child(odd) {
    background: linear-gradient(to right, transparent, rgb(239, 243, 239), transparent)
  }

  &>*:nth-child(even) {
    background: linear-gradient(to right, transparent, rgb(255, 255, 255), transparent)
  }
}

.order-item {
  padding-block: 4px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #ffffff99;

  &>* {
    flex-grow: 1;
  }

  &>*:first-child {
    display: flex;
    flex-direction: column;
  }

  &>*:last-child {
    flex-grow: 0;
    white-space: nowrap;
  }
}

.order-card.footer {
  border-top: 1px solid lightgray;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

hr.vertical-divider {
  height: 1em;
  margin: 0px 8px;
  border: 1px solid lightgray;
  border-radius: 1px;
}

.strip {
  height: 3px !important;
  width: 100%;
  background-position-x: 0px;
  background-size: 116px 3px;
  background-image: repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all .5s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}
</style>