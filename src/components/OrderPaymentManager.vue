<template>
    <div class="bg-white shadow-md rounded-lg p-6 space-y-6">
      <!-- Payment Status -->
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">Payment Status</h3>
        <span
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium',
            {
              'bg-green-100 text-green-800': orderData.paymentStatus === 'CAPTURED',
              'bg-yellow-100 text-yellow-800': orderData.paymentStatus === 'AUTHORIZED',
              'bg-red-100 text-red-800': orderData.paymentStatus === 'FAILED',
              'bg-gray-100 text-gray-800': orderData.paymentStatus === 'PENDING',
              'bg-blue-100 text-blue-800': orderData.paymentStatus === 'VOIDED',
              'bg-orange-100 text-gray-800': orderData.paymentStatus === 'REFUNDED',
            }
          ]"
        >
          {{ orderData.paymentStatus }}
        </span>
      </div>
      
      <!-- Action Buttons -->
      <div class="space-y-4">
        <!-- Capture Payment -->
        <TransitionRoot as="template" :show="orderData.paymentStatus !== 'CAPTURED'">
          <button
            @click="handleCaptureOrderPayment"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Capture ${{ orderData.totalPrice }} Payment
          </button>
        </TransitionRoot>
        
        <!-- Cancel Payment -->
        <TransitionRoot as="template" :show="orderData.paymentStatus === 'AUTHORIZED'">
          <button
            @click="handleCancelPayment"
            class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Cancel Payment
          </button>
        </TransitionRoot>
  
        <!-- Refund -->
        <TransitionRoot as="template" :show="['CAPTURED', 'PARTIALLY_REFUNDED'].includes(orderData.paymentStatus)">
          <div class="space-y-2">
            <div class="flex space-x-2">
              <input
                type="number"
                v-model="refundAmount"
                class="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Refund Amount"
              />
              <button
                @click="handleRefundOrder"
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Refund
              </button>
            </div>
            <p class="text-sm text-gray-600">
              Enter amount to partially refund, or leave blank for full refund.
            </p>
          </div>
        </TransitionRoot>
      </div>
    </div>
  </template>

<script setup>
import { ref } from 'vue'
import { TransitionRoot } from '@headlessui/vue'
import useOrders from '../composables/useOrders'

const props = defineProps({
    orderData: Object,
})

const { captureOrderPayment, refundOrder } = useOrders()
const refundAmount = ref(0)

async function handleCaptureOrderPayment() {
    try {
        const { paymentTransactionId, _id: orderId, userid } = props.orderData
        const { updatedOrder } = await captureOrderPayment(paymentTransactionId, orderId, userid);
        props.orderData.paymentStatus = updatedOrder.paymentStatus
    } catch (err) {
        console.error(err)
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
    } catch (err) {
        console.error(err)
    }
}
</script>