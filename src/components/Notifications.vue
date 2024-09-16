<template>
  <div v-if="notifications.length" class="fixed bottom-4 right-4 z-[900] space-y-2 w-full max-w-[80%] sm:max-w-md">
    <div
      v-for="notification in notifications"
      :key="notification.messageId"
      :class="[
        'pl-4 py-4 rounded-lg shadow-lg flex items-center',
        notification.type === 'ERROR' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      ]"
    >
      <div class="flex-shrink-0 mr-3">
        <AlertCircle v-if="notification.type === 'ERROR'" class="w-6 h-6" />
        <BellRing v-else class="w-6 h-6" />
      </div>
      <div class="flex-grow mr-2">
        <p class="text-sm">{{ notification.message }}</p>
      </div>
      <button
        @click="removeNotification(notification.messageId)"
        class="flex-shrink-0 ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { AlertCircle, BellRing, X } from 'lucide-vue-next';
import useApi from '../composables/useApi';

const { notifications, removeNotification } = useApi();
</script>