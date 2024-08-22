<template>
  <div class="container mx-auto bg-gray-100 px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">My Account</h1>
    
    <!-- Account Control Box -->
    <div class="bg-white shadow-md rounded-lg p-6 mb-8 border border-gray-200">
      <AccountControlBoxVue />
    </div>
    
    <!-- Orders -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Recent Orders</h2>
        <button class="text-blue-600 hover:text-blue-800 font-medium">See All</button>
      </div>
      
      <!-- If No Orders Yet -->
      <div v-if="orderItems.length === 0" class="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-200">
        <p class="text-gray-600 mb-4">You have no orders yet.</p>
        <router-link 
          to="products" 
          class="inline-block bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Shop Now »
        </router-link>
      </div>
      
      <!-- Orders List -->
      <div v-else class="space-y-4">
        <OrderRowVue 
          v-for="orderData in orderItems" 
          :key="orderData._id" 
          :orderData="orderData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import OrderRowVue from '../components/OrderRow.vue';
import AccountControlBoxVue from '../components/AccountControlBox.vue';

import { useUserStore } from '../stores/userStore';
import useOrders from '../composables/useOrders';

const { orderItems, getOrders } = useOrders();

async function fetchOrders() {
  try {
    const orderEnpoint = useUserStore().isAdmin ? 'all-orders' : 'orders';
    await getOrders(orderEnpoint);
  } catch (err) {
    throw err;
  }
}

onMounted(fetchOrders);
</script>

<style scoped>
.account-control-box-container {
  padding-bottom: 20px;
}

.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.no-orders {
  text-align: center;
  padding: 40px;
  background-color: #f8f8f8;
  font-size: 1.2em;
  color: #777;
  border-radius: 30px;
}

.see-all {
  background: transparent;
  color: var(--dark-blue);
  width: 100%;
  font-weight: bold;
}
</style>