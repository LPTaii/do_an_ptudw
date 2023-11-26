<script>
import { h, render, reactive, toRefs } from "vue";//Đây là cách import các hàm h, render, reactive, và toRefs từ thư viện Vue.js.
const { min, max } = Math;
export default {// Đây là cách khai báo một component Vue.js. Component này có tên là “PreviewImages” và nhận các props là id và images.
  name: "PreviewImages",
  props: {
    id: String,
    images: Array
  },
  setup() {//Đây là hàm setup trong Composition API của Vue.js. Hàm này được gọi khi component được khởi tạo, trước khi component được gắn vào DOM.
    const state = reactive({
      scroller: null,
      scrollLeft: 0,
    });//Đây là cách khai báo một đối tượng phản ứng trong Vue.js. Đối tượng này sẽ chứa các thuộc tính scroller và scrollLeft.

    const onWheel = (e) => {//Đây là một hàm sẽ được gọi khi có sự kiện scroll. Hàm này sẽ cập nhật giá trị của scrollLeft dựa trên sự kiện. 
//Nếu scroller có giá trị, scrollLeft sẽ được cập nhật để không vượt quá chiều rộng cuộn của scroller và không nhỏ hơn 0. Nếu không, 
//scrollLeft sẽ giữ nguyên giá trị.
      state.scrollLeft = state.scroller
        ? min(
          state.scroller.scrollWidth - state.scroller.offsetWidth,
          max(0, e.deltaY + state.scrollLeft)
        )
        : state.scrollLeft;
    };
    return { ...toRefs(state), onWheel };//Đây là cách trả về các biến từ hàm setup để sử dụng trong template hoặc các hàm khác của component. 
//toRefs được sử dụng để chuyển đổi mỗi thuộc tính của đối tượng phản ứng state thành một ref riêng biệt. Điều này cho phép chúng ta làm việc
//với các thuộc tính của state như các ref thông thường trong template.
  },
  watch: {//Đây là nơi khai báo các watcher. Watcher images sẽ gọi hàm fetchImages mỗi khi images thay đổi.

    images: {// Đây là thuộc tính mà chúng ta muốn theo dõi sự thay đổi. Mỗi khi images thay đổi, hàm handler sẽ được gọi.
      intermediate: true,//Tùy chọn này cho phép chúng ta thực hiện hàm handler ngay lập tức khi component được khởi tạo, thay vì chờ đợi cho
//đến khi images thay đổi lần đầu tiên.
      deep: true,//Tùy chọn này cho phép chúng ta theo dõi sự thay đổi sâu trong images nếu nó là một đối tượng hoặc mảng.
      handler: function (oldImages, newImages) {
        this.fetchImages(newImages);
      }//Đây là hàm sẽ được gọi mỗi khi images thay đổi. Hàm này nhận hai tham số: oldImages là giá trị cũ của images, và newImages là giá trị
//mới. Trong hàm này, chúng ta gọi phương thức fetchImages với newImages làm tham số. Phương thức fetchImages sẽ tạo ra các thẻ img cho mỗi hình
//ảnh trong mảng newImages và thêm chúng vào phần tử có id tương ứng với prop id.
    }
  },
  methods: {//Đây là nơi khai báo các phương thức sẽ được sử dụng trong component. Trong trường hợp này, các phương thức được khai báo là
//deleteImage, fetchImages, và deleteImage.
    deleteImage($event) {//Phương thức này sẽ lấy index của hình ảnh từ thuộc tính data-index của phần tử được click. Tuy nhiên, phương thức này
//hiện đang trống và không thực hiện hành động nào với index.
      const index = $event.target.getAttribute("data-index");
    },
    fetchImages(images) {//Phương thức này sẽ tạo ra các thẻ img cho mỗi hình ảnh trong mảng images và thêm chúng vào phần tử có id tương ứng với
//prop id. Mỗi thẻ img sẽ có một nút xóa và một sự kiện click được gán cho nút này để gọi phương thức deleteImage. Tuy nhiên, do this trong hàm
//callback của forEach không trỏ đến component, phương thức deleteImage sẽ không được gọi đúng cách khi nút xóa được click. Để khắc phục vấn đề 
//này, bạn có thể sử dụng một arrow function thay vì một function bình thường để đảm bảo rằng this trong hàm callback trỏ đến component.
      let imagesPreview = document.getElementById(this.$props.id);
      imagesPreview.innerHTML = "";
      images.forEach(function (img, index) {
        const div = document.createElement('div');
        div.className = 'img-item';
        const props = {
          class: 'imageItem',
          'data-index': index,
        }
        const children = [
          h('button', {
            class: 'deleteImageButton',
            type: 'button',
            'data-index': index,
            onClick: this.deleteImage
          }, {}, "X"),
          h('img', {
            class: 'imagePreview',
            'data-index': index,
            src: img,
            alt: img
          })
        ];
        const imgItem = h('div', props, children);
        imagesPreview.appendChild(div)
        render(imgItem, div)
      }, this);
    },
    deleteImage($event) {//Phương thức này sẽ phát sự kiện 'deleteImage' với index của hình ảnh được xóa. Index này được lấy từ thuộc tính
//data-index của phần tử được click.
      this.$emit("deleteImage", $event.target.getAttribute('data-index'))
    }

  }
}
//<div class="imagesPreview" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel" :id="id"></div>:
//Đây là một thẻ div với class là imagesPreview, id được bind từ prop id, và một ref tên là scroller. Thuộc tính scrollLeft của thẻ này được
//bind với biến scrollLeft trong component. Khi có sự kiện scroll, hàm onWheel sẽ được gọi và sự kiện mặc định sẽ bị ngăn chặn (điều này ngăn 
//chặn việc cuộn trang khi cuộn div). Thẻ div này sẽ chứa các hình ảnh xem trước.
</script>

<template>
  <div class="imagesPreview" ref="scroller" :scroll-left.camel="scrollLeft" @wheel.prevent="onWheel" :id="id"></div>
</template>
<style>
.imagesPreview {
  padding-top: 8px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  max-height: 100px;
  width: 100%;
  overflow: hidden;
}

.imageItem {
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  font-weight: bolder;
  box-sizing: border-box;
  margin-right: 8px;
  background-color: antiquewhite;
}

.deleteImageButton {
  padding: 0;
  position: relative;
  width: 24px;
  height: 24px;
  right: -76px;
  background-color: rgb(255, 0, 0);
  color: rgb(255, 255, 255);
  z-index: 10;
  border-top-right-radius: 8px;
  border: none;
  box-shadow: none;
}

.deleteImageButton:hover {
  transform: none;
  background-color: rgb(255, 0, 0);
  box-shadow: none;
}

img.imagePreview {
  display: block;
  border-radius: 8px;
  width: 100px;
  height: 100px;
  z-index: -1;
  transform: translateY(-24px);
}
</style>