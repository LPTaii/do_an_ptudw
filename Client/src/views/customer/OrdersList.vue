<script>
import Modal from '@/components/Modal.vue';
import { OrderStatus } from '@/config/index.config';
import { ref } from 'vue';

export default {
  name: "OrderListCustomer",
  components: { //Định nghĩa các component con được sử dụng trong component này. Trong trường hợp này, nó sử dụng một component con là Modal.
    Modal
  },
  data() { //Định nghĩa trạng thái ban đầu của component. 
//Trong trường hợp này, nó có nhiều trạng thái như origin, listQueries, currentOrdersList, currentOrderDetail, và showModal.

    return {
      origin: location.origin,
      listQueries: [],
      currentOrdersList: [],
      currentOrderDetail: {},
      showModal: false
    }
  },
  methods: { //Định nghĩa các phương thức mà component này sử dụng. 
//Có nhiều phương thức được định nghĩa ở đây, bao gồm getTab, getDetail, toLabelStatus, toPrice, và requestCancelOrder.
    async getTab(e) { //Phương thức này nhận vào một đối tượng sự kiện hoặc một chuỗi, xác định tab hiện tại dựa trên loại đầu vào, 
//sau đó lấy danh sách đơn hàng tương ứng với tab đó từ Vuex store. Nếu có lỗi xảy ra trong quá trình lấy dữ liệu, 
//nó sẽ phát ra một thông báo lỗi.
      let tabName = ""
      switch (typeof (e)) {
        case 'object':
          const siblings = e.target.parentNode.querySelectorAll(e.target.localName)// Nếu e là một đối tượng (tức là một sự kiện), 
//nó sẽ xóa class ‘active’ khỏi tất cả các phần tử anh em của phần tử mục tiêu, thêm class ‘active’ vào phần tử mục tiêu,
//và lấy giá trị của thuộc tính ‘data-tab’ của phần tử mục tiêu.
//Nếu e là một chuỗi, nó sẽ chuyển chuỗi thành chữ thường.

          siblings.forEach(element => {
            element.classList.remove('active');
          });
          e.target.classList.add('active');
          tabName = (e.target.getAttribute('data-tab'));
          break;

        case 'string':
          tabName = (e).toLowerCase();
          break;
      }
      const desiredTab = this.listQueries.find(item => (item.name == tabName));// Sau khi xác định tabName, nó tìm tab mong muốn trong listQueries dựa trên name.
//Sau đó, nó gửi một yêu cầu đến Vuex store để lấy danh sách đơn hàng tương ứng với truy vấn của tab mong muốn.
      await this.$store.dispatch('order/getorderlist', desiredTab.query)
        .then((res) => {
          this.currentOrdersList = (res.data);//Nếu yêu cầu thành công, nó sẽ cập nhật currentOrdersList với dữ liệu trả về. 
//Nếu có lỗi xảy ra trong quá trình lấy dữ liệu, nó sẽ phát ra một thông báo lỗi.
        })
        .catch(err => {
          this.$emit('notification', {
            message: err.message,
            type: 'error'
          })
        })

    },
    getDetail(e) { //Phương thức này nhận vào một đối tượng sự kiện, 
//lấy chi tiết đơn hàng tương ứng với chỉ số được chỉ định trong đối tượng sự kiện, sau đó hiển thị modal chi tiết đơn hàng.
      this.currentOrderDetail = (this.currentOrdersList[e.currentTarget.getAttribute('data-index')]);
      this.$refs.detailModal.show()
    },
    toLabelStatus(str) { //Phương thức này nhận vào một chuỗi, tìm kiếm trạng thái đơn hàng tương ứng trong listQueries, 
//và trả về trạng thái đơn hàng.
      return this.listQueries.find(el => (el.query.status === str)).status
    },
    toPrice(value = "") { //Phương thức này nhận vào một giá trị (mặc định là chuỗi rỗng), 
//chuyển đổi giá trị đó thành định dạng tiền tệ Việt Nam (VND).
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    },
    requestCancelOrder() { // Phương thức này được gọi khi người dùng muốn hủy một đơn hàng. Nó sẽ ẩn modal chi tiết đơn hàng 
//và modal xác nhận hủy, sau đó gửi một yêu cầu đến Vuex store để hủy đơn hàng. Nếu yêu cầu thành công, nó sẽ phát ra một thông báo thành công.
//Nếu có lỗi xảy ra, nó sẽ phát ra một thông báo lỗi.
      this.$refs.detailModal.hide();//Khi người dùng nhấp vào nút này, nó sẽ hiển thị modal xác nhận hủy.
      this.$refs.confirmCancel.hide();//Khi người dùng nhấp vào nút này, nó sẽ ẩn modal chi tiết đơn hàng.
      console.log("about to cancel order:" + this.currentOrderDetail._id);
      this.$store.dispatch('order/cancelOrder', {//Gửi một yêu cầu đến Vuex store để hủy đơn hàng
        orderId: this.currentOrderDetail._id
      }).then(res => {
        this.$emit('notification', { //Nếu yêu cầu thành công (promise được giải quyết), nó sẽ phát ra một thông báo thành công
          message: res.message,
          type: "success"
        })
      })
        .catch(res => {
          this.$emit('notification', { //Nếu có lỗi xảy ra (promise bị từ chối), nó sẽ phát ra một thông báo lỗi
            message: res.message,
            type: 'error'
          })
        })
    },
  },
  created() { //Một hook vòng đời của Vue.js, được gọi ngay sau khi một instance Vue được tạo. 
//Trong trường hợp này, nó khởi tạo listQueries với các trạng thái đơn hàng từ OrderStatus.
    this.listQueries = ref([]);
    Object.keys(OrderStatus).forEach((os, index) => {
      this.listQueries.push(OrderStatus[os])
    });
  }
}
//div class="menu": Đây là thẻ div chính chứa toàn bộ nội dung của component.

//v-for="item in listQueries": Đây là một vòng lặp Vue.js, tạo ra một nút cho mỗi mục trong listQueries. 
//Khi nút này được nhấp, nó sẽ gọi phương thức getTab.

//v-for="(item, index) in currentOrdersList": Đây là một vòng lặp Vue.js khác, tạo ra một thẻ div cho mỗi mục trong currentOrdersList. 
//Mỗi div này chứa thông tin về một đơn hàng.

//@click="getDetail": Khi người dùng nhấp vào nút này, hàm getDetail sẽ được gọi.

//v-if="currentOrdersList.length <= 0": Điều kiện này kiểm tra xem currentOrdersList có phần tử nào không.
//Nếu không, nó sẽ hiển thị hình ảnh và tiêu đề cho người dùng biết rằng không có đơn hàng nào.

//Teleport to="body": Teleport là một tính năng của Vue.js cho phép bạn di chuyển một phần nội dung HTML tới một nơi khác trên trang.

//Modal width="800px" ref="detailModal": Đây là một component con được sử dụng trong template này. Nó có các slot tùy chỉnh cho header, 
//body và footer.

//v-for="orderItem in currentOrderDetail.list": Đây là một vòng lặp Vue.js, tạo ra một hàng trong bảng cho mỗi mục trong currentOrderDetail.list.

//@click="$refs.confirmC: Khi người dùng nhấp vào nút này, nó sẽ gọi một phương thức hoặc thực hiện một hành động nào đó được định nghĩa trong
//component (phần mã này bị cắt nên tôi không thể xác định chính xác nó sẽ làm gì).

//template #footer: Đây là một slot tùy chỉnh cho phần footer của component Modal. Nó chứa hai nút: một để hiển thị modal xác nhận hủy
//và một để ẩn modal chi tiết đơn hàng.

//button @click="$refs.confirmCancel.show()": Khi người dùng nhấp vào nút này, nó sẽ hiển thị modal xác nhận hủy.

//button @click="$refs.detailModal.hide()": Khi người dùng nhấp vào nút này, nó sẽ ẩn modal chi tiết đơn hàng.

//Modal ref="confirmCancel": Đây là một component con được sử dụng trong template này. Nó có các slot tùy chỉnh cho body và footer.

//button @click="requestCancelOrder": Khi người dùng nhấp vào nút này, nó sẽ gọi phương thức requestCancelOrder để hủy đơn hàng.

//button @click="$refs.confirmCancel.hide()": Khi người dùng nhấp vào nút này, nó sẽ ẩn modal xác nhận hủy.
</script>

<template>
  <main>
    <div class="menu">
      <div class="section header" v-once>
        <div class="form-group">
          <h2 style="display: block; width: 100%; padding: 8px;">{{ $route.meta.title }}</h2>
        </div>
      </div>
      <div class="section tabs-wrapper" v-once>
        <div class="form-group tabs">
          <button v-for="item in listQueries" @click="getTab" class="tab" :data-tab="item.name">{{ item.label }}</button>
        </div>
      </div>
      <div class="section" v-for="(item, index) in currentOrdersList">
        <div class="order-card header">
          <span> {{ toLabelStatus(item.status) }}</span>
          <hr class="vertical-divider">
          <span style="color: red;">{{ item.status }}</span>
        </div>
        <div class="order-card body">
          <div class="order-items">
            <div class="order-item">
              <div>
                <span>
                  {{ item.list[0].productName }}
                </span>
                <span style="font-size: 0.9em; color: gray;">
                  x{{ item.list[0].quantity }}
                </span>
              </div>
              <div>
                {{ toPrice(item.list[0].orderPrice) }}
              </div>
            </div>
            <div class="order-item" v-if="item.list.length > 1">
              <div>
                <i style="color: gray;">
                  + {{ item.list.length - 1 }}
                </i>
              </div>
              <div>
              </div>
            </div>
          </div>
        </div>
        <div class="order-card footer">
          <div style="text-align: right ;">
            <span>Tổng:</span>
            <span style="margin-left:1rem; font-size: 1.5em; color: red; font-weight: 550;">
              {{ toPrice(item.subTotal + item.shippingFee) }}
            </span>
          </div>
          <div style="margin-block: 1rem;">
            <button style="min-width: 10rem;" @click="getDetail" :data-index="index">Xem chi tiết đơn hàng</button>
          </div>
        </div>
      </div>
      <div class="section" v-if="currentOrdersList.length <= 0">
        <img :src="origin + '/noorders.png'" alt=""
          style=" margin-top:2rem;width: 200px; aspect-ratio: 4/3; margin-left: auto;margin-right: auto; display: block;"
          v-once>
        <h4 style="text-align: center;"></h4>
      </div>
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
                  <span>Trạng thái đơn hàng: </span>
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
                  <span>Tiền hàng:</span>
                  <span style="margin-left:1rem; width: 9rem;">
                    {{ toPrice(currentOrderDetail.subTotal) }}
                  </span>
                </div>
                <div style="text-align: right ; display: flex; align-items: end; min-height: 1.6em;">
                  <span>Tổng tiền:</span>
                  <span style="margin-left:1rem; font-size: 1.5em; color: red; font-weight: 550;width: 9rem;">
                    {{ toPrice(currentOrderDetail.subTotal + currentOrderDetail.shippingFee) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <button @click="$refs.confirmCancel.show()" style="background-color: red; color: white">Hủy Đơn</button>
            <button @click="$refs.detailModal.hide()">Thoát</button>
          </div>
        </template>

      </Modal>
      <Modal ref="confirmCancel">
        <template #body>
          Bạn có chắc chắn muốn Hủy?
        </template>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <button @click="requestCancelOrder" >OK</button>
            <button @click="$refs.confirmCancel.hide()">Thoát</button>
          </div>
        </template>
      </Modal>
    </Teleport>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.menu {
  width: 100%;
  border-radius: 8px;
  background-color: #ffffffaa;
  padding: 8px;
  box-sizing: border-box;
}
main>* {
  padding: 8px;
}

.tabs {
  display: flex;
  justify-content: center;
  padding: 0 !important;
  padding-top: 8px !important;
  flex-direction: row;
  flex-wrap: nowrap !important;
  overflow-x: auto;
  overflow-y: hidden;
  background: linear-gradient(to bottom, transparent, transparent, var(--primary-color));
}

button.tab {
  flex: 1 0 auto;
  width: auto !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  margin: 0;
  text-wrap: nowrap;
  transition: all .3s ease-out;
  box-sizing: border-box;
  border: none;
  box-shadow: inset 0 5px 5px #ddd;
}

button.tab:hover,
button.tab:focus {
  box-shadow: inset 0 0 0 white !important;
  transform: scale(1);
  text-shadow: 0 0 3px #888
}

button.tab.active {
  z-index: 10;
  box-shadow: inset 0 0 0 white !important;
  background-color: var(--primary-color);
  color: #fff;
}

button.tab.active+button {
  border-bottom-left-radius: 4px !important;
}

button.tab:has(+ button.tab.active) {
  border-bottom-right-radius: 4px !important;
}

.section {
  background-color: #ffffff;
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
</style>
