<script>
export default {
  name: "ProductListItem", //Đây là tên của component.
  props: ["productItem", "header"], //Đây là các thuộc tính (props) mà component này nhận. Các thuộc tính này có thể được truyền vào từ component cha.
  methods: {
    callEdit($event) {
      this.$emit('edit', $event.currentTarget.getAttribute("data-pid"));
    },
    callDelete($event) {
      this.$emit('delete', $event.currentTarget.getAttribute("data-pid"));
    }
  },//Đây là các phương thức được định nghĩa trong component. Các phương thức này có thể được gọi từ template của component 
//hoặc từ các phương thức khác trong component. Trong trường hợp này, callEdit và callDelete đều phát ra sự kiện với id của sản phẩm tương ứng.
};
//<div class="menuu">...</div>: Đây là thẻ div chính của template, có class là “menuu”.

//<div class="cell " :header="header" data-name style="width: 800px;"> {{ productItem.name }} </div>: 
//Đây là một thẻ div hiển thị tên của sản phẩm. Thuộc tính header và data-name được đặt bằng các giá trị tương ứng từ props hoặc data của 
//component.

//<div class="cell shrink" :header="header" data-quantity style="width: 100px;"> <p>{{ productItem.quantity }}</p> </div>: 
//Đây là một thẻ div hiển thị số lượng của sản phẩm.

//<div class="cell shrink" :header="header" data-price style="width: 200px;"> <strong>{{ productItem.price }}</strong> </div>: 
//Đây là một thẻ div hiển thị giá của sản phẩm.

//<button @click="callEdit" :data-pid="productItem._id" type="button">Chỉnh Sửa</button> <button @click="callDelete" :data-pid="productItem._id"
//type="button">Xóa</button>: Đây là hai nút cho phép chỉnh sửa và xóa sản phẩm. Khi nhấn vào, chúng sẽ gọi đến các phương thức callEdit và 
//callDelete tương ứng.
</script>
<template>
<div class="menuu">
  <div class=" menu">
    <div class="cell " :header="header" data-name style="width: 800px;">
      {{ productItem.name }}
    </div>
    <div class="cell shrink" :header="header" data-quantity style="width: 100px;">
      <p>{{ productItem.quantity }}</p>
    </div>
    <div class="cell shrink" :header="header" data-price style="width: 200px;">
      <strong>{{ productItem.price }}</strong>
    </div>
    <div class="cell shrink" :header="header" data-actions>
      <button @click="callEdit" :data-pid="productItem._id" type="button">Chỉnh Sửa</button>
      <button @click="callDelete" :data-pid="productItem._id" type="button">Xóa</button>
    </div>
  </div>
</div>
</template>
<style scoped>
.menu{
  width: 100%;
  border-radius: 8px;
  background-color: white;
  padding: 8px;
  box-sizing: border-box;
}
.menuu{
  width: 100%;
  border-radius: 1px;
  background-color: white;
  padding: 8px;
  box-sizing: border-box;
}
[header] {
  text-align: center;
  font-size: 1.1em;
  font-weight: bold !important;
  background-color: rgb(0, 141, 96);
  color: white;
  
}


.card {
  width: inherit;
  flex-wrap: nowrap;
  display: table-row;
  overflow: hidden;
}

.cell {
  padding-inline: 15px;
  display: table-cell;
  box-sizing: border-box;
  border-radius: 4px;
}




[data-name] {
  width: auto;
}



.cell.shrink {
  text-align: center;
  
  white-space: nowrap;
}
</style>