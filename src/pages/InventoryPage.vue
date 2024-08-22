<template>
<div class="q-grid">
    <!-- Loading Status -->
    <Transition>
        <div v-if="collection.isLoading" class="q-cell-1">
            <h1 class="title">Loading<LoadingDotsVue /></h1>
        </div>
    </Transition>
    
    <!-- Toggle Form Button -->
    <div class="q-cell-1">
        <button v-if="!showForm" @click="showForm = true" class="toggle">Show Form <Down /></button>
        <button v-else @click="showForm = false" class="toggle">Hide Form <Up /></button>
    </div>

    <!-- When Showing Form -->
    <Transition>
    <div v-if="showForm" class="q-cell-1">
        <InventoryItemFormVue />
    </div>
    </Transition>

    <!-- Fetched Items -->
    <Transition>
    <div v-if="!collection.isLoading" class="q-cell-1">
        <InventoryItemRow v-for="product in collection.items" :key="product._id" :product="product" />
    </div>
    </Transition>

    <!-- Static Items -->
    <Transition>
    <div v-if="unsavedStaticProducts.length && !collection.isLoading" class="q-cell-1">
        <h1 class="title">Static Products</h1>
        <InventoryItemRow v-for="product in unsavedStaticProducts" :key="product.sku" :product="product" />
    </div>
    </Transition>

</div>
</template>

<script setup>
import { computed, ref } from 'vue';

// Components
import InventoryItemRow from '../components/InventoryItemRow.vue';
import InventoryItemFormVue from '../components/InventoryItemForm.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';
import Down from 'vue-material-design-icons/ChevronDown.vue';
import Up from 'vue-material-design-icons/ChevronUp.vue';

// Composables
import useDb from '../composables/useDb';
import staticProducts from '../staticDb/productsDb';

const productDb = useDb('products');
const collection = productDb.getCollection();

const showForm = ref(false);

const unsavedStaticProducts = computed(() => {
    return staticProducts.filter(product => !collection.items.some(item => item.sku === product.sku));
});

</script>

<style scoped>
h1.title {
    padding: 10px;
    text-align: center;
}
.toggle {
    width: 100%;
    background: transparent;
    color: #000;
    font-weight: bold;
}
</style>