<template>
    <div class="q-grid">
      <div class="q-cell-1 notifications-container">
        <div v-for="message in checkoutStore.notifications" class="q-grid notification-wrapper">
          <div class="q-cell-1 notification">
            {{ message.message }} 
            <CloseButtonVue @click="checkoutStore.removeNotifcation(message.messageId)" class="close-button" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCheckoutStore } from '../stores/checkoutStore';
  import CloseButtonVue from 'vue-material-design-icons/CloseCircle.vue';
  
  const checkoutStore = useCheckoutStore();
  </script>
  
  <style scoped>
  .notification-wrapper {
    padding: 0 10px 10px 10px;
  }
  
  .notification {
    background: var(--dark-red);
    width: 100%;
    color: #fff;
    font-weight: bold;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    position: relative;
  }
  
  .close-button {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
  </style>
  