<template>
    <div class="relative flex items-center py-5">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="flex-shrink mx-4 text-gray-600 text-sm">{{ text }}</span>
        <div class="flex-grow border-t border-gray-300"></div>
    </div>
</template>

<script setup>
const props = defineProps({
    text: String
})
</script>