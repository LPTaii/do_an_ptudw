<script>
export default {
  props: { // Định nghĩa các thuộc tính mà component này nhận từ component cha. 
//Trong trường hợp này, nó chỉ nhận một thuộc tính là width với kiểu String và giá trị mặc định là "300px".
    width: {
      type: String,
      default: "300px",
    }
  },
  data() { //Định nghĩa trạng thái ban đầu của component. Trong trường hợp này, nó có một trạng thái là showState (được đặt thành false).
    return {
      showState: false,
    }
  },
  methods: {// Định nghĩa các phương thức mà component này sử dụng.
//Có nhiều phương thức được định nghĩa ở đây, bao gồm refresh, show, hide, và toggle.
    refresh() { //Phương thức này sẽ buộc component cập nhật lại, bất chấp việc không có sự thay đổi nào trong dữ liệu. 
//Điều này có thể hữu ích khi bạn muốn cập nhật lại giao diện mà không cần thay đổi dữ liệu.
      this.$forceUpdate
    },
    show() { //Phương thức này sẽ đặt trạng thái showState thành true,
//có thể được sử dụng để hiển thị một phần tử nào đó trong giao diện (ví dụ: một modal hoặc một thông báo).
      this.showState = true;
    },
    hide() { //Phương thức này sẽ đặt trạng thái showState thành false, có thể được sử dụng để ẩn một phần tử nào đó trong giao diện.
      this.showState = false;
    },
    toggle() {//Phương thức này sẽ đảo ngược trạng thái showState (nếu nó đang là true thì sẽ chuyển thành false, 
//và ngược lại). Điều này hữu ích khi bạn muốn chuyển đổi trạng thái hiển thị của một phần tử nào đó trong giao diện.
      this.showState = !this.showState;
    }
  },
  watch: { //Theo dõi sự thay đổi của các thuộc tính hoặc trạng thái và thực hiện hành động khi chúng thay đổi. 
//Trong trường hợp này, nó theo dõi sự thay đổi của thuộc tính show và cập nhật showState khi nó thay đổi.
    show(foo) {
      this.showState = foo;
    }
  }
}
//Transition name="modal": Đây là một component Vue.js cung cấp các hiệu ứng chuyển đổi cho các phần tử hoặc component khi chúng xuất hiện, biến mất, hoặc thay đổi trạng thái.

//v-if="showState": Điều kiện này kiểm tra xem trạng thái showState có đúng hay không. Nếu đúng, nó sẽ hiển thị modal.

//@click.self="$emit('close')": Khi người dùng nhấp vào vùng che phủ modal (nhưng không phải chính modal), nó sẽ phát ra một sự kiện ‘close’.

//:style="{ width }": Đây là một binding style, nó sẽ đặt chiều rộng của modal tương ứng với giá trị của thuộc tính width.

//slot name="header", slot name="body", slot name="footer": Đây là các slot, cho phép bạn chèn nội dung tùy chỉnh vào các phần khác nhau của modal từ component cha.

//button class="modal-default-button" @click="hide": Đây là một nút, khi nhấp vào, nó sẽ gọi phương thức hide để ẩn modal.

</script>

<template>
  <Transition name="modal">
    <div v-if="showState" class="modal-mask" @click.self="$emit('close')">
      <div :style="{ width }" class="modal-container">
        <div class="modal-header">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="modal-default-button" @click="hide">OK</button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;
}

.modal-container {
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header {
  border-bottom: 2px solid #ddd;

}

.modal-header h3 {
  margin-top: 0;
  color: var(--primary-color);
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}


.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container {
  /* -webkit-transform: scale(1.1);
  transform: scale(1.1); */
  -webkit-transform: translateY(-10px);
  transform: translateY(-10px);
}

.modal-leave-to .modal-container {
  -webkit-transform: translateY(10px);
  transform: translateY(10px);
}
</style>