<template>
    <div v-if="notifications.length" class="fixed bottom-4 right-4 z-50 space-y-2">
        <div
        v-for="notification in notifications"
        :key="notification.messageId"
        :class="[
        'p-4 rounded-lg shadow-lg flex items-center justify-between',
        notification.type === 'ERROR' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        ]"
        >
        <div class="flex items-center">
            <AlertCircle v-if="notification.type === 'ERROR'" class="w-5 h-5 mr-2" />
            <BellRing v-else class="w-5 h-5 mr-2" />
            <span>{{ notification.message }}</span>
        </div>
        <button
        @click="removeNotifcation(notification.messageId)"
        class="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
        <X class="w-5 h-5" />
    </button>
</div>
</div>
</template>

<script setup>
import { AlertCircle, BellRing, X } from 'lucide-vue-next';
import useApi from '../composables/useApi';

const { notifications, removeNotifcation } = useApi();
</script>