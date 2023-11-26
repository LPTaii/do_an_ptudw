<script>
import Marquee from './Marquee.vue';//Đây là cách import component Marquee từ file .vue tương ứng.

const init = {
  filename : "Choose file..."
}
export default{//Đây là cách khai báo một component Vue.js. Component này có tên là “InputTypeFile” và sử dụng component Marquee.
  name:"InputTypeFile",
  components:{
    Marquee
  },
  props:['iaccept', 'icapture'],//Đây là các thuộc tính mà component này nhận từ component cha. Trong trường hợp này, component nhận các props 
//là iaccept và icapture.
  data(){//Đây là nơi khai báo các biến sẽ được sử dụng trong component. Trong trường hợp này, biến được khai báo là filename.
    return {
      filename: init.filename
    }
  },
  methods:{//Đây là nơi khai báo các phương thức sẽ được sử dụng trong component. Trong trường hợp này, các phương thức được khai báo là 
//fileChangedHandler và clearFile.
    fileChangedHandler($event){//Phương thức này sẽ được gọi khi có sự thay đổi trong input file. Nó sẽ phát sự kiện 'fileSelected' với giá trị
//của file đã chọn và cập nhật filename với tên của file
      const target = $event.target;
      const file = target.files[0];
      if (target && target.files) {
        this.$emit('fileSelected', file.value);
      }
      this.filename = file.name;
    },
    clearFile($event) {//Phương thức này sẽ được gọi khi file đã chọn được xóa. Nó sẽ đặt giá trị của input file thành null, đặt lại filename về
//giá trị ban đầu, và phát sự kiện 'cleared'.
      $event.target.value = null;
      this.filename = init.filename;
      this.$emit('cleared');
    }
  }
}
//<label class="file">: Đây là một thẻ label với class là file.

//<input type="file" :accept="iaccept" :capture="icapture" @click="clearFile($event)" @change="fileChangedHandler($event)">: 
//Đây là một input file với các thuộc tính accept và capture được bind từ các prop iaccept và icapture. Khi người dùng click vào input này, 
//hàm clearFile sẽ được gọi. Khi người dùng thay đổi file đã chọn, hàm fileChangedHandler sẽ được gọi.

//<span class="file-custom"><Marquee>{{ filename }}</Marquee></span>: Đây là một thẻ span với class là file-custom và chứa một component Marquee.
//Component Marquee sẽ hiển thị giá trị của filename dưới dạng chữ chạy.
</script>

<template>
  <label class="file">
    <input 
      type="file" 
      :accept="iaccept"
      :capture="icapture"
      @click="clearFile($event)"
      @change="fileChangedHandler($event)"
    >
    <span class="file-custom"><Marquee>{{ filename }}</Marquee></span>
  </label>
</template>

<style scoped>
 .file {
  position: relative;
  display: inline-block;
  cursor: pointer;
  height: 36px;
  width: 100%;
}
.file input {
  min-width: inherit;
  margin: 0;
  filter: alpha(opacity=0);
  opacity: 0;
}
.file-custom {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 5;
  height: 1rem;
  padding: .5rem 1rem;
  line-height: 1;
  color: #555;
  background-color: #fff;
  border: .075rem solid #ddd;
  border-radius: .25rem;
  box-shadow: inset 0 .2rem .4rem rgba(0,0,0,.05);
  -webkit-user-select: none;
     -moz-user-select: none;
      -ms-user-select: none;
          user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1rem;
  white-space: nowrap;
  &:hover:before{
    display: none;
  }
}
.file-custom:before {
  position: absolute;
  top: -.075rem;
  right: -.075rem;
  bottom: -.075rem;
  z-index: 6;
  display: block;
  content: "Browse";
  height: 1rem;
  padding: .5rem 1rem;
  line-height: 1;
  color: #555;
  background-color: #eee;
  border: .075rem solid #ddd;
  border-radius: 0 .25rem .25rem 0;
}

/* Focus */
.file input:focus ~ .file-custom {
  box-shadow: 0 0 0 .075rem #fff, 0 0 0 .2rem #0074d9;
}
</style>