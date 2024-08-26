<template>
<div class="q-grid listing-details-container">
    <Transition>
    <div v-if="mainProduct" class="q-cell-1">
        <div class="q-grid parent">
            <!-- Active Image Not Small Screen -->
            <div v-if="screenSize === 'large'" class="q-cell-1 image-wrapper">
                <div class="q-grid">
                    <div class="q-cell-70">
                        <Transition>
                            <img v-if="activeImage!==false" :src="imagePath(activeImage)" :alt="mainSku" class="active-photo" />
                        </Transition>
                    </div>

                    <!-- Smaller Images -->
                    <div class="q-cell-30 large-thumb-container">
                        <div class="q-grid text-center large-thumbs">
                            <div v-for="(img, index) in mainProduct.images" class="q-cell-50 thumb-container">
                                <img                          
                                :key="img" :src="imagePath(index)" 
                                :alt="mainSku" :class="['thumbs', isActiveThumb(index)]"
                                @click="activateImage(index)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Image Small Screen -->
            <div v-if="isLessThan('large')" class="q-cell-1 image-wrapper">
                <div class="q-grid">
                    <div class="q-cell-1">
                        <Transition>
                            <img v-if="activeImage!==false" :src="imagePath(activeImage)" :alt="mainSku" class="active-photo mb-5" />
                        </Transition>
                    </div>

                    <!-- Smaller Images -->
                    <div class="q-cell-1 scrolling-content">
                        <div class="scrolling-wrapper">
                            <img 
                                v-for="(img, index) in mainProduct.images" 
                                :key="img" :src="imagePath(index)" 
                                :alt="mainSku" :class="['thumbs', isActiveThumb(index)]"
                                @click="activateImage(index)"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Title -->
            <div class="q-cell-1 verbiage p30x">
                <h3>{{ listingTitle.toUpperCase() }}</h3>
                <span v-if="mainProduct.application">For</span> {{ mainProduct.application || mainSku }}
            </div>

            <!-- Info -->
            <div class="q-cell-1 p30x" v-html="mainProduct.info || productLineData.info"></div>

            <!-- Line Footer -->
            <div class="q-cell-1 p30x" v-html="productLineData.footer"></div>

            <!-- Price -->
            <div class="q-cell-1 pad">
                <h1 class="listing-price">${{ listing.price }}</h1>
            </div>

            <!-- Whats In The Box -->
            <div class="q-cell-1 pad">
                <h3>Whats In The Box</h3>
                <ul>
                    <li v-for="productInListing in listing.productsInListing">
                        <b>{{ productInListing.sku.toUpperCase() }} x {{ productInListing.qty }}</b>
                    </li>
                </ul>
            </div>

            <!-- Add To Cart -->
            <div v-if="!cartItem" class="q-cell-1 buy-now">
                <h3><a @click="cart.addItem(listing, 1)" class="button">Add To Cart</a></h3>
            </div>

            <!-- Adjust Cart -->
            <Transition>
            <div v-if="cartItem" class="q-cell-1 buy-now">
                <div class="q-grid middle">
                    <div class="q-cell-33">
                        <a @click="cart.updateItemQuantity(listingTitle, -1)" class="button">
                            <h2>-</h2>
                        </a>
                    </div>
                    <div class="q-cell-33 cart-count">{{ cartItem.qty }}</div>
                    <div class="q-cell-33">
                        <a @click="cart.updateItemQuantity(listingTitle, 1)" class="button">
                            <h2>+</h2>
                        </a>
                    </div>
                </div>
            </div>
            </Transition>

            <!-- Etsy -->
            <div class="q-cell-1 p30x">
                <h3><a class="button" target="_blank" href="https://gardenhanger.etsy.com">Buy Now On Etsy »</a></h3>
            </div>
            
            <!-- View Cart -->
            <div class="q-cell-1 view-cart" v-if='cart.items.length'>
                <router-link to="/cart"><h3>View Cart (${{ cart.subtotal }})</h3></router-link>
            </div>

            <!-- Variation -->
            <div v-if="mainProduct.otherOption" class="q-cell-1 options variation">
                <h3><router-link :to="'/products/'+mainProduct.otherOption">{{ verb }} Add-On Clip »</router-link></h3>
            </div>

            <!-- Other Sizes -->
            <div class="q-cell-1 other-sizes">
                <h3 class="others p30x">Other Sizes:</h3>
                <ProductLineVue :productLine="productLineData" :showVerbiage="false" :showImages="false" :hidden="[mainSku]" />
            </div>
        </div>
    </div>
    </Transition>
    <Transition>
    <div v-if="!mainProduct" class="q-cell-1">
        <h3>Loading Product {{ mainSku }} Details<LoadingDotsVue /></h3>
    </div>
    </Transition>
</div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

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
