<template>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-[60]">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="bg-indigo-600 text-white pl-6 py-4 flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Shipping Options for Order #{{ orderData.orderId }}
          </h2>
          <button @click="$emit('close')" class="text-white hover:text-indigo-200">
            <X />
          </button>
        </div>
  
        <!-- Content -->
        <div class="flex-grow overflow-y-auto">
          <!-- Step 1: Service Provider Selection -->
          <div v-if="currentStep === 1" class="p-6 space-y-4">
            <label for="serviceProvider" class="block text-sm font-medium text-gray-700">
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
  
          <!-- Step 2: Shipping Options -->
          <div v-else-if="currentStep === 2" class="p-6 space-y-6">
            <div v-if="isLoading" class="text-center py-12">
              <p class="text-gray-600 font-medium mb-4">Loading shipping options...</p>
              <div class="animate-pulse flex space-x-4 justify-center">
                <div class="rounded-full bg-indigo-300 h-3 w-3"></div>
                <div class="rounded-full bg-indigo-300 h-3 w-3"></div>
                <div class="rounded-full bg-indigo-300 h-3 w-3"></div>
              </div>
            </div>
  
            <template v-else-if="shippingOptions">
              <!-- Available Option -->
              <div v-if="shippingOptions.availableOption.boxes?.length" class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Available Option (Multiple Boxes)</h3>
                <ul class="space-y-4">
                  <li v-for="(box, boxIndex) in shippingOptions.availableOption.boxes" :key="boxIndex" 
                    class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <p class="font-medium text-gray-800">Box {{ boxIndex + 1 }}</p>
                    <p class="text-sm text-gray-600 mt-1">{{ formatDimensions(box) }}, Weight: {{ box.totalWeight }} lbs</p>
                    <ul class="mt-3 space-y-2">
                      <li v-for="(item, itemIndex) in box.items" :key="`${boxIndex}-${itemIndex}`" 
                        class="flex items-center bg-gray-50 p-2 rounded">
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
              <div class="bg-gray-50 p-6 rounded-lg">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Ideal Option (Single Box)</h3>
                <p class="text-sm text-gray-600">Box Dimensions: {{ formatDimensions(shippingOptions.idealOption.boxes[0]) }}</p>
                <p class="text-sm text-gray-600 mt-1">Total Weight: {{ shippingOptions.idealOption.totalWeight }} lbs</p>
                <button @click="fetchShippingRates(shippingOptions.idealOption, 'ideal')" 
                  class="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  Fetch Rates For Ideal Option
                </button>
              </div>
            </template>
          </div>
  
          <!-- Step 3: Shipping Rates -->
          <div v-else-if="currentStep === 3" class="p-6">
            <ShippingRatesSelection 
              :orderData="orderData"
              :shipment-rates-data="fetchedShipmentRates" 
              :selectedServiceProvider="selectedServiceProvider"
              @purchased-label="emit('close')" 
            />
          </div>
        </div>
  
        <!-- Footer -->
        <div class="bg-gray-100 px-6 py-4 flex justify-between items-center">
          <button 
            v-if="currentStep > 1" 
            @click="currentStep--" 
            class="text-indigo-600 hover:text-indigo-800 transition duration-200 flex items-center"
          >
            <ArrowLeft />
            Back
          </button>
          <button 
            v-if="currentStep < 3" 
            @click="currentStep++" 
            class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue';
  import ShippingRatesSelection from './ShippingRatesSelection.vue';
  import { X, ArrowLeft } from 'lucide-vue-next';
  import useShipping from '../composables/useShipping';
  
  const props = defineProps({
    orderData: {
      type: Object,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  
  const { createShipment, getShippingOptions } = useShipping();
  
  const shippingServiceProviders = ref(['shippo', 'easyship', 'easypost', 'ship_engine']);
  const selectedServiceProvider = ref('shippo');
  const shippingOptions = ref(null);
  const fetchedShipmentRates = ref(null);
  const isLoading = ref(false);
  const currentStep = ref(1);
  
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
        props.orderData.shippingAddress,
        shippingOption,
        selectedServiceProvider.value
      );
      currentStep.value = 3;
    } catch (err) {
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }
</script>