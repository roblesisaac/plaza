<template>
  <div class="bg-white shadow-md rounded-lg p-6 space-y-6">
    <!-- Payment Status -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800">Payment Status</h3>
      <OrderPaymentStatusSelection @payment-status-changed="handleStatusChange" :orderData="orderData" />
    </div>

    <!-- Previous Refunds -->
    <div v-if="orderData.refunds && orderData.refunds.length > 0" class="border-t border-gray-200 pt-4">
      <h4 class="text-md font-semibold text-gray-700 mb-2 flex items-center">
        <RefreshCcw class="w-5 h-5 mr-2 text-yellow-500" />
        Previous Refunds
      </h4>
      <ul class="space-y-2">
        <li v-for="(refund, index) in orderData.refunds" :key="index" class="flex items-center justify-between bg-gray-50 p-2 rounded-md">
          <span class="text-sm text-gray-600">Refund #{{ index + 1 }}</span>
          <span class="font-medium text-gray-800">${{ (refund || 0).toFixed(2) }}</span>
        </li>
      </ul>
      <p class="text-sm text-gray-500 mt-2">
        Total Refunded: ${{ totalRefunded.toFixed(2) }}
      </p>
    </div>

    <!-- Action Buttons -->
    <div class="space-y-4">
      <!-- Capture Payment -->
      <Transition>
        <button
          v-if="orderData.paymentStatus === 'unpaid'"
          @click="handleCaptureOrderPayment"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          <DollarSign class="w-5 h-5 mr-2" />
          Capture Payment <LoadingDots v-if="isLoading" />
        </button>
      </Transition>
      
      <!-- Cancel Payment -->
      <Transition>
        <button
          v-if="orderData.paymentStatus === 'unpaid'"
          @click="handleCancelPayment"
          class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          <XCircle class="w-5 h-5 mr-2" />
          Cancel Payment
        </button>
      </Transition>

      <!-- Refund -->
      <Transition>
        <div v-if="!['failed', 'unpaid'].includes(orderData.paymentStatus)" class="space-y-2">
          <div class="flex space-x-2">
            <div class="relative flex-grow">
              <DollarSign class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                v-model="refundAmount"
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Refund Amount"
                step="0.01"
              />
            </div>
            <button
              @click="handleRefundOrder"
              class="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md flex items-center"
            >
              <RefreshCcw class="w-5 h-5 mr-2" />
              Refund <LoadingDots v-if="isLoading" />
            </button>
          </div>
          <p class="text-sm text-gray-600">
            Enter amount to partially refund, or leave blank for full refund.
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DollarSign, XCircle, RefreshCcw } from 'lucide-vue-next'
import LoadingDots from './LoadingDots.vue'
import useOrders from '../composables/useOrders'
import OrderPaymentStatusSelection from './OrderPaymentStatusSelection.vue'
import useApi from '../composables/useApi'

const emit = defineEmits(['payment-status-changed']);

const props = defineProps({
  orderData: {
    type: Object,
    required: true
  },
})

const { captureOrder, refundOrder } = useOrders()
const { notify } = useApi()

const isLoading = ref(false)
const refundAmount = ref(0)

const totalRefunded = computed(() => {
  return props.orderData.refunds ? props.orderData.refunds.reduce((sum, refund) => sum + ( refund || 0 ), 0) : 0
})

function handleStatusChange(newStatus) {
  emit('payment-status-changed', newStatus)
}

async function handleCaptureOrderPayment() {
  isLoading.value = true;
  try {
    const capturedOrder = await captureOrder(props.orderData);
    props.orderData.paymentStatus = capturedOrder.paymentStatus;
    props.orderData.status = capturedOrder.status;
  } catch (err) {
    notify(err);
  } finally {
    isLoading.value = false;
  }
}

function handleCancelPayment() {
  console.log('TODO: Implement cancel payment functionality')
  // TODO: Implement the cancel payment logic
}

async function handleRefundOrder() {
  isLoading.value = true;
  try {
    const refundResult = await refundOrder(props.orderData, refundAmount.value);
    props.orderData.paymentStatus = refundResult.paymentStatus;
    props.orderData.refunds = refundResult.refunds;
    refundAmount.value = 0
  } catch (err) {
    notify(err);
  } finally {
    isLoading.value = false;
  }
}

</script>