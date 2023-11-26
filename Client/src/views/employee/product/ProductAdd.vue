<script>
import * as yup from "yup";
import { ref } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";

import UploadImage from "@/components/UploadImage.vue";
import PreviewImages from "@/components/PreviewImages.vue";
import InputTypeFile from "@/components/InputTypeFile.vue";

import { QuillEditor } from '@vueup/vue-quill';
import QuillHTMLEditButton from 'quill-html-edit-button';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';
library.add(faCloudArrowUp);


export default {
  components: {//Đây là nơi khai báo các component con sẽ được sử dụng trong component này. Trong trường hợp này, các component con bao gồm 
//Form, Field, QuillEditor, UploadImage, ErrorMessage, InputTypeFile, UploadImage, và PreviewImages.
    Form,
    Field,
    QuillEditor,
    UploadImage,
    ErrorMessage,
    InputTypeFile,
    UploadImage,
    PreviewImages
  },
  data() {//Đây là nơi khai báo các biến sẽ được sử dụng trong component. Trong trường hợp này, các biến được khai báo là title, imagesArr, 
//thumbnailUrl, thumbnailPreviewSrc, isThumbnailFileSelected, isEditorSaved, isProcessing, và description.
    return {
      title: document.title,
      imagesArr: [],
      thumbnailUrl: "",
      thumbnailPreviewSrc: "",
      isThumbnailFileSelected: false,
      isEditorSaved: true,
      isProcessing: ref(false),
      description: "",
    };
  },
  setup() {//Đây là hàm setup trong Composition API của Vue.js. Hàm này được gọi khi component được khởi tạo, trước khi component được gắn vào
//DOM. Trong trường hợp này, hàm setup trả về một đối tượng chứa modules, một đối tượng cấu hình cho QuillEditor.
    const modules = {
      name: 'htmlEditButton',
      module: QuillHTMLEditButton,
      options: {
        debug: true
      },
    };

    return { modules };
  },
  methods: {
    async onEditorChangeHandler() {//Phương thức này sẽ được gọi khi có sự thay đổi trong editor. Nó sẽ cập nhật giá trị của description sau mỗi lần thay đổi.
      const desInp = document.getElementById('description');
      this.isEditorSaved = false;
      var id = window.setTimeout(function () { }, 0);

      while (id--) {
        window.clearTimeout(id);
      }

      setTimeout(() => {
        desInp.value = this.$refs.quillEditor.getHTML();
        desInp.dispatchEvent(new Event('change'));
        this.isEditorSaved = true;
      }, 500);
    },
    async submitHandler(product) {//Phương thức này sẽ được gọi khi form được submit. Nó sẽ gửi dữ liệu sản phẩm lên server.
      this.isProcessing = true;

      await this.$store.dispatch("product/add", product)
        .then((res) => {
          this.isProcessing = false;
          this.$emit('notification', { message: res.message, type: "success" });
        })
        .catch((error) => {
          this.isProcessing = false;
          this.message =
            (error.response &&
              error.response?.data &&
              error.response?.data.message) ||
            error.message ||
            error.toString();
          this.$emit('notification', { message: error.response?.data.message || error.message, type: "error" });
        }
        );
      this.isProcessing = false;
    },
    openImageUploadModal() {//Phương thức này sẽ mở modal để tải lên hình ảnh.
      this.$refs.uploadImageModal.show();
    },
    addNewImage(newImgData) {//Phương thức này sẽ thêm hình ảnh mới vào mảng imagesArr.
      let tArr = this.imagesArr;
      tArr.push(newImgData)
      this.imagesArr = tArr;
      this.$refs.uploadImageModal.hide();
    },
    deleteImage(index) {//Phương thức này sẽ xóa hình ảnh khỏi mảng imagesArr dựa trên index.
      let tArr = this.imagesArr;
      tArr.splice(index, 1);
      this.imagesArr = tArr;
    }
  },
  computed: {//Đây là nơi khai báo các thuộc tính được tính toán. Các thuộc tính này sẽ được tính lại mỗi khi có sự thay đổi trong các phụ thuộc của chúng.
    currentUser() {// Thuộc tính này trả về người dùng hiện tại từ Vuex store.
      return this.$store.state.userE.user;
    },
    schema() {//Thuộc tính này trả về một schema Yup để xác thực dữ liệu form.
      return yup.object().shape({
        name: yup
          .string()
          .required('Vui lòng nhập tên sản phẩm'),
        images: yup
          .string(),
        price: yup
          .number()
          .required('Vui lòng nhập giá')
          .min(0, 'Không hợp lệ, vui lòng nhập lại'),
        quantity: yup
          .number()
          .required('Vui lòng nhập số lưọng')
          .min(0, 'Không hợp lệ, vui lòng nhập lại'),
        description: yup
          .string(),
        note: yup
          .string(),
      });
    },
    isFormSubmittable() {//Thuộc tính này kiểm tra xem form có thể submit được hay không dựa trên isProcessing và isEditorSaved.
      return (!this.isProcessing && this.isEditorSaved);
    }
  },
  watch: {//Đây là nơi khai báo các watcher. Các watcher này sẽ được gọi mỗi khi có sự thay đổi trong các phụ thuộc của chúng.
    imagesArr: {//Watcher này sẽ cập nhật giá trị của input images mỗi khi imagesArr thay đổi. Giá trị mới của images sẽ là chuỗi JSON của 
//imagesArr. Sau khi cập nhật giá trị, một sự kiện change sẽ được phát ra từ input images.
      intermediate: true,
      deep: true,
      handler: function (newImages, oldImages) {
        const imagesInput = document.getElementById('images');
        imagesInput.value = JSON.stringify(newImages);
        imagesInput.dispatchEvent(new Event('change'));
      }
    }
  }
};
//<main>: Đây là thẻ chính chứa toàn bộ nội dung của component.

//<Form ref="form" @submit="submitHandler" :validation-schema="schema" class="section-wrapper" 
//v-show="currentUser">: Đây là một component Form với sự kiện submit được xử lý bởi phương thức submitHandler 
//và schema xác thực được định nghĩa bởi thuộc tính tính toán schema. Component này chỉ hiển thị nếu currentUser
//có giá trị.

//<Field type="text" ref="name" id="name" placeholder name="name" />: Đây là một component Field dùng để nhập tên
//sản phẩm.

//<ErrorMessage name="name" />: Đây là một component ErrorMessage dùng để hiển thị lỗi xác thực cho trường tên 
//sản phẩm.

//<QuillEditor ref="quillEditor" id="quillEditor" theme="snow" toolbar="full" :modules="modules" 
//v-model:content="description" @textChange="onEditorChangeHandler" />: Đây là một component QuillEditor dùng để
//nhập mô tả sản phẩm. Mỗi khi nội dung thay đổi, phương thức onEditorChangeHandler sẽ được gọi.

//<button type="button" class="button block" @click="openImageUploadModal">Thêm ảnh</button>: Đây là một nút dùng
//để mở modal tải lên hình ảnh. Khi người dùng click vào nút này, phương thức openImageUploadModal sẽ được gọi.

//<PreviewImages id="previewImages" :images="imagesArr" @deleteImage="deleteImage" />: Đây là một component 
//PreviewImages dùng để hiển thị các hình ảnh đã tải lên. Khi người dùng xóa một hình ảnh, phương thức 
//deleteImage sẽ được gọi.

//<button :disabled="!isFormSubmittable" class="button block">: Đây là một nút với class là button block. 
//Nút này sẽ bị vô hiệu hóa nếu isFormSubmittable là false. Khi người dùng click vào nút này, form sẽ được 
//submit.

//<UploadImage title="" ref="uploadImageModal" @submitCroppedImage="addNewImage" :aspectRatio="1" 
//id="uploadImageModal" />: Đây là một component UploadImage dùng để tải lên hình ảnh. Khi người dùng tải lên
//một hình ảnh, phương thức addNewImage sẽ được gọi.
</script>

<template>
  <main>
    <div class="wrapper">
      <Form ref="form" @submit="submitHandler" :validation-schema="schema" class="section-wrapper" v-show="currentUser">
        <div class="group-wrapper upload">
          
          <div class="cell-wrapper">
            <label for="name">Tên sản phẩm</label>
            <Field type="text" ref="name" id="name" placeholder name="name" />
            <ErrorMessage name="name" />
          </div>
          <div class="horizontal">
            <div class="cell-wrapper">
              <label for="name">Giá</label>
              <Field type="number" step="1000" min="0" ref="price" id="price" placeholder name="price" />
              <ErrorMessage name="price" />
            </div>
            <div class="cell-wrapper">
              <label for="name">Số lượng</label>
              <Field type="number" step="1" min="0" ref="quantity" id="quantity" placeholder name="quantity" />
              <ErrorMessage name="quantity" />
            </div>
          </div>
          <div class="cell-wrapper quill">
            <label>
              Thông tin sản phẩm
              <div id="quillLoading" v-if="!isEditorSaved" class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div id="quillLoaded" v-else class="lds-ring checked"></div>
            </label>

            <QuillEditor ref="quillEditor" id="quillEditor" theme="snow" toolbar="full" :modules="modules"
              v-model:content="description" @textChange="onEditorChangeHandler" />
            <Field type="hidden" ref="description" id="description" name="description" />
          </div>
          
        </div>
        <div class="group-wrapper upload">
          
          <div class="cell-wrapper">
            <label for="name">Chọn Ảnh</label>
            <button type="button" class="button block" @click="openImageUploadModal">Thêm ảnh</button>
            <PreviewImages id="previewImages" :images="imagesArr" @deleteImage="deleteImage" />
            <Field type="hidden" ref="images" id="images" placeholder name="images" />
          </div>

        </div>

        <div class="group-wrapper upload">
          <div class="cell-wrapper">
            <button :disabled="!isFormSubmittable" class="button block">
              <div id="quillLoading" v-if="isProcessing" class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <font-awesome-icon v-else icon="cloud-arrow-up" />
              Lưu
            </button>
          </div>
        </div>
      </Form>
      <div class="section-wrapper" v-show="!currentUser">
        
      </div>
      <UploadImage title="" ref="uploadImageModal" @submitCroppedImage="addNewImage" :aspectRatio="1"
        id="uploadImageModal" />
    </div>
  </main>
</template>

<style scoped>
* {
  background-color: transparent;
}

main {
  display: flex;
  margin: 0;
  padding: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.background-transparent {
  background-color: transparent !important;
}

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1.section-wrapper {
  cursor: pointer;
}

.section-wrapper {
  background-color: rgba(255, 255, 255, 0.253);
  padding: 16px;
  margin: 16px;
  width: 75%;

  box-sizing: border-box;

  border-radius: 8px;

  &>.group-wrapper {
    width: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    &.upload {
      transition: none;
    }

    & .cell-wrapper {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 8px;
      width: inherit;

      background-color: white;
      color: #000;
      box-shadow: 0px 0px 10px #ddd;
      padding: 8px;
      border-radius: 8px;

      justify-content: space-between;
      align-items: center;

      & input,
      & :autofill,
      & :-internal-autofill-selected {
        width: 100%;
        padding: 10px 0px;
        border: none;
        border-bottom: 2px solid #ddd !important;
        background-color: white !important;
        transition-property: border-bottom;
        transition-duration: 0.2s;
        transition-timing-function: linear;
        box-sizing: content-box;

        &:hover,
        &:focus {
          border-bottom: 2px solid #fff;
          outline: none;
        }
      }

      &.quill {
        display: block !important;

        &>button {
          border: 1px solid #ddd;
          background-color: white;
          color: #000;
          box-shadow: inset 0 0.2rem 0.4rem rgba(0, 0, 0, .05);
          padding: 8px;
          border-radius: 4px;
        }

        &>label {
          color: #000;
          margin-bottom: 4px;
        }
      }
    }

    & .horizontal {
      display: flex;
      gap: 8px;

      &>* {
        width: calc(50% - 4px) !important;
      }
    }
  }

  @media (max-width:768px) {
    width: 95%;
  }
}

#uploadImageModal {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 5%;
  margin-left: auto;
  margin-right: auto;
  display: none;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.253);
  box-sizing: border-box;
}

.section-wrapper {
  display: flex;
  flex-direction: column;
}
</style>