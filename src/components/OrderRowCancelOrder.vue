<template>
<div class="bg-white p-4 rounded-lg shadow">
    <h4 class="text-lg font-semibold text-gray-800 mb-4">Cancel Order #{{ orderData.orderId }}</h4>
    <p class="text-sm text-gray-600 mb-4">
        Are you sure you want to cancel this order? This action cannot be undone.
    </p>
    <div class="mb-4">
        <label for="cancelReason" class="block text-sm font-medium text-gray-700 mb-2">
            Reason for Cancellation
        </label>
        <select
            id="cancelReason"
            v-model="cancelReason"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <option value="">Select a reason</option>
            <option value="Changed mind">Changed mind</option>
            <option value="Found better price elsewhere">Found better price elsewhere</option>
            <option value="Ordered by mistake">Ordered by mistake</option>
            <option value="Shipping takes too long">Shipping takes too long</option>
            <option value="Other">Other</option>
        </select>
    </div>
    <div v-if="cancelReason === 'Other'" class="mb-4">
        <label for="otherReason" class="block text-sm font-medium text-gray-700 mb-2">
            Please specify (optional)
        </label>
        <textarea
        id="otherReason"
        v-model="otherReason"
        rows="3"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your reason for cancellation"
        ></textarea>
    </div>
    <div class="flex justify-end space-x-4">
        <button
        @click="cancelOrderHandler"
        class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
        :disabled="isLoading || !isValidReason"
        >
            {{ isLoading ? 'Cancelling...' : 'Confirm Cancel' }}
        </button>
        <button
        @click="$emit('close')"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
        >
        Nevermind
        </button>
    </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import useOrders from '../composables/useOrders';

const { cancelOrder } = useOrders();

const props = defineProps({
    orderData: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['order-cancelled', 'close']);

const isLoading = ref(false);
const cancelReason = ref('');
const otherReason = ref('');

const isValidReason = computed(() => {
    return cancelReason.value !== '' && (cancelReason.value !== 'Other' || otherReason.value.trim() !== '');
});

const cancelOrderHandler = async () => {
    if (isLoading.value || !isValidReason.value) return;
    
    isLoading.value = true;
    try {
        const cancellationReason = cancelReason.value === 'Other' ? otherReason.value : cancelReason.value;
        const cancelledOrder = await cancelOrder(props.orderData.orderId, cancellationReason);

        console.log(cancelledOrder);

        props.orderData.status = cancelledOrder.status;
        props.orderData.paymentStatus = cancelledOrder.paymentStatus;
        emit('close');
    } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
    } finally {
        isLoading.value = false;
    }
};
</script>