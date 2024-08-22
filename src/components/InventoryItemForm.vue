<template>
    <div class="q-grid form">
      <div class="q-cell-1">
        <div class="q-grid center">
          <div class="q-cell-45 label-container">
            <small><b>Available:</b></small>
          </div>
  
          <div class="q-cell-20">
            <button @click="adjustInventory('down')" class="adjust-inventory-button">-</button>
          </div>
          <div class="q-cell-15 stock-count">
            {{ productDataLocal.inventory }}
          </div>
          <div class="q-cell-20">
            <button @click="adjustInventory('up')" class="adjust-inventory-button">+</button>
          </div>
        </div>
  
        <!-- Sku -->
        <EditPropVue :data="productDataLocal" prop="sku" />
  
        <!-- Line -->
        <EditPropVue :data="productDataLocal" prop="line" />
  
        <!-- Application -->
        <EditPropVue :data="productDataLocal" prop="application" />
  
        <!-- Price -->
        <EditPropVue :data="productDataLocal" prop="price" type="number" />
  
        <!-- Status -->
        <EditPropVue :data="productDataLocal" prop="status" :options="['active', 'inactive']" />
  
        <!-- OtherOption -->
        <EditPropVue :data="productDataLocal" prop="otherOption" />
  
        <!-- Dimensions -->
        <!-- Item Length -->
        <EditPropVue :data="productDataLocal.dimensions" prop="length" title="item length" type="number" />
  
        <!-- Item Width -->
        <EditPropVue :data="productDataLocal.dimensions" prop="width" title="item width" type="number" />
  
        <!-- Item Height -->
        <EditPropVue :data="productDataLocal.dimensions" prop="height" title="item height" type="number" />
  
        <!-- Item Weight -->
        <EditPropVue :data="productDataLocal.dimensions" prop="weight" title="item weight" type="number" />

        <!-- Images -->
        <div class="q-grid image-container">
          <div class="q-cell-1">
            <textarea v-model="imagesInput" @input="updateImagesArray" rows="5" placeholder="Enter image URLs separated by commas"></textarea>
          </div>
        </div>
  
        <!-- Temporary Save Button -->
        <button v-if="!productDataLocal._id" @click="postIt">Post Item</button>
  
        <!-- Remove Product -->
        <button v-if="productDataLocal._id" @click="productDb.removeItem(productDataLocal._id)" class="remove-item">Remove Item</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  // Components
  import EditPropVue from './EditProp.vue';
  
  // Composables
  import useDb from '../composables/useDb';
  
  const props = defineProps({
    productData: Object
  });
  
  const productDataLocal = ref(props.productData || emptyProduct());
  const imagesInput = ref(productDataLocal.value.images.join(', '));
  
  const productDb = useDb('products');
  
  function adjustInventory(direction) {
    if (direction === 'up') {
      productDataLocal.value.inventory++;
      return;
    }
    
    if (productDataLocal.value.inventory === 0) {
      return;
    }
  
    productDataLocal.value.inventory--;
  }
  
  function emptyProduct() {
    return {
      sku: '',
      line: '',
      images: [],
      application: '',
      dimensions: {
        length: 1,
        width: 1,
        height: 1,
        weight: 1,
      },
      price: 50,
      inventory: 1,
      status: 'active'
    };
  }
  
  function updateImagesArray() {
    productDataLocal.value.images = imagesInput.value.split(',').map(image => image.trim());
  }
  
  async function postIt() {
    try {
      await productDb.saveItem(productDataLocal.value);
      productDataLocal.value = emptyProduct();
    } catch (err) {
      console.log(err);
    }
  }
  
  watch(() => productDataLocal, () => {
    productDb.updateItem(productDataLocal.value);
  }, { deep: true });
  
  </script>
  
  <style scoped>
  button {
    width: 100%;
  }
  .adjust-inventory-button {
    background: #333;
    padding: 5px 30px;
    font-size: 1.1rem;
    font-weight: bold;
  }
  .edit-shipping {
    padding-top: 20px;
  }
  .form {
    padding: 20px;
  }
  .image-container {
    padding-top: 20px;
  }
  .label-container {
    padding-right: 20px;
    text-align: right;
  }
  .remove-item {
    background-color: var(--darkest-red);
  }
  .stock-count {
    font-weight: bold;
    color: var(--darkest-blue);
    text-align: center;
  }
  </style>
  