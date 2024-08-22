<template>
<div class="q-grid line-parent">
    <div v-if="showVerbiage !== false" class="q-cell-1 verbiage">
        <div class="q-grid">
            <div class="q-cell-1 title"><h2>{{ productLine.title }}</h2></div>
            <p v-html="productLine.lineInfo || productLine.info" class="p10y"></p>
        </div>
    </div>

    <Transition>
    <div v-if="!listingsCollection.isLoading && screen.isGreaterThan('small')" class="q-cell-1 p20x">
        <div class="q-grid equal-height-grid">
            <div class="q-cell-25" v-for="listing in listings">
                <div class="product-container">
                    <ListingThumbVue :listing="listing" :key="listing.title" :showImage="showImages" />
                </div> 
            </div>
        </div>
    </div>
    </Transition>


    <Transition>
    <div v-if="!listingsCollection.isLoading && screen.isLessThan('medium')" class="q-cell-1">
        <swiper v-if="listings.length" class="slider"
            :slidesPerView="slidesPerView"
            :loop="true"
            :grabCursor="true"
            :navigation="true"
            :slidesOffsetBefore="20"
            :spaceBetween="20"
        >
            <swiper-slide v-for="listing in listings" :key="listing.title">
                <ListingThumbVue :listing="listing" :key="listing.title" :showImage="showImages" />              
            </swiper-slide>
        </swiper>
    </div>
    </Transition>
    
</div>
</template>

<script setup>
import { computed } from 'vue';

// Components
import ListingThumbVue from './ListingThumb.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';

// Comosables
import useScreen from '../composables/useScreen';
import useDb from '../composables/useDb';

const screen = useScreen();
const listingsDb = useDb('listings');
const listingsCollection = listingsDb.getCollection();

const props = defineProps({
    productLine: Object,
    showImages: {
        type: Boolean,
        default: true
    },
    showVerbiage: {
        type: Boolean,
        default: true
    }
});

const slidesPerView = computed(() => {
    if(screen.screenSize.value === 'small') {
        return 2.7;
    }

    return 1.5;

});

const listings = computed(() => {
    const { line } = props.productLine;

    const activeProducts = listingsCollection.items.filter(listing => 
        listing.line === line && listing.status === 'active'
    );

    return activeProducts.length < 3 && screen.isLessThan('medium') 
        ? [ ...activeProducts, ...activeProducts ] 
        :  activeProducts;
});

</script>

<style scoped>
h2 {
    font-family: 'Novecento Slab Bold';
}

.product-container {
    height: 100%;
    padding: 10px;
}

.verbiage {
    padding: 30px 30px 10px 30px;
}

</style>