<script>
export default {
  name: "ProductListItem",
  props: ["productItem", "header"],
  methods: {
    callEdit($event) {
      this.$emit('edit', $event.currentTarget.getAttribute("data-pid"));
    },
    callDelete($event) {
      this.$emit('delete', $event.currentTarget.getAttribute("data-pid"));
    }
  },
};
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
  color: black;
  
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