<template>
    <div v-if="orderData.refunds?.length > 0" class="border-t border-gray-200 pt-4">
        <h4 class="text-md font-semibold text-gray-700 mb-2 flex items-center">
            <RefreshCcw class="w-5 h-5 mr-2 text-yellow-500" />
            Previous Refunds
        </h4>
        <ul class="space-y-2">
            <li v-for="(refund, index) in orderData.refunds" :key="index" class="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <span class="text-sm text-gray-600">
                    Refund
                    <span v-if="orderData.refunds.length > 1" class="ml-1 text-gray-800">#{{ index + 1 }}</span>
                </span>
                <span class="font-medium text-gray-800">${{ (refund || 0).toFixed(2) }}</span>
            </li>
        </ul>
        <p v-if="orderData.refunds.length > 1" class="text-sm text-gray-500 mt-2">
            Total Refunded: ${{ totalRefunded.toFixed(2) }}
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { RefreshCcw } from 'lucide-vue-next'   

const props = defineProps({
    orderData: Object
});

const totalRefunded = computed(() => {
    if(!props.orderData.refunds?.length) {
        return 0
    }
    
    const sum = props.orderData.refunds.reduce((acc, refund) => acc + (Number(refund) || 0), 0);  
    return parseFloat(sum.toFixed(2));
})
</script>