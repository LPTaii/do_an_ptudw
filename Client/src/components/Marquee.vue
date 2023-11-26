<script>
export default {
  name:"Marquee",
}
// <div class="marquee">: Đây là thẻ chứa chính cho tất cả các phần tử khác. Nó có class “marquee” để áp dụng các quy tắc CSS.
//<p class="marquee-text">: Đây là một đoạn văn bản có class “marquee-text” để áp dụng các quy tắc CSS.
//<slot></slot>: Đây là một “slot”, nơi mà nội dung từ component cha sẽ được chèn vào. Nếu component cha không cung cấp nội dung cho slot, slot sẽ trống.
</script>

<template>
  <div class="marquee">
    <p class="marquee-text">
      <slot></slot>
    </p>
  </div>
</template>

<style scoped>
.marquee {
  width: 100%;
  display: flex;
  align-items: center;

  color: black;

  white-space: nowrap;
  overflow: hidden;
  & p {
    margin: 0;
    &:hover{
      padding-right: 100%;
      animation: marquee 15s linear infinite;
    }
  }
}
@keyframes marquee {
  0% { transform: translate(0, 0); }
  45% { transform: translate(-100%, 0); }
  49% { transform: translate(-100%, 50px); }
  51% { transform: translate(100%, 50px); }
  65% { transform: translate(100%, 0); }
  100% { transform: translate(0, 0); }
}
</style>