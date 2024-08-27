<template>
<div class="q-grid cart-page-container">
    <div v-if="screen.isLessThan('medium')" class="q-cell-1">
        <CartVue />
    </div>
    <div v-else class="q-cell-1">
        <div class="q-grid">
            <div class="q-cell-10"></div>
            <div class="q-cell-80"><CartVue /></div>
            <div class="q-cell-10"></div>
        </div>
    </div>
</div>

</template>

<script setup>
import CartVue from '../components/Cart.vue';
import useScreen from '../composables/useScreen';

const screen = useScreen();

</script>

<style scoped>
.cart-page-container {
    background: #ededed;
}
</style>