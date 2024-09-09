<template>
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <!-- Loading screen -->
      <div v-if="isLoading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
          <p class="text-lg font-semibold text-gray-700">Loading your order details...</p>
        </div>
      </div>
  
      <!-- Order confirmation content -->
      <div v-else-if="order" class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">Order Confirmation</h1>
  
        <!-- Success message -->
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 mb-8 rounded-lg shadow-md">
          <div class="flex items-center">            
            <CircleCheck class="w-20 h-20 mr-4 text-white fill-green-500" />
            <div>
              <p class="text-lg font-semibold mb-1">Thank you for your order!</p>
              <p>Your order has been successfully placed. Updates will be sent to 
                <span class="font-bold">{{ order.shippingAddress.email }}</span>.
              </p>
            </div>
          </div>
        </div>
  
        <!-- Order details -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div class="px-6 py-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Order Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

                <!-- Shipping -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Shipping Address</h3>
                    <address class="not-italic text-gray-600">
                    <p class="font-semibold">{{ order.shippingAddress.customerName }}</p>
                    <p>{{ order.shippingAddress.street }}</p>
                    <!-- <p v-if="order.stripeSession.shipping_details.address.line2">{{ order.stripeSession.shipping_details.address.line2 }}</p> -->
                    <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
                    <p>US</p>
                    <a :href="`mailto:${order.shippingAddress.email}`" class="text-blue-600 hover:underline mt-2 inline-block">{{ order.shippingAddress.email }}</a>
                    </address>
                </div>

                <!-- Order Details -->
                <div>
                    <h3 class="text-lg font-semibold text-gray-700 mb-4">Order Summary</h3>
                    <ul class="space-y-3 text-gray-600">
                    <li class="flex justify-between"><span class="font-medium">Order ID:</span> <span id="order-id" class="font-semibold">{{ order.orderId }}</span></li>
                    <li class="flex justify-between"><span class="font-medium">Total Price:</span> <span class="font-semibold">${{ order.totalPrice }}</span></li>
                    <li class="flex justify-between"><span class="font-medium">Shipping Cost:</span> <span class="font-semibold">${{ order.shippingCost.toFixed(2) }}</span></li>
                    <li class="flex justify-between items-center">
                        <span class="font-medium">Order Status:</span> 
                        <span class="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">{{ order.status.toUpperCase() }}</span>
                    </li>
                    </ul>
                </div>
            </div>
          </div>
        </div>
  
        <!-- Ordered items -->
        <div class="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div class="px-6 py-8">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Ordered Items</h3>
            <div v-for="item in order.stripeSession.line_items.data" :key="item.id" class="border-b border-gray-200 last:border-b-0 py-4">
              <div class="flex flex-col md:flex-row justify-between">
                <div class="mb-4 md:mb-0 md:text-left">
                  <h4 class="text-lg font-semibold text-gray-700">{{ item.description }}</h4>
                  <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="text-gray-700 font-semibold">
                  ${{ (item.amount_total / 100).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- View orders button -->
        <button v-if="userStore.isLoggedIn" @click="goToOrders" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg">
          View My Orders
          <ArrowRight />
        </button>
        <button v-else @click="router.push('/')" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition duration-300 flex items-center justify-center text-lg">
          Continue Shopping
          <ArrowRight />
        </button>

      </div>

      <div v-else class="flex items-center justify-center z-50">
        <div class="bg-white p-8 flex flex-col items-center">
          <p class="text-lg font-semibold text-gray-700">No Order Data</p>
        </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useCartStore } from '../stores/cartStore';
  import { useUserStore } from '../stores/userStore';
  import useApi from '../composables/useApi';
  import router from '../router';

  import { ArrowRight, CircleCheck } from 'lucide-vue-next';
  
  const isLoading = ref(true);
  const order = ref(null);
  const userStore = useUserStore();
  const cartStore = useCartStore();
  
  const goToOrders = () => {
    router.push('/my-account');
  }
  
  const { post } = useApi();

  watch(() => cartStore.isLoading, async () => {
    if(cartStore.isLoading) {
      return;
    }

    await saveStripeOrder();
  });

  async function saveStripeOrder() {
    try {
      const response = await post('orders/checkout', {
        orderItems: cartStore.items
      });
      order.value = response;
      cartStore.clearCart({ force: true });
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      isLoading.value = false;
    }
  }
  </script>