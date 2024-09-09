<template>
  <div class="bg-white shadow-md rounded-lg p-6 space-y-6">
    <!-- Payment Status -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800">Payment Status</h3>
      <span :class="['px-3 py-1 rounded-full text-sm font-medium uppercase', statusClass]">
        {{ orderData.paymentStatus }}
      </span>
    </div>
    
    <!-- Order Details -->
    <div class="bg-gray-50 rounded-md p-4">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Amount:</span>
        <span class="font-medium">${{ orderData.totalPrice }}</span>
      </div>
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
          Capture Payment
        </button>
      </Transition>
      
      <!-- Cancel Payment -->
      <Transition>
        <button
          v-if="orderData.paymentStatus === 'upaid'"
          @click="handleCancelPayment"
          class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center"
        >
          <XCircle class="w-5 h-5 mr-2" />
          Cancel Payment
        </button>
      </Transition>

      <!-- Refund -->
      <Transition>
        <div v-if="['captured', 'partially_refunded'].includes(orderData.paymentStatus)" class="space-y-2">
          <div class="flex space-x-2">
            <div class="relative flex-grow">
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
              class="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center"
            >
              <RefreshCcw class="w-5 h-5 mr-2" />
              Refund
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
import useOrders from '../composables/useOrders'

const props = defineProps({
  orderData: {
    type: Object,
    required: true
  },
})

const { captureOrder, refundOrder } = useOrders()
const refundAmount = ref(0)

const statusClass = computed(() => {
  const { paymentStatus } = props.orderData || {};
  
  if(!paymentStatus) {
    return '';
  }

  const normalizedStatus = paymentStatus.toLowerCase().trim()
  const classMap = {
    'unpaid': 'bg-red-100 text-red-800',
    'captured': 'bg-green-100 text-green-800',
    'voided': 'bg-yellow-100 text-yellow-800',
    'failed': 'bg-red-100 text-red-800',
    'partially_refunded': 'bg-blue-100 text-blue-800',
    'refunded': 'bg-orange-100 text-gray-800'
  }

  return classMap[normalizedStatus] || '';
})

async function handleCaptureOrderPayment() {
  try {
    const capturedOrder = await captureOrder(props.orderData);
    props.orderData.paymentStatus = capturedOrder.paymentStatus;
    props.orderData.status = capturedOrder.status;
  } catch (err) {
    console.error(err)
    // TODO: Add error handling, e.g., show an error message to the user
  }
}

function handleCancelPayment() {
  console.log('TODO: Implement cancel payment functionality')
  // TODO: Implement the cancel payment logic
}

async function handleRefundOrder() {
  try {
    const { paymentTransactionId } = props.orderData
    const amountToRefund = refundAmount.value > 0 ? refundAmount.value : null
    const refundResult = await refundOrder(paymentTransactionId, amountToRefund)
    console.log({ refundResult })
    // TODO: Update the UI to reflect the refund status
    // For example:
    // props.orderData.paymentStatus = refundResult.newStatus
    // refundAmount.value = 0
  } catch (err) {
    console.error(err)
    // TODO: Add error handling, e.g., show an error message to the user
  }
}
</script>