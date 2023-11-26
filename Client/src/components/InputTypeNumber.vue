<script>
import Marquee from './Marquee.vue';

export default {
  name: "InputTypeNumber",
  components: { //Đây là nơi khai báo các component con được sử dụng trong component này. Trong trường hợp này, chỉ có một component con là “Marquee”.
    Marquee
  },
  props: { // Đây là các thuộc tính mà component này nhận từ component cha. Có nhiều props được định nghĩa như “params”, “max”, “min”, “step”, “value”, “width”, và “disabled”.
    params: { //Đây là một thuộc tính có thể là một đối tượng hoặc một chuỗi.
      type: [Object, String]
    },
    max: { //Đây là một thuộc tính số, mặc định là undefined. 
//Nó có thể được sử dụng để xác định giá trị tối đa cho một số lượng nào đó.
      type: Number,
      default: undefined
    },
    min: {//Đây là một thuộc tính số, mặc định là 0. 
//Nó có thể được sử dụng để xác định giá trị tối thiểu cho một số lượng nào đó.
      type: Number,
      default: 0
    },
    step: {//Đây là một thuộc tính số, mặc định là 1. 
//Nó có thể được sử dụng để xác định bước nhảy cho một số lượng nào đó.
      type: Number,
      default: 1
    },
    value: {//Đây là một thuộc tính số. 
//Nó có thể được sử dụng để xác định giá trị hiện tại của một số lượng nào đó.
      type: Number
    },
    width: {//Đây là một thuộc tính chuỗi, mặc định là "80px".
//Nó có thể được sử dụng để xác định chiều rộng của một phần tử nào đó.
      type: String,
      default: "80px"
    },

    disabled: Boolean //Đây là một thuộc tính boolean. 
//Nó có thể được sử dụng để xác định xem một phần tử có bị vô hiệu hóa hay không.
  },
  data() { // Đây là nơi khai báo dữ liệu nội bộ của component. Trong trường hợp này, chỉ có một biến dữ liệu là “currentValue”.
    return {// thường được sử dụng trong phương thức data() của một component. Nó trả về một đối tượng, 
//trong đó currentValue là một thuộc tính của đối tượng đó và được khởi tạo với giá trị 0.
      currentValue: 0,
    }
  },
  methods: { // Đây là nơi khai báo các phương thức của component. Có nhiều phương thức như “valueChanged”, “increase”, “decrease”, “changeValueManually”, và “reset”.
    async valueChanged() { // Phương thức này được gọi khi giá trị của currentValue thay đổi.
      //Nếu params không phải là chuỗi rỗng, nó sẽ phát ra sự kiện ‘changeWithParams’ với params và currentValue như là đối số.
      // Nó cũng sẽ phát ra sự kiện ‘change’ với currentValue như là đối số.
      if (this.params !== "") { 
        
        this.$emit('changeWithParams', {
          params: this.params,
          value: this.currentValue
        })
      }
      this.$emit('change', this.currentValue)
    },
    increase() { //  Phương thức này tăng currentValue lên theo bước nhảy được định nghĩa trong step.
      this.currentValue += this.step;

    },
    decrease() { // Phương thức này giảm currentValue xuống theo bước nhảy được định nghĩa trong step.
      this.currentValue -= this.step;
    },
    changeValueManually($event) { //Phương thức này cho phép thay đổi currentValue một cách thủ công thông qua sự kiện đầu vào. 
                                  //Giá trị mới sẽ được lấy từ event.currentTarget.value và chuyển đổi thành số nguyên.
      this.currentValue = parseInt($event.currentTarget.value);
    },
    reset() { //Phương thức này đặt lại currentValue về giá trị ban đầu, nếu value không được định nghĩa thì nó sẽ đặt currentValue về min.
      this.currentValue = this.value || this.min;
    }
  },
  watch: { // Đây là nơi khai báo các watcher, những hàm sẽ được gọi khi một biến dữ liệu thay đổi. Trong trường hợp này, có hai watcher cho “value” và “currentValue”.
    value(v) { //Đây là một watcher, nó theo dõi sự thay đổi của thuộc tính value. 
//Khi value thay đổi, nó sẽ cập nhật currentValue với giá trị mới của value.
      this.currentValue = v;
    },
    async currentValue(v) { //Đây cũng là một watcher, nó theo dõi sự thay đổi của trạng thái currentValue. 
//Khi currentValue thay đổi, nó sẽ kiểm tra xem giá trị mới có nhỏ hơn min hay không. 
//Nếu có, nó sẽ đặt currentValue bằng min. Nếu max được định nghĩa và currentValue lớn hơn max hoặc max nhỏ hơn hoặc bằng min, 
//nó sẽ đặt currentValue bằng max. Sau đó, nó sẽ gọi phương thức valueChanged.
      if (v < this.min) {
        this.currentValue = this.min;

      }
      if (this.max != undefined && (v > this.max || this.max <= this.min)) {
        this.currentValue = this.max;
      }
      await this.valueChanged(); //async trước currentValue(v) chỉ ra rằng đây là một hàm bất đồng bộ, 
//có nghĩa là nó có thể chờ cho một hành động nào đó hoàn thành (như một yêu cầu mạng) trước khi tiếp tục thực hiện. 
//Trong trường hợp này, nó đang chờ cho valueChanged() hoàn thành.
    }
  },
  created() { // Đây là một lifecycle hook của Vue.js, được gọi ngay sau khi một instance Vue được tạo. Trong trường hợp này, nó gọi phương thức “reset”.
    this.reset();
  }
}
// Đây là thẻ chứa chính cho tất cả các phần tử khác. Nó có class “input-wrapper” để áp dụng các quy tắc CSS.
// <span :disabled="currentValue <= min" @click="decrease" class="input-number-decrement">–</span>: Đây là nút giảm giá trị.
//Nó sẽ gọi phương thức decrease khi được nhấp. Nếu currentValue nhỏ hơn hoặc bằng min, nút này sẽ bị vô hiệu hóa.
//<input :disabled="disabled" :style="{ width }" ref="input" @change="changeValueManually" class="input-number" type="text" :value="currentValue" :min="min" :max="max">: Đây là trường nhập liệu. 
//Nó sẽ gọi phương thức changeValueManually khi giá trị thay đổi. Nếu prop disabled là true, trường nhập liệu này sẽ bị vô hiệu hóa. Giá trị hiện tại của trường nhập liệu này là currentValue
//<span :disabled="currentValue >= max" @click="increase" class="input-number-increment">+</span>: Đây là nút tăng giá trị. 
//Nó sẽ gọi phương thức increase khi được nhấp. Nếu currentValue lớn hơn hoặc bằng max, nút này sẽ bị vô hiệu hóa.
</script>

<template>
  <div class="input-wrapper">
    <span :disabled="currentValue <= min" @click="decrease" class="input-number-decrement">–</span>
    <input :disabled="disabled" :style="{ width }" ref="input" @change="changeValueManually" class="input-number"
      type="text" :value="currentValue" :min="min" :max="max">
    <span :disabled="currentValue >= max" @click="increase" class="input-number-increment">+</span>
  </div>
</template>

<style scoped>
span[disabled=true],
input[disabled=true] {
  cursor: no-drop;
  color: #ccc;
  background: linear-gradient(to right, #00000044, #00000044);
}

.input-number {
  padding: 0 12px;
  vertical-align: top;
  text-align: center;
  outline: none;
}

.input-number,
.input-number-decrement,
.input-number-increment {
  border: 1px solid #ccc;
  height: 40px;
  user-select: none;
}

.input-number-decrement,
.input-number-increment {
  display: inline-block;
  width: 30px;
  line-height: 38px;
  background: #f1f1f1;
  color: #444;
  text-align: center;
  font-weight: bold;
  cursor: pointer;
}

.input-number-decrement:active,
.input-number-increment:active {
  background: #ddd;
}

.input-number-decrement {
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.input-number-increment {
  border-left: none;
  border-radius: 0 4px 4px 0;
}
</style>