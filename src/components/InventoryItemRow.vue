<template>
<div class="q-grid">
    <!-- When Not Editing -->
    <div class="q-cell-1 static-data-container">
        <div class="q-grid middle">

            <!-- Product Image -->
            <div class="q-cell-15 img-container">
                <img v-if="product.images.length" :src="imagePath(0)" :alt="productData.title" class="thumb" />
            </div>

            <!-- Product Text -->
            <div class="q-cell-75 product-text">
                <b class="product-title">{{ productData.sku }} - {{ productData.application }}</b>
                <br>
                <span class="produc t-metadata">{{ productData.inventory }} available - {{ productData.status }} - {{ formatAsPrice(productData.price) }}</span>
            </div>

            <!-- Edit Button -->
            <div class="q-cell-10 left">
                <button @click="editing=!editing" class="action-dots"><Ellipsis /></button>
            </div>
            
        </div>
    </div>

    <!-- When Editing -->
    <Transition>
    <div v-if="editing" class="q-cell-1 editing-container">
        <InventoryItemFormVue :productData="productData" />
    </div>
    </Transition>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { formatAsPrice } from '../utils/formats';

// Components
import { Ellipsis } from 'lucide-vue-next';
import InventoryItemFormVue from './InventoryItemForm.vue';

const props = defineProps({
    product: Object
});

const productData = ref({ ...props.product });
const editing = ref(false);

function imagePath(index=0) {    
    return `../images/${props.product.images[index]}.webp`;
}

</script>

<style scoped>
.action-dots {
    background: transparent;
    color: var(--darkest-blue);
}

.editing-container {
    background: var(--lightest-blue);
}

.product-metadata {
    font-size: 0.9rem;
    color: #444;
    text-transform: capitalize;
}

.product-text {
    padding-left: 20px;
}

.product-title {
    text-transform: uppercase;;
}

.static-data-container {
    padding: 10px 20px;
}

.thumb {
    width: 100%;
    border-radius: 20rem;
}

</style>