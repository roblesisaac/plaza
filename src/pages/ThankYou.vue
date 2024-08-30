<template>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import useApi from '../composables/useApi';

const { get } = useApi();

const savedOrder = ref(null);

onMounted(async () => {
    savedOrder.value = await get('stripe/save-order');
    console.log(savedOrder.value);
});

</script>