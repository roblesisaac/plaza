<template>
<div class="q-grid">
    <div class="q-cell-1">
        <ListingDetailsVue />
    </div>
    
    <div class="q-cell-1">
        <CraftsmanRowVue />
    </div>
    
    <!-- Back -->
    <div class="q-cell-1 text-center back-to-products-wrapper">
        <h2><router-link class="button back" to="/products"><ArrowLeft /> Back To Products</router-link></h2>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import ListingDetailsVue from '../components/ListingDetails.vue';
import CraftsmanRowVue from '../components/LandingSectionTwo.vue';
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';

</script>

<style scoped>
.button.back {
    color: var(--dark-blue);
}

.back-to-products-wrapper {
  padding: 70px 50px;
}
</style>