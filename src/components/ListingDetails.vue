<template>
    <div class="container mx-auto px-4 py-8">
        <div v-if="mainProduct" class="space-y-8">
            <!-- Image Gallery -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Main Image -->
                <div class="relative aspect-w-1 aspect-h-1 group">
                <transition
                    enter-active-class="transition-opacity duration-300"
                    leave-active-class="transition-opacity duration-300"
                    enter-from-class="opacity-0"
                    leave-to-class="opacity-0"
                >
                    <img
                    v-if="activeImage !== false"
                    :src="imagePath(activeImage)"
                    :alt="mainSku"
                    class="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                </transition>
                <!-- Price Badge -->
                <div class="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-tl-lg rounded-br-lg shadow-lg transform translate-y-1 translate-x-1 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-300 ease-in-out">
                    <div class="flex flex-col items-end">
                    <span class="text-2xl font-bold">{{ formatAsPrice(listing.price) }}</span>
                    </div>
                </div>
                </div>
            
            <!-- Thumbnails -->
            <div class="grid grid-cols-4 gap-4 content-start">
                <div 
                v-for="(img, index) in mainProduct.images" 
                :key="img" 
                class="aspect-w-1 aspect-h-1"
                >
                    <img
                    :src="imagePath(index)"
                    :alt="mainSku"
                    :class="['w-full h-full object-cover rounded cursor-pointer transition-all duration-300', 
                    isActiveThumb(index) ? 'ring-2 ring-blue-500' : 'hover:opacity-75']"
                    @click="activateImage(index)"
                    />
                </div>
            </div>
        </div>
    
    <!-- Product Info -->
    <div class="space-y-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ listingTitle.toUpperCase() }}</h1>
        <p class="text-xl text-gray-600">
            <span v-if="mainProduct.application">For</span> {{ mainProduct.application || mainSku }}
        </p>
        <div class="prose max-w-none" v-html="mainProduct.info || productLineData.info"></div>
        <div class="prose max-w-none" v-html="productLineData.footer"></div>
    </div>
    
    <!-- Price and Add to Cart -->
    <div class="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 class="text-4xl font-bold text-gray-900 mb-4 text-center">{{ formatAsPrice(listing.price) }}</h2>
        <div v-if="!cartItem">
            <button @click="cart.addItem(listing, 1)" class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
                Add To Cart
            </button>
        </div>
        <div v-else class="flex items-center justify-between">
            <button @click="cart.updateItemQuantity(listingTitle, -1)" class="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300">
                -
            </button>
            <span class="text-2xl font-bold">{{ cartItem.qty }}</span>
            <button @click="cart.updateItemQuantity(listingTitle, 1)" class="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-300">
                +
            </button>
        </div>
    </div>
    
    <!-- What's In The Box -->
    <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-2xl font-bold mb-4 text-center">What's In The Box</h3>
        <ul class="list-disc pl-6 space-y-2">
            <li v-for="productInListing in listing.productsInListing" :key="productInListing.sku" class="text-lg">
                <span class="font-semibold">{{ productInListing.sku.toUpperCase() }} x {{ productInListing.qty }}</span>
            </li>
        </ul>
    </div>
    
    <!-- Etsy and View Cart -->
    <div class="flex flex-col sm:flex-row gap-4">
        <a href="https://gardenhanger.etsy.com" target="_blank" class="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg text-center text-lg font-semibold hover:bg-green-700 transition-colors duration-300">
            Buy Now On Etsy
        </a>
        <router-link v-if="cart.items.length" to="/cart" class="flex-1 bg-gray-800 text-white py-3 px-6 rounded-lg text-center text-lg font-semibold hover:bg-gray-900 transition-colors duration-300">
            View Cart ({{ formatAsPrice(cart.subtotal) }})
        </router-link>
    </div>
    
    <!-- Variations and Other Sizes -->
    <div class="space-y-6">
        <div v-if="mainProduct.otherOption" class="bg-gray-100 p-6 rounded-lg">
            <router-link :to="'/products/'+mainProduct.otherOption" class="text-xl font-semibold text-blue-600 hover:underline">
                {{ verb }} Add-On Clip »
            </router-link>
        </div>
        <div>
            <h3 class="text-2xl font-bold mb-4">Other Sizes:</h3>
            <ProductLineVue :productLine="productLineData" :showVerbiage="false" :showImages="false" :hidden="[mainSku]" />
        </div>
    </div>
</div>

<div v-else class="text-center py-12">
    <h3 class="text-2xl font-bold text-gray-700">
        Loading Product {{ mainSku }} Details<LoadingDotsVue />
    </h3>
</div>
</div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { formatAsPrice } from '../utils/formats';

// Components
import ProductLineVue from './ProductLine.vue';
import CraftsmanRowVue from './LandingSectionTwo.vue';
import LoadingDotsVue from './LoadingDots.vue';

// Composables + Utils
import router from '../router';
import { useCartStore } from '../stores/cartStore';
import useScreen from '../composables/useScreen';
import useListings from '../composables/useListings';

const { calcListingValue, getListing, getMainSku, getMainProduct, getProductLineData } = useListings();

const cart = useCartStore();
const { isLessThan, screenSize } = useScreen();

const activeImage = ref(0);

const listingTitle = computed(() => {
    return router.currentRoute.value.params.title;
});

const listing = computed(() => {
    return getListing(listingTitle.value);
});

const listingPrice = computed(() => {
    return listing.value?.price || calcListingValue(listing.value);
})

const mainSku = computed(() => {
    return getMainSku(listing.value);
});

const mainProduct = computed(() => {
    return getMainProduct(listing.value);
});

const cartItem = computed(() => {
    return cart.findItem(listingTitle.value);
});

const productLineData = computed(() => {
    return getProductLineData(listing.value);
});

const verb = computed(() => {
    if(!mainProduct.value?.otherOption) {
        return;
    }
    
    if(mainProduct.value?.otherOption.slice(-1) === '1') {
        return 'Equip With An';
    }
    
    return 'Remove';
});

function activateImage(index) {
    activeImage.value = false;
    
    nextTick(() => {
        activeImage.value = index;
    });
}

function imagePath(index=0) {
    const imageName = mainProduct.value.images[index]; 
    
    return `/images/${imageName}.webp`;
}

function isActiveThumb(index) {
    return activeImage.value === index ? 'active-thumb' : '';
}

watch(mainSku, () => {
    activeImage.value = 0;
});

</script>

<style scoped>
h3.others {
    margin-bottom: 20px;
}
img {
    border-radius: 3px;
}
img.active-photo {
    width: 100%;
}
img.thumbs {
    opacity: 0.5;
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
}
img.thumbs:hover {
    opacity: 1;
}
img.active-thumb {
    opacity: 1;
}
.buy-now, .pad {
    padding: 0 30px 10px 30px;
}
.buy-now a.button {
    background-color: #f1bc4d;
    color: #000;
}
.cart-count {
    color: var(--dark-blue);
    text-align: center;
    font-weight: bold;
    font-size: 1.5rem;
}
.options {
    padding-bottom: 20px;
}
.other-sizes {
    padding: 50px 0;
}
.image-wrapper {
    padding: 30px;
}
.p30y {
    padding: 30px 0;
}
.p30x {
    padding: 0 30px;
}
.p30b {
    padding-bottom: 30px;
}

.button {
    background-color: #000;
    color: #fff;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 3px;
    width: 100%;
    display: block;
    box-sizing: border-box;
    text-align: center;
}

.large-thumbs img {
    object-fit: cover;
    width: 100%;
}

.large-thumb-container {
    padding: 0 0 0 30px;
}

.listing-details-container {
    max-width: 1000px;
    margin: 0 auto;
}

.listing-price {
    color: var(--dark-blue);
    margin-bottom: 10px;
}

.thumbs {
    height: 10rem;
    margin-right: 10px;
}

.thumb-container {
    padding-bottom: 10px;
}

.thumb-container:nth-child(odd) {
    padding-right: 10px;
}

.variation {
    padding: 30px 0 0 30px;
}

.verbiage {
    padding-top: 20px;
}

.view-cart {
    text-align: center;
    font-weight: bolder;
    padding: 20px 30px;
    font-size: 1.3rem;
}
</style>
