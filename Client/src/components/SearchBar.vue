<script>
import { h, render } from 'vue';
export default {
  data() {
    return {
      cooldownSearch: 1000,
      results:[],
    };
  },
  methods: {
    clickProduct($event) {
      const pid = $event.currentTarget.getAttribute('data-pid');
      this.$router.push({ name: "CustomerProductDetail", params: { id: pid } })
      this.search("");
    },
    search(key) {
      this.$refs.search.value = key;
      this.$refs.search.dispatchEvent(new Event("input"));
    },
    doSearch($event) {
      
      if(this.$refs.search.value){

        this.$store.dispatch('product/searchProduct', this.$refs.search.value)
        .then(res => {
          console.log(res);
          if(res.products.length > 0){
            this.results = res.products;

            let searchDropDown = document.getElementById('search-results');
            searchDropDown.innerHTML = "";
            res.products.forEach(function (product, index) {
              const props = {
                class: 'search-result-item',
                'data-pid': product._id,
                onClick: this.clickProduct,
              }
              const children = [
                h('div', {
                  class: 'searchResultInfo',
                },h('h5', product.name)),
               
              ];
              const div = document.createElement('div');
              div.className = 'searchResultItem';
              div.style
              const imgItem = h('div', props, children);
              render(imgItem, div);
              searchDropDown.appendChild(div)
            }, this);

          } else {
            this.results = [];
            document.getElementById('search-results').innerHTML="";
          }
        })
      } else {
        this.results = [];
        document.getElementById('search-results').innerHTML="";
      }
    },
  },
};
</script>
<style>
h5{
    font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  }
h5:hover{
  transform: scale(1.05);
  
  
}
input#search{
  margin-right: 400px;
  
}
div#search-results {
  width: 120px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}
</style>
<template>
  <div class="search-wrapper">
    <input
      ref="search"
      type="text"
      name="search"
      id="search"
      autocomplete="none"
      placeholder="Tìm kiếm ..."
      :oninput="doSearch"
      width="10px"
    />
    <div 
      id="search-results" 
      ref="dropdown" 
      v-show="results.length !== 0" 
      class="search-drop-down">
    </div>
  </div>
</template>
<style scoped>
.search-wrapper{
  margin-left: 50px;
}
  #search {
    width: inherit;
    padding: 8px 12px;
    background-color: transparent;
    transition: (transform, padding) .5s ease-in-out;
    font-size: 12px;
    line-height: 8px;
    color: #575756;
    background-color: transparent;
    border-radius: 12px;
    border: 1px solid #575756;
    transition: all 250ms ease-in-out;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    
  }

  #search::placeholder {
    color: rgba(87, 87, 86, 0.8);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  #search:hover,
  #search:focus {
    padding: 8px 12px;
    outline: 0;
    border-bottom: 1px solid #575756;
    border-radius: 4px;
  }
  #search+.search-drop-down{
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 5px #e6caca;
  }
  #search:has(+.search-drop-down){
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  
  .search-drop-down{
    position:absolute;
    padding: 8px 12px;
    width: inherit;
    
  }
  
 
</style>
