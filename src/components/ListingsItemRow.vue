<template>
    <div class="q-grid">
        <!-- When Not Editing -->
        <div class="q-cell-1 static-data-container">
            <div class="q-grid middle">
    
                <!-- Listing Text -->
                <div class="q-cell-90 listing-text">
                    <b class="listing-title">{{ listingData.title }} - {{ listingData.line }}</b>
                    <br>
                    <span class="listing-metadata">{{ listingData.status }} - {{ formatAsPrice(listingData.price) }}</span>
                </div>
    
                <!-- Edit Button -->
                <div class="q-cell-10 left">
                    <button @click="editing=!editing" class="action-dots"><DotsVue /></button>
                </div>
                
            </div>
        </div>
    
        <!-- When Editing -->
        <Transition>
        <div v-if="editing" class="q-cell-1 editing-container">
            <ListingItemFormVue :listingData="listingData" />
        </div>
        </Transition>
    </div>
    </template>
    
    <script setup>
    import { ref } from 'vue';
    import { formatAsPrice } from '../utils/formats';
    
    // Components
    import DotsVue from 'vue-material-design-icons/DotsVerticalCircleOutline.vue';
    import ListingItemFormVue from './ListingsItemForm.vue';
    
    const props = defineProps({
        listing: Object
    });
    
    const listingData = ref({ ...props.listing });
    const editing = ref(false);
    
    </script>
    
    <style scoped>
    .action-dots {
        background: transparent;
        color: var(--darkest-blue);
    }
    
    .editing-container {
        background: var(--lightest-blue);
    }
    
    .listing-metadata {
        font-size: 0.9rem;
        color: #444;
        text-transform: capitalize;
    }
    
    .listing-text {
        padding-left: 20px;
    }
    
    .listing-title {
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