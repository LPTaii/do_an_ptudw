<script>
import Pills from '@/components/pills.vue'; //Đây là một câu lệnh import trong JavaScript, 
//nó đang nhập một component Vue.js có tên là “Pills” từ file ‘pills.vue’ nằm trong thư mục ‘components’.

export default {
  name: "HomeView", //Đây là tên của component
  
  components: { //Đây là định nghĩa các component con được sử dụng trong component này. 
//Trong trường hợp này, chỉ có một component con là “Pills”.
    Pills,
  },
  data() {
    return {
      products: [],
      productImages: [],
      origin: location.origin
    }
  }, //Đây là định nghĩa dữ liệu ban đầu của component. Có ba thuộc tính được khởi tạo:
// products, productImages và origin.
  methods: {
    clickPill(value) {
      this.$emit('search', value);
    },
    clickProduct($event) {
      const pid = $event.currentTarget.getAttribute('data-pid');
      this.$router.push({ name: "CustomerProductDetail", params: { id: pid } })
    },
    toPrice(value) {
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    }
  },// Đây là các phương thức được định nghĩa trong component. 
//Các phương thức này có thể được gọi từ template của component hoặc từ các phương thức khác trong component.
  created() {// Đây là một vòng đời của component Vue.js, được gọi ngay sau khi một instance của
//component được tạo. Trong trường hợp này, nó đang gọi một action trong Vuex store để lấy các sản phẩm đề xuất.
    try {
      this.$store.dispatch('product/getRecommendedProducts')
        .then((data) => {
          this.products = data.products;
          this.productImages = data.images;
        })
        .catch((err) => {
          this.$emit('notification', { message: err.message, type: 'error' });
        })
    } catch (err) {
      err.message = "Dispatching ('product/getRecommendedProduct'): " + err.message
      this.$emit('notification', { message: err.message, type: 'error' });
    }
  }
}
//<Pills :pills="tags" @clickPill="clickPill" />: Đây là cách sử dụng component “Pills” đã được import.
//Thuộc tính pills của nó được đặt bằng biến tags (chưa được định nghĩa trong đoạn code bạn đưa ra), và 
//khi có sự kiện clickPill xảy ra (được định nghĩa trong component “Pills”), nó sẽ gọi đến phương thức clickPill của component “HomeView”.

//<div class="product" @click="clickProduct" v-for="product in products" :data-pid="product._id">: 
//Đây là một vòng lặp Vue.js (v-for) tạo ra một div cho mỗi sản phẩm trong mảng products. Mỗi div này sẽ có một sự kiện click gọi đến
//phương thức clickProduct của component “HomeView”, và một thuộc tính data-pid được đặt bằng id của sản phẩm.

//{{ product.name }}, {{ toPrice(product.price) }}, {{ product.quantity }}: Đây là cách hiển thị dữ liệu của sản phẩm.
//toPrice(product.price) sẽ gọi đến phương thức toPrice của component “HomeView” để chuyển đổi giá của sản phẩm thành định dạng tiền tệ.

</script>
<style>
h4{
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}

</style>
<template>
  <main>
    <Pills :pills="tags" @clickPill="clickPill" />
   
    <div class="section">
      <div class="section-title">
        <h2>SẢN PHẨM TIÊU BIỂU</h2>
        <router-link to=""></router-link>
      </div>
      <div   class="section-body products-list">

        <div  class="product" @click="clickProduct" v-for="product in products" :data-pid="product._id">
          <div class="product-item-img">
            <img
              :src="productImages[product._id].length > 0 ? productImages[product._id][0].publicPath : (origin + '/noimage.png')"
              alt="">
          </div>
          <div class="product-item-text">
            <h4>{{ product.name }}</h4>
            <span class="price">{{ toPrice(product.price) }}</span>
            <span>Kho: {{ product.quantity }}</span>
          </div>
        </div>

      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  padding: 0px;
  padding-top: 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;
  width: inherit;
  box-sizing: border-box;
}

main>* {
  margin-inline: 16px;
}

.section {
  background-color: transparent;

}

.section-title {
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  font-weight: 700;
  padding: 8px;
  display: block;

  &>*:last-child {
    float: right;
  }
}

.section-body {
  padding-block: 8px;
  overflow: hidden;
}

.products-list {
  --column: 1;
  --gap: 8px;
  padding-inline: 8px;
  border-radius: 8px;

  background-color: #ffffff99;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  row-gap: var(--gap);
  overflow: visible;

  @media screen and (min-width: 512px) {
    --column: 2;
  }

  @media screen and (min-width: 768px) {
    --column: 4;
  }

  @media screen and (min-width: 1024px) {
    --column: 6;
  }

  @media screen and (min-width: 2048px) {
    --column: 8;
  }
}

.product {
  cursor: pointer;
  width: calc((100% / var(--column)) - ((var(--gap) * (var(--column) - 1)) / var(--column)));
  border-radius: 8px;
  background-color: white;

  & img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;

    border-radius: 8px;
  }

  &>.product-item-text {
    display: flex;
    justify-content: space-between;
    align-items: end;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 8px;

    &>h4 {
      margin: 0;
      width: 100%;
    }

    &>.price {
      font-family: Arial, Helvetica, sans-serif ;
      font-size: 1.2em;
      color: #d0021c;

    }

  }
}

.product {
  box-shadow: 0 0 0px #aaa;
  transition-property: transform, box-shadow;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
}

.product:hover {
  box-shadow: 0 10px 10px #aaa;
  transform: scale(1.05);
}

.tags-wrapper {
  height: 36px;
  display: flex;
  gap: 12px;
  overflow-X: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 0;
  }

  &>* {
    display: flex;
    min-width: fit-content;
    align-items: center;
    justify-content: center;
    padding-inline: 16px;
    padding-block: 4px;
    background-color: var(--color-background-1);
    border-radius: 25px;
  }
}
</style>