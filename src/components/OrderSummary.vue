<template>
<div class="q-grid">
    <div class="q-cell-1">
        {{ orderData }}
    </div>
</div>
</template>

<script setup>

const props = defineProps({
    orderData: Object
});

</script>