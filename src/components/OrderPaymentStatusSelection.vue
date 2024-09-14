<template>
    <select @click.stop
        v-model="orderData.paymentStatus" 
        @change="handleStatusChange"
        :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(selectedStatus)]"
        >
        <option v-for="status in statuses" :key="status" :value="status">
            {{ status.toUpperCase() }}
        </option>
    </select>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    orderData: Object,
    status: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['payment-status-changed']);

const statuses = ['unpaid', 'failed', 'paid', 'captured', 'voided', 'refunded', 'partially_refunded'];
const selectedStatus = computed(() => {
    return props.orderData.paymentStatus;
});

function handleStatusChange() {
    emit('payment-status-changed', selectedStatus.value);
}

function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    return {
        'bg-yellow-100 text-yellow-800': statusLower === 'unpaid',
        'bg-orange-100 text-orange-800': statusLower === 'failed',
        'bg-green-200 text-green-900': statusLower === 'paid',
        'bg-green-100 text-green-800': statusLower === 'captured',
        'bg-red-100 text-red-800': statusLower === 'voided',
        'bg-blue-100 text-blue-800': statusLower === 'refunded',
        'bg-gray-100 text-gray-800': statusLower === 'partially_refunded'
    };
}
</script>