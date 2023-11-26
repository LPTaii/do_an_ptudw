<script>
import { reactive, toRefs } from 'vue';
const { min, max } = Math;
export default {
  name: "Pills",
  props: { //Đây là các thuộc tính mà component này nhận từ component cha. Có một prop được định nghĩa là “pills”.
    pills: Array
  },
  setup() { //Đây là một hàm setup trong Composition API của Vue.js. Nó khai báo một biến phản ứng state và một hàm onWheel để xử lý sự kiện cuộn chuột.
    const state = reactive({
      scroller: null,
      scrollLeft: 0,
    });

    const onWheel = (e) => { //const onWheel = (e) => {...}: Đây là một hàm được định nghĩa để xử lý sự kiện cuộn chuột. Hàm này nhận một đối số e, đại diện cho sự kiện cuộn chuột.
      state.scrollLeft = state.scroller //Đây là một phép gán có điều kiện. Nếu state.scroller tồn tại (khác null hoặc undefined),
      // thì state.scrollLeft sẽ được gán bằng giá trị mới được tính toán. Nếu không, state.scrollLeft sẽ giữ nguyên giá trị hiện tại.
        ? min( //Đây là phần tính toán giá trị mới cho state.scrollLeft. Nó sẽ lấy giá trị nhỏ nhất giữa “chiều rộng cuộn - chiều rộng đối tượng” và “max(0, deltaY + scrollLeft)”.
          state.scroller.scrollWidth - state.scroller.offsetWidth,
          max(0, e.deltaY + state.scrollLeft)
        )
        : state.scrollLeft;
    };
    return { ...toRefs(state), onWheel };// Đây là phần trả về của hàm setup. Nó trả về một đối tượng chứa tất cả các tham chiếu đến các thuộc tính của state và hàm onWheel.
  },
  methods: { //Đây là nơi khai báo các phương thức của component. Có một phương thức là “clickPill” để xử lý sự kiện nhấp vào một viên thuốc.
    clickPill(e) {
      this.$emit('clickPill', e.target.innerText);
    }
  }
}
//<div class="pills" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel">: Đây là thẻ chứa chính cho tất cả các phần tử khác.
//Nó có class “pills” để áp dụng các quy tắc CSS. Nó cũng có một tham chiếu ref tới “scroller”, và một sự kiện wheel để xử lý cuộn chuột.
//<slot>: Đây là một “slot”, nơi mà nội dung từ component cha sẽ được chèn vào. Nếu component cha không cung cấp nội dung cho slot, slot sẽ trống.
//<div class="pill" v-for="pill in pills" @click="clickPill">: Đây là một danh sách các viên thuốc được tạo ra bằng vòng lặp v-for.
//Mỗi viên thuốc có một sự kiện click để xử lý việc nhấp vào viên thuốc.
//{{ pill }}: Đây là nơi hiển thị tên của viên thuốc.
</script>
<template>
  <div class="pills" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel">
    <slot>
      <div class="pill" v-for="pill in pills" @click="clickPill">
        {{ pill }}
      </div>
    </slot>
  </div>
</template>
<style scoped>
.pills {
  width: auto;
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;

  overflow-X: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
}

.pills::-webkit-scrollbar {
  height: 0;
}

.pill {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000;
  background-color: white;
  transition: background-color .3s ease-out;
}

.pill:hover {
  background-color: rgb(0, 141, 96) !important;
  color: white;
}
</style>