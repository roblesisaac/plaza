<template>
<div class="q-grid">
    <div v-for="box in boxes.items" :key="box._id" class="q-cell-1">
        <BoxItemVue :box="box" />
    </div>
</div>
</template>

<script setup>
import BoxItemVue from './BoxItem.vue';
import { useBoxStore } from '../stores/boxStore';

const boxes = useBoxStore();

boxes.fetchAllBoxes();

</script>