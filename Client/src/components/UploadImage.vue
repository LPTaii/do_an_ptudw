<script>
import ImageCropper from './ImageCropper.vue';//Đây là cách import các component ImageCropper và InputTypeFile từ các file .vue tương ứng.
import InputTypeFile from './InputTypeFile.vue';//Đây là cách import các component ImageCropper và InputTypeFile từ các file .vue tương ứng.

export default {//Đây là cách khai báo một component Vue.js. Component này có các props, data, methods, watcher và lifecycle hooks
  components: {
    ImageCropper,
    InputTypeFile
  },
  props: {//Đây là các thuộc tính mà component này nhận từ component cha. Trong trường hợp này, component nhận các props là cooldown, src,
//aspectRatio, hidden, id, và title.
    cooldown: {
      type: Number
    },
    src: {
      type: String,
    },
    aspectRatio: {
      type: Number
    },
    hidden: {
      type: Boolean
    },
    id: String,
    title: String
  },
  data() {//Đây là nơi khai báo các biến sẽ được sử dụng trong component. Trong trường hợp này, các biến được khai báo là url, cropper,
//destination, image, croppedImage, isProcessing, và isLoaded.
    return {
      url: null,
      cropper: {},
      destination: {},
      image: {},
      croppedImage: null,
      isProcessing: false,
      isLoaded: false
    }
  },
  methods: {//Đây là nơi khai báo các phương thức sẽ được sử dụng trong component. Trong trường hợp này, các phương thức được khai báo là 
//onFileChange, croppingChangedHandler, croppingSavingHandler, croppingSavedHandler, clearedHandler, show, hide, và createNewImage.

    onFileChange(e) {//Phương thức này sẽ được gọi khi có sự thay đổi trong input file. Nó sẽ tạo một URL cho file đã chọn và đặt isLoaded thành true.
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
      this.isLoaded = true
    },
    croppingChangedHandler(value) {//Phương thức này sẽ được gọi khi có sự thay đổi trong việc cắt ảnh. Nó sẽ cập nhật giá trị của croppedImage
//và phát sự kiện 'croppingChanged' với giá trị đã cắt
      this.croppedImage = value;
      this.$emit('croppingChanged', value);
    },
    croppingSavingHandler() {//Phương thức này sẽ được gọi khi bắt đầu lưu ảnh đã cắt. Nó sẽ đặt isProcessing thành true.
      this.isProcessing = true;
    },
    croppingSavedHandler() {//Phương thức này sẽ được gọi khi hoàn thành việc lưu ảnh đã cắt. Nó sẽ đặt isProcessing thành false.
      this.isProcessing = false;
    },
    clearedHandler() {//Phương thức này sẽ được gọi khi ảnh đã cắt được xóa. Nó sẽ phát sự kiện 'cleared'.
      this.$emit('cleared');
    },
    show() {//Phương thức này sẽ hiển thị component bằng cách đặt thuộc tính display của phần tử DOM tương ứng với component này thành 'block'.
      this.$el.style.display = 'block';
    },
    hide() {//Phương thức này sẽ ẩn component bằng cách đặt thuộc tính display của phần tử DOM tương ứng với component này thành 'none'.
      this.$el.style.display = 'none';
    },
    createNewImage() {//Phương thức này sẽ tạo một ảnh mới từ ảnh đã cắt và phát sự kiện 'submitCroppedImage' với ảnh đã cắt.
      this.$emit('submitCroppedImage', this.croppedImage);
    }

  },
  watch: {//Đây là nơi khai báo các watcher. Watcher src sẽ cập nhật giá trị của url mỗi khi src thay đổi.
    src: function () {
      this.url = this.src;
    }
  },
  mounted() {//Đây là một lifecycle hook của Vue.js, được gọi sau khi component đã được gắn vào DOM. Trong trường hợp này, 
//nó được sử dụng để ẩn component ngay sau khi nó được gắn vào DOM.
    this.hide();
  }
}
//<div :id="id" class="modalWrapper">: Đây là một thẻ div với id được bind từ prop id và class là modalWrapper.

//<div class="modalOverlay" @click="hide"></div>: Đây là một thẻ div với class là modalOverlay. Khi người dùng click vào thẻ này, 
//hàm hide sẽ được gọi.

//<button @click="hide" class="close" type="button">X</button>: Đây là một nút với class là close. Khi người dùng click vào nút này, 
//hàm hide sẽ được gọi.

//<div class="modal-header" v-if="title">: Đây là một thẻ div với class là modal-header. Thẻ này chỉ hiển thị nếu prop title có giá trị.

//<h3>{{ title }}</h3>: Đây là một thẻ h3 hiển thị giá trị của prop title.

//<InputTypeFile @change="onFileChange" @cleared="clearedHandler" iaccept=".jpg, .png" icapture />: Đây là một component InputTypeFile. 
//Khi người dùng thay đổi file đã chọn hoặc xóa file đã chọn, các hàm onFileChange và clearedHandler sẽ được gọi tương ứng.

//<ImageCropper @saved="croppingSavedHandler" @saving="croppingSavingHandler" @change="croppingChangedHandler" v-show="url" ref="cropper" 
//:aspectRatio="aspectRatio" :cooldown="cooldown" :src="url" :hidden="hidden">: Đây là một component ImageCropper. Khi người dùng thay đổi, 
//lưu hoặc bắt đầu lưu ảnh đã cắt, các hàm croppingChangedHandler, croppingSavedHandler và croppingSavingHandler sẽ được gọi tương ứng.

//<button :disabled="!isLoaded || isProcessing" @click="createNewImage" class="button" type="button">: Đây là một nút với class là button. 
//Nút này sẽ bị vô hiệu hóa nếu isLoaded là false hoặc isProcessing là true. Khi người dùng click vào nút này, hàm createNewImage sẽ được gọi.
</script>

<template>
  <div :id="id" class="modalWrapper">
    <div class="modalOverlay" @click="hide"></div>
    <div class="modal">
      <button @click="hide" class="close" type="button">X</button>
      <div class="modal-header" v-if="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        <InputTypeFile @change="onFileChange" @cleared="clearedHandler" iaccept=".jpg, .png" icapture />
        <ImageCropper @saved="croppingSavedHandler" @saving="croppingSavingHandler" @change="croppingChangedHandler"
          v-show="url" ref="cropper" :aspectRatio="aspectRatio" :cooldown="cooldown" :src="url" :hidden="hidden">
        </ImageCropper>
      </div>
      <button :disabled="!isLoaded || isProcessing" @click="createNewImage" class="button" type="button">
        Thêm
        <div id="quillLoading" v-if="isProcessing" class="lds-ring"></div>
      </button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  margin: 0;
}

.modalWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  z-index: 65535;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-block: 16px;
}

.modalOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.button {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.close {
  content: "X";
  position: absolute;
  padding: 0;
  width: 36px;
  height: 36px;
  top: -18px;
  right: 16px;
  background-color: white;
  z-index: 10;
  border-radius: 50%;
  border: none;
  text-align: center;
  font-weight: bolder;
  box-shadow: 0 0 5px #888;
}

.modal {
  position: absolute;
  left: 0;
  right: 0;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-inline: 16px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 16px;
  width: 50%;
  background-color: #fff;
  z-index: +20;
  transform: translateY(20vh);

  @media only screen and (max-width:768px) {
    width: 100%;
  }
}
</style>