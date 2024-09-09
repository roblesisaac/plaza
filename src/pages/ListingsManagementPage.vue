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
            <button v-if="!showForm" @click="showForm = true" class="toggle">Show Form <ChevronDown /></button>
            <button v-else @click="showForm = false" class="toggle">Hide Form <ChevronUp /></button>
        </div>
    
        <!-- Form -->
        <Transition>
        <div v-if="showForm" class="q-cell-1">
            <ListingsItemFormVue />
        </div>
        </Transition>
    
        <!-- Fetched Items -->
        <Transition>
        <div v-if="!collection.isLoading" class="q-cell-1">
            <ListingsItemRowVue v-for="listing in collection.items" :key="listing._id" :listing="listing" />
        </div>
        </Transition>
    
        <!-- Static Items -->
        <Transition>
        <div v-if="unsavedStaticListings.length && !collection.isLoading" class="q-cell-1">
            <h1 class="title">Static Listings</h1>
            <ListingsItemRowVue v-for="listing in unsavedStaticListings" :key="listing.title" :listing="listing" />
        </div>
        </Transition>
    
    </div>
    </template>
    
    <script setup>
    import { computed, ref } from 'vue';
    
    // Components
    import ListingsItemFormVue from '../components/ListingsItemForm.vue';
    import ListingsItemRowVue from '../components/ListingsItemRow.vue';
    import LoadingDotsVue from '../components/LoadingDots.vue';
    import { ChevronUp, ChevronDown } from 'lucide-vue-next';
    

    // Composables
    import useDb from '../composables/useDb';
    import staticListings from '../staticDb/listingsDb';
    
    const listingsDb = useDb('listings');
    const collection = listingsDb.getCollection();
    
    const showForm = ref(false);
    
    listingsDb.init();
    
    const unsavedStaticListings = computed(() => {
        return staticListings.filter(listing => !collection.items.some(item => item.title === listing.title));
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