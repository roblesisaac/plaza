<template>
    <div @click.stop>
        <select 
        v-if="isAdmin"
        v-model="selectedStatus" 
        @change="handleStatusChange"
        :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(selectedStatus)]"
        >
        <option v-for="status in statuses" :key="status" :value="status">
            {{ status.toUpperCase() }}
        </option>
    </select>
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