<script>
import { ref } from 'vue';//Đây là cách import hàm ref từ thư viện Vue.js. Hàm ref được sử dụng để tạo ra một đối tượng phản ứng, 
//giúp cho việc theo dõi sự thay đổi của dữ liệu.
export default {//Đây là cách khai báo một component Vue.js. Component này có các props, data, methods và lifecycle hooks.
  props: {//Đây là các thuộc tính mà component này nhận từ component cha. Trong trường hợp này, component nhận các props là hidden, id,
//countdown, và title.
    hidden: {
      type: Boolean
    },
    id: String,
    countdown: Number,
    title: String
  },
  data() {//Đây là nơi khai báo các biến sẽ được sử dụng trong component. Trong trường hợp này, các biến được khai báo là selected,
//parameters, message, và countdownd.
    return {
      selected: null,
      parameters: ref(null),
      message: ref(""),
      countdownd: 0
    }
  },
  methods: {//Đây là nơi khai báo các phương thức sẽ được sử dụng trong component. Trong trường hợp này, các phương thức được khai báo là
//hide, show, và proceed.
    hide() { //Phương thức này sẽ ẩn component bằng cách đặt thuộc tính display của phần tử DOM tương ứng với component này thành 'none'.
      this.$el.style.display = 'none';
    },
    async show(message = null, payload) {//Phương thức này sẽ hiển thị component và cập nhật các giá trị parameters và message dựa trên các 
//tham số đầu vào. Nếu countdown có giá trị, nó sẽ bắt đầu đếm ngược từ countdown đến 0 và cập nhật giá trị countdownd sau mỗi giây.
      this.parameters = payload;
      if (message) {
        this.message = message
      }
      this.$el.style.display = 'block';

      if (this.countdown > 0) {
        for (let count = this.countdown; count > 0; count--) {
          setTimeout(() => {
            count -= 1;
            this.countdownd = count;
          }, (this.countdown - count) * 1000);
        }
      }
    },
    proceed() {//Phương thức này sẽ phát sự kiện 'confirmed' với giá trị parameters và sau đó ẩn component. 
//Sự kiện 'confirmed' có thể được lắng nghe bởi component cha để thực hiện hành động tương ứng khi người dùng xác nhận.
      this.$emit('confirmed', this.parameters)
      this.hide();
    }
  },
  mounted() {//Đây là một lifecycle hook của Vue.js, được gọi sau khi component đã được gắn vào DOM. Trong trường hợp này, 
//nó được sử dụng để ẩn component ngay sau khi nó được gắn vào DOM.
    this.$el.style.display = 'none';
  }
}
//<template>: Đây là thẻ chứa nội dung HTML của component Vue.js.

//<div :id="id" class="modalWrapper">: Đây là một thẻ div với id được bind từ prop id và class là modalWrapper.

//<div class="modalOverlay" @click="hide"></div>: Đây là một thẻ div với class là modalOverlay. Khi người dùng click vào thẻ này, 
//hàm hide sẽ được gọi.

//<button class="close" @click="hide" type="button">X</button>: Đây là một nút với class là close. Khi người dùng click vào nút này, 
//hàm hide sẽ được gọi.

//<div class="modal-header" v-if="title">: Đây là một thẻ div với class là modal-header. Thẻ này chỉ hiển thị nếu prop title có giá trị.

//<h3>{{ title }}</h3>: Đây là một thẻ h3 hiển thị giá trị của prop title.

//<div class="modal-body">{{ message }}</div>: Đây là một thẻ div với class là modal-body hiển thị giá trị của biến message.

//<button :disabled="countdown && countdownd > 0" @click="proceed" class="button" type="button">: Đây là một nút với class là button. 
//Nút này sẽ bị vô hiệu hóa nếu countdown có giá trị và countdownd lớn hơn 0. Khi người dùng click vào nút này, hàm proceed sẽ được gọi.

//Đồng ý {{ countdown ? (${countdownd}) : "" }}: Đây là nội dung hiển thị trên nút. Nếu countdown có giá trị, nó sẽ hiển thị thêm giá trị 
//của countdownd trong dấu ngoặc đơn. Nếu không, nó chỉ hiển thị “Đồng ý”.

</script>

<template>
  <div :id="id" class="modalWrapper">
    <div class="modalOverlay" @click="hide"></div>
    <div class="modal">
      <button class="close" @click="hide" type="button">X</button>
      <div class="modal-header" v-if="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="modal-body">
        {{ message }}
      </div>
      <button :disabled="countdown && countdownd > 0" @click="proceed" class="button" type="button">
        Đồng ý {{ countdown ? `(${countdownd})` : "" }}
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
}

.modal-body {
  padding-block: 16px;
}

.button {
  width: 100%;
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modalOverlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 1;
  box-sizing: content-box;
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
  transform: translateY(30vh);

  &>* {
    display: block;
  }

  @media only screen and (max-width:768px) {
    width: 100%;
  }
}
</style>