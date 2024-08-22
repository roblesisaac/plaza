<template>
  <div class="cart-item q-grid middle">

    <!-- Thumbnail -->
    <div class="item-image q-cell-20">
      <router-link v-if="product.images?.length" :to="'products/' + item.title">
        <img :src="imagePath(0)" :alt="item.name" class="thumbnail" />
      </router-link>
      <div class="placeholder" v-else>{{ item.name }}</div>
    </div>

    <!-- Details -->
    <div class="item-details q-cell-40">
      <h3><router-link :to="'products/' + item.title" class="item-title">{{ item.title }}</router-link><br>{{ formattedPrice }}</h3>
    </div>

    <!-- Buttons -->
    <div class="q-cell-40 right">

      <div class="qty-actions q-grid middle">
        <div class="q-cell-33">
          <button @click="updateQuantity(-1)" class="button-qty">-</button>
        </div>
        <div class="q-cell-33 center printed-qty" v-html="item.qty">
        </div>
        <div class="q-cell-33">
          <button @click="updateQuantity(1)" class="button-qty">+</button>
        </div>
      </div>

      <button class="remove-button" @click="emitRemoveItem">Remove</button>

    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import useDb from '../composables/useDb';

const props = defineProps({ 
  item: {
    type: Object,
    required: true
  }
});

const productsDb = useDb('products');

const products = productsDb.getCollection();

const product = computed(() => {
  return products.items.find(itm => itm.sku === props.item?.productsInListing?.[0]?.sku);
});

const emits = defineEmits(['update-qty', 'remove-item']);

const formattedPrice = computed(() => {
  return (props.item.price * props.item.qty).toLocaleString('en-US', {
    style: 'currency', 
    currency: 'USD' 
  });
});

function imagePath(index=0) {    
  try {
    return `/images/${product.value.images[index]}.webp`;
  } catch (err) {
    console.log({
      err
    })
  }
}

function updateQuantity(amount) {
  emits('update-qty', props.item.title, Number(amount));
}

function emitRemoveItem() {
  emits('remove-item', props.item.title);
}
</script>

<style scoped>

button {
  background: #fafafa;
  color: var(--darkest-blue);
  font-weight: bold;
  border-radius: none;
}

h3 {
  margin-bottom: 0;
  line-height: 1.5rem;
}

input {
  text-align: center;
}

.button-qty {
  box-shadow: 1px 1px 1px #ccc;
  width: 100%;
}

.cart-item {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.item-image {
  padding: 10px;
}

.item-image img {
  width: 100%;
  border-radius: 3px;
  cursor: pointer;
}

.item-details {
  padding: 20px;
}

.item-title {
  color: var(--darkest-blue);
  text-decoration: underline;
}

.printed-qty {
  font-weight: bold;
  text-align: center;
}

button.remove-button {
  background: transparent;
  float: right;
}
</style>