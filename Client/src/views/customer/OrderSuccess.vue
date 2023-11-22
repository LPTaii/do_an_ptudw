<script>

export default {
  name: "OrderSuccessCustomer",
  data() {
    return {
      origin: location.origin
    }
  }
}
</script>

<template>
  <main>
    <Teleport to="#content">
      <div class="mask" id="DY!q">
        <div class="content">
          
          <h3>ĐẶT HÀNG THÀNH CÔNG</h3>
          <button @click="$router.push({ name: 'CustomerHome' })" class="block">QUAY VỀ TRANG CHỦ</button>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: stretch;
  align-items: stretch;
}

main>* {
  padding: 8px;
}

img {
  height: 400px;
}

h3 {
  text-align: center;
  color: rgb(0, 0, 0);
}

.mask {
  position: fixed;
  z-index: 9996;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
  
  border-radius: 8px;
  
  padding: 8px;
  box-sizing: border-box;
}


.content {
  z-index: 9997;
  width: 300px;
  border-radius: 8px;
  background-color: #ffffffaa;
  padding: 8px;
  box-sizing: border-box;

}

.mask {
  box-shadow: inset 0 0 48px #000;
}
</style>
