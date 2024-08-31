<template>
    <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <h2 class="text-2xl font-semibold text-gray-800 p-6 border-b border-gray-200">
            Shipping Options for Order #{{ orderData.orderId }}
        </h2>
        
        <!-- Service Provider Selection -->
        <div class="p-6 border-b border-gray-200">
            <label for="serviceProvider" class="block text-sm font-medium text-gray-700 mb-2">
                Select Shipping Service Provider
            </label>
            <select
            id="serviceProvider"
            v-model="selectedServiceProvider"
            class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            >
            <option v-for="provider in shippingServiceProviders" :key="provider" :value="provider">
                {{ provider.charAt(0).toUpperCase() + provider.slice(1) }}
            </option>
        </select>
    </div>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
        <p class="text-gray-600 font-medium mb-4">Loading shipping options...</p>
        <div class="animate-pulse flex space-x-4 justify-center">
            <div class="rounded-full bg-indigo-300 h-3 w-3"></div>
            <div class="rounded-full bg-indigo-300 h-3 w-3"></div>
            <div class="rounded-full bg-indigo-300 h-3 w-3"></div>
        </div>
    </div>
    
    <!-- Shipping Options -->
    <div v-else-if="shippingOptions && !fetchedShipmentRates" class="space-y-6 p-6 bg-gray-50">
        <!-- Available Option -->
        <div v-if="shippingOptions.availableOption.boxes?.length" class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Available Option (Multiple Boxes)</h3>
            <ul class="space-y-4">
                <li v-for="(box, boxIndex) in shippingOptions.availableOption.boxes" :key="boxIndex" 
                class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p class="font-medium text-blue-800">Box {{ boxIndex + 1 }}</p>
                <p class="text-sm text-gray-600 mt-1">{{ formatDimensions(box) }}, Weight: {{ box.totalWeight }} lbs</p>
                <ul class="mt-3 space-y-2">
                    <li v-for="(item, itemIndex) in box.items" :key="`${boxIndex}-${itemIndex}`" 
                    class="flex items-center bg-white p-2 rounded">
                    <input type="checkbox" :id="`item-${boxIndex}-${itemIndex}`" 
                    class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
                    <label :for="`item-${boxIndex}-${itemIndex}`" class="ml-2 text-sm text-gray-700">
                        {{ (item.sku || 'N/A').toUpperCase() }} x {{ item.qty }}
                    </label>
                </li>
            </ul>
        </li>
    </ul>
    <p class="mt-4 text-sm text-gray-600">Total Weight: {{ shippingOptions.availableOption.totalWeight }} lbs</p>
    <button @click="fetchShippingRates(shippingOptions.availableOption, 'available')" 
    class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
    Fetch Rates For Available Option
</button>
</div>

<!-- Ideal Option -->
<div class="bg-white p-6 rounded-lg shadow-sm">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Ideal Option (Single Box)</h3>
    <p class="text-sm text-gray-600">Box Dimensions: {{ formatDimensions(shippingOptions.idealOption.boxes[0]) }}</p>
    <p class="text-sm text-gray-600 mt-1">Total Weight: {{ shippingOptions.idealOption.totalWeight }} lbs</p>
    <button @click="fetchShippingRates(shippingOptions.idealOption, 'ideal')" 
    class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
    Fetch Rates For Ideal Option
</button>
</div>
</div>

<!-- Shipping Rates -->
<div v-if="fetchedShipmentRates" class="p-6">
    <button @click="fetchedShipmentRates = null" 
    class="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition duration-200">
    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
    </svg>
    Back to Options
</button>
<ShippingRatesSelection 
:shipment-rates-data="fetchedShipmentRates" 
@purchase-label="handlePurchaseLabel" 
/>
</div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ShippingRatesSelection from './ShippingRatesSelection.vue';
import useShipping from '../composables/useShipping';

const props = defineProps({
    orderShippingAddress: Object,
    orderData: {
        type: Object,
        required: true
    }
});

const { createShipment, getShippingOptions, purchaseLabel } = useShipping();

const shippingServiceProviders = ref(['shippo', 'easyship', 'easypost', 'ship_engine']);
const selectedServiceProvider = ref('shippo');
const shippingOptions = ref(null);
const fetchedShipmentRates = ref(null);
const isLoading = ref(false);

onMounted(async () => {
    try {
        isLoading.value = true;
        const shipmentData = await getShippingOptions(props.orderData.orderItems);
        shippingOptions.value = shipmentData;
    } catch (error) {
        console.error('Error fetching shipping options:', error);
    } finally {
        isLoading.value = false;
    }
});

function formatDimensions(box) {
    return `${box.length}" x ${box.width}" x ${box.height}"`;
}

async function fetchShippingRates(shippingOption, optionName) {
    isLoading.value = true;
    try {
        fetchedShipmentRates.value = await createShipment(
            props.orderShippingAddress,
            shippingOption,
            selectedServiceProvider.value
        );
    } catch (err) {
        console.error(err);
    } finally {
        isLoading.value = false;
    }
}

async function handlePurchaseLabel(rateId) {
    isLoading.value = true;
    try {
        const orderId = props.orderData._id;
        const purchaseLabelResult = await purchaseLabel(orderId, rateId, selectedServiceProvider.value);
        
        if (purchaseLabelResult.success === false) {
            props.orderData.status = purchaseLabelResult.order.status;
            console.error('Error purchasing label:', purchaseLabelResult.message);
            return;
        }
        
        const { updatedOrder } = purchaseLabelResult;
        props.orderData.purchasedLabelUrl = updatedOrder.purchasedLabelUrl;
        props.orderData.trackingUrl = updatedOrder.trackingUrl;
        props.orderData.status = updatedOrder.status;
    } catch (error) {
        console.error('Error handling purchase label:', error);
    } finally {
        isLoading.value = false;
    }
}
</script>