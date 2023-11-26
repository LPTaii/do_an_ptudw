<script>
import { reactive, toRefs } from 'vue';
const { min, max } = Math;
//định nghĩa cho một component Vue.js có tên là “Gallery”.
export default {
  name: "Gallery", // Tên của component, trong trường hợp này là “Gallery”.
  props: { //Đây là các thuộc tính mà component này nhận từ component cha. Có một prop được định nghĩa là “images”.
    images: {
      type: Array,
      required: true
    },

  },
  setup() { //Đây là một hàm setup trong Composition API của Vue.js. Nó khai báo một biến phản ứng state và một hàm onWheel để xử lý sự kiện cuộn chuột.
    const state = reactive({
      scroller: null,
      scrollLeft: 0,
    });

    const onWheel = (e) => {
      state.scrollLeft = state.scroller
        ? min(
          state.scroller.scrollWidth - state.scroller.offsetWidth,
          max(0, e.deltaY + state.scrollLeft)
        )
        : state.scrollLeft;
    };
    return { ...toRefs(state), onWheel };
  },
  data() { // Đây là nơi khai báo dữ liệu nội bộ của component. Có ba biến dữ liệu là “monitor”, “currentImageIndex”, và “origin”.
    const origin = location.origin;
    const currentImageIndex = -1;
    
    return {
      monitor: this.$props.images.length > 0 ? this.$props.images[currentImageIndex].publicPath : (origin + "noimage.png"),
      currentImageIndex,
      origin

    }
  },
  methods: { // Đây là nơi khai báo các phương thức của component. Có hai phương thức là “show” và “showAlternative”.
    show(index) {
      this.currentImageIndex = index;
      if (this.validArray) {
        this.monitor = this.$props.images[index].publicPath;
      } else { this.showAlternative(); }
    },
    showAlternative() {
      this.monitor = this.origin + "/noimage.png"
    }
  },
  computed: { //Đây là nơi khai báo các thuộc tính được tính toán. Có một thuộc tính được tính toán là “validArray”.
    validArray() {
      return this.images.length > 0;
    }
  },
  watch: { //Đây là nơi khai báo các watcher, những hàm sẽ được gọi khi một biến dữ liệu thay đổi. Trong trường hợp này, có một watcher cho “images”.
    images(newV, oldV) {
      this.show(0)
    }
  }
}
//<div class="gallery">: Đây là thẻ chứa chính cho tất cả các phần tử khác. Nó có class “gallery” để áp dụng các quy tắc CSS.
//<div class="monitor">: Đây là thẻ chứa cho hình ảnh hiện tại đang được hiển thị. Nó có class “monitor” để áp dụng các quy tắc CSS
//<img :src="monitor" alt="">: Đây là hình ảnh hiện tại đang được hiển thị. Thuộc tính src của nó được ràng buộc với biến monitor.
//<div class="gallery-shelf" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel">: Đây là thẻ chứa cho danh sách hình ảnh.
//Nó có class “gallery-shelf” để áp dụng các quy tắc CSS. Nó cũng có một tham chiếu ref tới “scroller”, và một sự kiện wheel để xử lý cuộn chuột.
//<img v-for="(image, index) in images" :key="index" :src="image.publicPath" @click="show(index)" alt="">: Đây là một danh sách hình ảnh được tạo ra bằng vòng lặp v-for.
//Mỗi hình ảnh có một thuộc tính src được ràng buộc với image.publicPath, và một sự kiện click để hiển thị hình ảnh đó.
</script>
<template>
  <div class="gallery">
    <div class="monitor">
      <img :src="monitor" alt="">
    </div>
    <div class="gallery-shelf" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel">
      <img v-for="(image, index) in images" :key="index" :src="image.publicPath" @click="show(index)" alt="">
    </div>
  </div>
</template>
<style scoped>
.gallery {
  width: inherit;
  display: block;
}

.monitor {
  width: 100%;

  & img {
    width: 100%;
  }
}

.gallery-shelf {
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  overflow-x: scroll;

  & img {
    display: block;
    height: 5rem;
    aspect-ratio: 1;
  }

  &::-webkit-scrollbar {
    height: 0;
  }
}
</style>