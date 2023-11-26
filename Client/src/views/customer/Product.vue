<script>
import Pills from '@/components/pills.vue';
import Gallery from '@/components/Gallery.vue';
import InputTypeNumber from '@/components/InputTypeNumber.vue';

export default {
  name: "ProductDetailCustomer",
  components: { // Đối tượng này chứa tên của tất cả các thành phần sẽ được sử dụng bên trong thành phần này. Trong trường hợp này, nó bao gồm `Pills`, `Gallery` và `InputTypeNumber`.
    Pills, // Thành phần này được sử dụng để hiển thị các sản phẩm liên quan.
    Gallery, // Thành phần này được sử dụng để hiển thị hình ảnh sản phẩm.
    InputTypeNumber // Thành phần này được sử dụng để hiển thị số lượng sản phẩm.
  },
  data() { // Hàm này trả về một đối tượng chứa trạng thái ban đầu của dữ liệu của thành phần. Trong trường hợp này, nó bao gồm `id`, `sản phẩm`, `số lượng`, `hình ảnh sản phẩm`, `Sản phẩm được đề xuất`, `Hình ảnh sản phẩm được đề xuất` và `origin`.
    return {
      id: "",
      product: [],
      quantity: 0,
      productImages: [],
      recommendedProducts: [],
      recommendedProductImages: [],
      origin: location.origin
    }
  },
  methods: { // Đối tượng này chứa tất cả các hàm sẽ được gọi bởi các sự kiện hoặc thuộc tính được tính toán. Trong trường hợp này, nó bao gồm `fetchProduct`, `clickPill`, `clickProduct`, `toPrice`, `quantityValueChanged` và `addToCart`.
    async fetchProduct(id) { // Phương thức này được sử dụng để lấy thông tin sản phẩm từ cơ sở dữ liệu.
      this.$refs.inputQuantity.reset();
      try {
        this.$store.dispatch('product/getProduct', id)
          .then((data) => {
            this.product = data.product;
            this.productImages = data.images;
          })
          .catch((err) => {
            this.$emit('notification', { message: err.message, type: 'error' });
          })
      } catch (err) {
        err.message = "Dispatching ('product/getProduct'): " + err.message
        this.$emit('notification', { message: err.message, type: 'error' });
      }
    },
    clickPill(value) { //Phương thức này được sử dụng để tìm kiếm sản phẩm liên quan.
      this.$emit('search', value);
    },
    clickProduct($event) { //Phương thức này được sử dụng để chuyển hướng đến trang chi tiết sản phẩm.
      const pid = $event.currentTarget.getAttribute('data-pid');
      this.$router.push({ name: "CustomerProductDetail", params: { id: pid } })
      this.id = pid;
    },
    toPrice(value = "") { // Chuyển đổi giá trị thành định dạng tiền tệ Việt Nam (VND).
      return value.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    },
    quantityValueChanged(val) { // Cập nhật giá trị số lượng khi người dùng thay đổi.
      this.quantity = val;
    },
    addToCart() { // Thêm sản phẩm vào giỏ hàng.
      const item = {
        productId: this.product._id,
        productName: this.product.name,
        quantity: this.quantity,
        maxQuantity: this.product.quantity,
        orderPrice: this.product.price
      }
      this.$store.dispatch('cart/addCartItem', item)
      this.$emit('updateCart')
      this.$emit('notification', { message: "Đã thêm vào giỏ hàng", type: "success" })
    }
  },
  watch: { //Đối tượng này chứa các hàm sẽ được gọi khi thuộc tính được theo dõi thay đổi. Trong trường hợp này, nó bao gồm một hàm gọi phương thức `fetchProduct` khi thuộc tính `id` thay đổi.
    async id(newVal) {
      await this.fetchProduct(newVal)
    }
  },
  created() { //  Hàm này được gọi khi thành phần được tạo, nhưng trước khi nó được gắn vào DOM. Trong trường hợp này, nó gọi phương thức `get recommendedProducts` để tìm nạp các sản phẩm và hình ảnh được đề xuất.
    try {
      this.$store.dispatch('product/getRecommendedProducts')
        .then((data) => {
          this.recommendedProducts = data.products;
          this.recommendedProductImages = data.images;
        })
        .catch((err) => {
          this.$emit('notification', { message: err.message, type: 'error' });
        })
    } catch (err) {
      err.message = "Dispatching ('product/getRecommendedProduct'): " + err.message
      this.$emit('notification', { message: err.message, type: 'error' });
    }
  },
  mounted() { // Hàm này được gọi sau khi thành phần được mount trên DOM. Trong trường hợp này, nó đặt giá trị ban đầu của thuộc tính `id` từ các tham số tuyến đường.
    this.id = this.$route.params.id;
  },
}
//<div class="product-detail">: Đây là thẻ chứa cho thông tin chi tiết về sản phẩm.
//<Gallery :images="productImages" />: Đây là một component con Gallery với thuộc tính images được ràng buộc với productImages.
//<h3 style="display: block; width: 100%;">{{ product.name }}</h3>: Đây là nơi hiển thị tên của sản phẩm.
//<h2 class="price">{{ toPrice(product.price) }}</h2>: Đây là nơi hiển thị giá của sản phẩm.
//<span>Kho: {{ product.quantity > 0 ? product.quantity : "Out of stock" }}</span>: Đây là nơi hiển thị số lượng sản phẩm còn lại trong kho.
//<InputTypeNumber :disabled="product.quantity <= 0" ref="inputQuantity" :max="product.quantity" :min="(Math.min(1, product.quantity) || 0)" @change.self="quantityValueChanged" />:
//Đây là một component con InputTypeNumber để nhập số lượng sản phẩm muốn mua.
//<button :disabled="product.quantity <= 0" class="btn primary" @click="addToCart">Thêm vào giỏ hàng</button>:
//Đây là nút để thêm sản phẩm vào giỏ hàng.
//<div class="product-description">: Đây là thẻ chứa cho mô tả sản phẩm.
//<div class="html" v-html="product.description"></div>: Đây là nơi hiển thị mô tả sản phẩm.
//<div class="recommended-products">: Đây là thẻ chứa cho danh sách sản phẩm tương tự.
//<div class="product-item" v-for="p in recommendedProducts" @click="clickProduct" :data-pid="p._id">:
//Đây là một danh sách sản phẩm tương tự được tạo ra bằng vòng lặp v-for.
</script>

<template>
  <main>
    <div class="product-detail">
      <div class="section">
        <div class="product-images">
          <Gallery :images="productImages" />
        </div>
        <div class="product-text">
          <h3 style="display: block; width: 100%;">{{ product.name }}</h3>
          <h2 class="price">{{ toPrice(product.price) }}</h2>
          <span>Kho: {{ product.quantity > 0 ? product.quantity : "Out of stock" }}</span>
          <table class="tbl">
            <tr>
              <td>Vận chuyển: &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td><img style="border-radius: 0;height:1em; aspect-ratio: 1; transform: scale(2); margin-inline: 1em;"
                  :src="origin + '/freeshipping.png'" alt="" srcset=""></td>
            </tr>
            <tr>
              <td>Số lượng: &nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>
                <InputTypeNumber :disabled="product.quantity <= 0" ref="inputQuantity" :max="product.quantity"
                  :min="(Math.min(1, product.quantity) || 0)" @change.self="quantityValueChanged" />
              </td>
            </tr>
          </table>
          <button :disabled="product.quantity <= 0" class="btn primary" @click="addToCart">Thêm vào giỏ hàng</button>
        </div>
      </div>
      <div class="section">
        <div class="product-description">
          <h4>THÔNG TIN SẢN PHẨM</h4>
          <div class="html" v-html="product.description"></div>
        </div>
        <div class="recommended-products">
          <h4>SẢN PHẨM TƯƠNG TỰ</h4>
          <div class="products-list">
            <div class="product-item" v-for="p in recommendedProducts" @click="clickProduct" :data-pid="p._id">
              <div class="product-item-img">
                <img
                  :src="recommendedProductImages[p._id].length > 0 ? recommendedProductImages[p._id][0].publicPath : origin + '/noimage.png'"
                  alt="">
              </div>
              <div class="product-item-text">
                <h3>{{ p.name }}</h3>
                <h4 class="price">{{ toPrice(p.price) }}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<style>
h3{
  
  font-family: Arial, Helvetica, sans-serif;
}
h2{
  font-family: Arial, Helvetica, sans-serif;
  
}

</style>
<style scoped>
img {
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
}

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

.product-detail {
  max-width: 100%;
  width: 1080px;
  margin: 0px;
  margin-left: auto;
  margin-right: auto;
  padding: 8px;
  border-radius: 8px;
  flex: 1 0 auto;
  box-sizing: border-box;

}

.products-list {
  --column: 1;
  --gap: 8px;
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;

  background-color: #ffffff99;
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  row-gap: var(--gap);
  overflow: visible;
}

.price {
  margin-block: 0.5rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  color: #d0021c;
}



.product-detail {
  display: block;
}

.product-detail>* {
  background-color: #fdfdfd;
  border-radius: 8px;
}

.product-detail>*:first-child {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  align-content: flex-start;
  margin-bottom: 8px;
  padding: 8px;
  box-sizing: border-box;
}

.product-detail>*:nth-child(2) {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  gap: 8px;
  align-content: flex-start;
  margin-bottom: 8px;
  box-sizing: border-box;
  background-color: transparent;
}

.product-images {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.product-text {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 8px;
}

.btn {
  display: inline-block;
}

table {
  margin-block: 8px;
  width: auto;

  & * {
    color: #888;
  }

  & tr {
    margin-block: 8px;
  }

  & td {
    display: inline-block;
  }
}

.btn.primary {
  background-color: var(--primary-color);
  color: white;
  font-size: 1.5em;
}

.product-description {
  width: 100%;
  border-radius: 8px;
  background-color: #ffffffaa;
  padding: 8px;
  box-sizing: border-box;

  & h4 {
    padding: 1rem;
    margin: 0px;
  }

  & .html {
    background-color: #ffffff;
    margin: 8px;
    padding: 1rem;
    box-shadow: inset 0 0 5px #ddd;
  }
}

.recommended-products {
  width: 500px;
   width: 100%;
  border-radius: 8px;
  background-color: #ffffffaa;
  padding: 8px;
  box-sizing: border-box;

}

.products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  row-gap: 8px;
  align-content: flex-start;
  justify-items: stretch;
}

.product-item {
  cursor: pointer;
  display: flex;
  width: 100%;
  height: 8rem;

  gap: 8px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 0px #aaa;
  transition-property: transform, box-shadow;
  transition-duration: .2s;
  transition-timing-function: ease-in-out;
}

.product-item:hover {
  box-shadow: 0 10px 10px #aaa;
  transform: scale(1.05);
}

.product-item-text {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 8px;

  & h3 {
    line-height: 1.2em;
    height: 2.4em;
    overflow: hidden;
    text-overflow: ellipsis'...';
    margin: 0
  }
}

.product-item-img {
  height: 100%;

  & img {
    height: 100%;
  }
}

@media screen and (max-width:1024px) {
  .product-detail>*:first-child {
    flex-wrap: wrap;
  }

  .recommended-products {
    width: 100%;
  }

  .product-detail>*:nth-child(2) {
    flex-direction: column;
  }
}
</style>
