<template>
    <TopNav :State="State" />

    <router-view v-if="!State.showingMenu && userStore.status !== 'NOT_VERIFIED'" />
    <VerifyForm v-if="userStore.status === 'NOT_VERIFIED'" />
    
    <Transition>
        <OffCanvas v-if="State.showingMenu" :State="State" />
    </Transition>
    
    <Footer v-if="!State.showingMenu" />
</template>

<script setup>
import { onMounted, ref } from 'vue';

// Components
import TopNav from './components/TopNav.vue';
import OffCanvas from './components/OffCanvas.vue';
import Footer from './components/Footer.vue';
import VerifyForm from './components/VerifyForm.vue';

// Stores + Composables
import { useUserStore } from './stores/userStore';
import { useCartStore } from './stores/cartStore';
import useDb from './composables/useDb';

const productsDb = useDb('products');
const listingsDb = useDb('listings');
const boxes = useDb('boxes');

const userStore = useUserStore();
const cartStore = useCartStore();

const State = ref({
    showingMenu: false
});

onMounted(async () => {
    try {
        await userStore.checkAuth();
        await productsDb.init();
        await listingsDb.init();
        await cartStore.init();
        await boxes.init();
    } catch (err) {
        console.log(err);
    }
});
</script>
