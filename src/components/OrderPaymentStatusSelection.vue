<template>
    <div class="relative inline-block w-full">
      <select
        @click.stop
        v-model="orderData.paymentStatus"
        @change="handleStatusChange"
        class="appearance-none w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5"
        :class="getStatusClass(selectedStatus)"
      >
        <option v-for="status in statuses" :key="status" :value="status">
          {{ status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
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
  const selectedStatus = computed(() => props.orderData.paymentStatus);
  
  function handleStatusChange() {
    emit('payment-status-changed', selectedStatus.value);
  }

  function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    const baseClasses = 'font-medium';
    const statusClasses = {
        'unpaid': 'bg-yellow-100 text-yellow-800',
        'failed': 'bg-orange-100 text-orange-800',
        'paid': 'bg-green-200 text-green-900',
        'captured': 'bg-green-100 text-green-800',
        'voided': 'bg-red-100 text-red-800',
        'refunded': 'bg-blue-100 text-blue-800',
        'partially_refunded': 'bg-gray-100 text-gray-800'
    };

    return `${baseClasses} ${statusClasses[statusLower] || 'text-gray-800'}`;
}
  </script>