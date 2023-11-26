<script>

export default {
  name: "InputTypeSelect",
  props: [ //Đây là các thuộc tính (props) mà component này nhận. 
//Các thuộc tính này có thể được truyền vào từ component cha.
    'options',
    'id',
    'name',
    'label',
    'value'
  ],
  methods: {// Đây là phương thức changeHandler được định nghĩa trong component. 
//Phương thức này được gọi khi có sự kiện thay đổi trên element mà component này quản lý. 
//Trong trường hợp này, nó lấy giá trị được chọn từ sự kiện, tìm ra tùy chọn tương ứng từ danh sách options,
//và sau đó phát ra sự kiện ‘changed’ với tùy chọn đã được chọn như là dữ liệu của sự kiện.
    changeHandler($event) {
      const index = $event.target.value;
      this.$emit('changed', this.options[index]);
    }
  },
}
//<select :name="name" ref="select" :id="id" @change="changeHandler">: Đây là một thẻ select HTML, 
//với tên và id được đặt bằng các thuộc tính tương ứng từ props. Sự kiện thay đổi (change)
//trên thẻ select này sẽ gọi đến phương thức changeHandler đã được định nghĩa trong component.

//<option default value="">Select {{ label }}...</option>: Đây là tùy chọn mặc định cho thẻ select. 
//Nó sẽ hiển thị dòng chữ “Select {{ label }}…”, với {{ label }} được thay thế bằng giá trị của
//thuộc tính label từ props.

//<option v-for="(option, index) in options" :data-index="index" :data-data="option"
//:value="index">{{ option.label }}</option>: Đây là một vòng lặp Vue.js (v-for) tạo ra một tùy chọn cho
//mỗi phần tử trong mảng options từ props. Mỗi tùy chọn sẽ có giá trị là chỉ số của nó trong mảng options,
//và sẽ hiển thị nhãn (label) của tùy chọn.


</script>

<template>
  <select :name="name" ref="select" :id="id" @change="changeHandler">
    <option default value="">Select {{ label }}...</option>
    <option v-for="(option, index) in options" :data-index="index" :data-data="option" :value="index">{{
      option.label }}
    </option>
  </select>
</template>

<style scoped>
:root {
  --select-border: #777;
  --select-focus: blue;
  --select-arrow: var(--select-border);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

select {
  min-width: 30ch;
  max-width: 50ch;
  border: 1px solid var(--select-border);
  border-radius: 0.25em;
  padding: 0.25em 0.5em;
  font-size: 1.25rem;
  cursor: pointer;
  line-height: 1.1;
  background-color: #fff;
  background-image: linear-gradient(to top, #f9f9f9, #fff 33%);
  max-width: 200px;
  margin: 0;
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  outline: none;
}

select::-ms-expand {
  display: none;
}
</style>