<template>
<div class="bg-gray-50 p-4 rounded-lg">
    <div class="flex justify-between items-center mb-3">
        <h4 class="text-md font-semibold text-gray-700">Update Order Status</h4>
    </div>
    <div class="flex items-center space-x-4">
        <select 
        v-model="selectedStatus" 
        @change="handleStatusChange"
        class="form-select mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
            <option v-for="status in statuses" :key="status" :value="status">
                {{ status.toUpperCase() }}
            </option>
        </select>
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['status-changed']);
const statuses = ['created', 'on_hold', 'cancelled', 'shipped', 'delivered', 'returned'];

const props = defineProps({
    orderData: Object
});

const selectedStatus = ref(props.orderData.status);

function handleStatusChange() {
  emit('status-changed', { status: selectedStatus.value });
}

</script>