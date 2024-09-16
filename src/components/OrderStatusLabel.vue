<template>
<div>
    <div v-if="isAdmin" class="relative inline-block w-full">
      <select
        @click.stop
        v-model="selectedStatus"
        @change="handleStatusChange"
        :class="[
            'appearance-none w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5', 
            getStatusClass(selectedStatus)
        ]"
        >
        <option v-for="status in statuses" :key="status" :value="status">
            {{ status.toUpperCase() }}
        </option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <span 
        v-else
        :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(status)]"
        >
        {{ status.toUpperCase() }}
    </span>
</div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '../stores/userStore';

const props = defineProps({
    status: {
        type: String,
        required: true
    }
});

const emit = defineEmits(['status-changed']);

const userStore = useUserStore();
const isAdmin = computed(() => userStore.isAdmin);

const statuses = ['created', 'on_hold', 'processing', 'cancelled', 'shipped', 'delivered', 'returned'];
const selectedStatus = ref(props.status);

function handleStatusChange() {
    emit('status-changed', selectedStatus.value);
}

function getStatusClass(status) {
    const statusLower = status.toLowerCase();
    return {
        'bg-yellow-100 text-yellow-800': statusLower === 'created',
        'bg-orange-100 text-orange-800': statusLower === 'on_hold',
        'bg-green-200 text-green-900': statusLower === 'processing',
        'bg-red-100 text-red-800': statusLower === 'cancelled',
        'bg-blue-100 text-blue-800': statusLower === 'shipped',
        'bg-green-100 text-green-800': statusLower === 'delivered',
        'bg-gray-100 text-gray-800': statusLower === 'returned',
    };
}
</script>