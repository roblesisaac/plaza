<template>
    <div class="q-grid parent">
        <div v-if="showImage !== false" class="q-cell-1">
            <router-link :to="'/products/' + listing.title">
                <img class="cover-photo" :src="imagePath()" :alt="product.name">
            </router-link>
        </div>
        <div class="q-cell-1 details">
            <router-link :to="'/products/' + listing.title">
            <h4 class="title"><span v-if="product.application">For</span> {{ product.application || product.title }}</h4>
            <small><b>Sku: </b>{{ listing.title.toUpperCase() }}</small>
            <br>
            <small v-if="product.features">*{{ product.features }}</small>
            <br>
            <b class="view-details" :to="'/products/' + listing.title">View Details »</b>
            </router-link>
        </div>
    </div>
    </template>
    
    <script setup>
    import { computed } from 'vue';
    import useDb from '../composables/useDb';

    const { items: products } = useDb('products').getCollection();

    const props = defineProps({
        listing: Object,
        showImage: Boolean
    });

    const product = computed(() => {
        return products.find(p => p.sku === props.listing.productsInListing[0].sku) || { images: []};
    });

    
    function imagePath(index=0) {
        return `../images/${product.value.images[index]}.webp`;
    }
    
    </script>
    
    <style scoped>
    img {
        width: 100%;
        border-radius: 5px 5px 0 0;
    
    }
    
    h4.title {
        font-family: Arial, sans-serif;
        font-weight: bold;
        color: #000;
    }
    
    .details {
        padding: 10px 15px;
    }
    
    .parent {
        height: 100%;
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
    }
    .view-details {
        font-weight: bold;
    }
    </style>