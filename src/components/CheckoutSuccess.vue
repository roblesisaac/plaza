<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Order Confirmation</h1>
        
        <div class="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
            <div class="flex items-center">
                <svg class="w-12 h-12 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <p>
                    Thank you for your order! Your order has been successfully placed. Updates will be sent to 
                    <span class="font-semibold">{{ createdOrder.contactEmail }}</span>.
                </p>
            </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div class="px-6 py-4">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">Shipping Address</h3>
                        <address class="not-italic">
                            <p class="font-semibold">{{ createdOrder.shippingAddress.customerName }}</p>
                            <p>{{ createdOrder.shippingAddress.street }}</p>
                            <p>{{ createdOrder.shippingAddress.city }}, {{ createdOrder.shippingAddress.state }} {{ createdOrder.shippingAddress.zipCode }}</p>
                            <a :href="`mailto:${createdOrder.shippingAddress.email}`" class="text-blue-600 hover:underline">{{ createdOrder.shippingAddress.email }}</a>
                        </address>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-700 mb-2">Order Summary</h3>
                        <ul class="space-y-2">
                            <li><span class="font-semibold">Order ID:</span> <span id="order-id">{{ createdOrder.orderId }}</span></li>
                            <li><span class="font-semibold">Total Price:</span> ${{ createdOrder.totalPrice }}</li>
                            <li><span class="font-semibold">Shipping Price:</span> ${{ createdOrder.shippingCost.toFixed(2) }}</li>
                            <li><span class="font-semibold">Payment Status:</span> <span class="px-2 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full">{{ createdOrder.paymentStatus }}</span></li>
                            <li><span class="font-semibold">Order Status:</span> <span class="px-2 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">{{ createdOrder.status }}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div class="px-6 py-4">
                <h3 class="text-xl font-semibold text-gray-800 mb-4">Ordered Items</h3>
                <div v-for="item in createdOrder.orderItems" :key="item._id" class="border-b border-gray-200 last:border-b-0 py-4">
                    <div class="flex flex-col md:flex-row justify-between">
                        <div class="mb-4 md:mb-0">
                            <h4 class="text-lg font-semibold text-gray-700">{{ item.title }}</h4>
                            <p class="text-gray-600">Quantity: {{ item.qty }}</p>
                        </div>
                        <div>
                            <ul class="space-y-1">
                                <li v-for="product in item.productsInListing" :key="product.sku" class="text-sm text-gray-600">
                                    SKU: {{ (product.sku || '').toUpperCase() }} (Qty: {{ product.qty }})
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <button @click="goToOrders" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center">
            View My Orders
            <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
        </button>
    </div>
</template>

<script setup>
import { useCheckoutStore } from '../stores/checkoutStore';
import router from '../router';

const { createdOrder, changePage } = useCheckoutStore();


const goToOrders = () => {
    router.push('/my-account');
    changePage(2);
}
</script>

<style scoped>
#order-id {
    text-transform: 'uppercase';
}

.order-confirmation {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

h1.order-title {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.confirmation-message {
    text-align: center;
    font-size: 1.2em;
    margin-bottom: 30px;
    padding: 20px;
    background-color: #e6f7e6;
    border-radius: 5px;
    color: #2c662d;
}

.confirmation-message i {
    font-size: 1.5em;
    margin-right: 10px;
}

.order-details-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    margin-bottom: 20px;
}

h2, h3 {
    margin-bottom: 15px;
    color: #444;
}

address {
    font-style: normal;
    line-height: 1.5;
}

.contact-email {
    color: var(--dark-blue);
    font-weight: bold;
}

.order-summary-list {
    list-style-type: none;
    padding: 0;
}

.order-summary-list li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.status-badge {
    background-color: #e6e6e6;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.9em;
}

.order-item {
    border-bottom: 1px solid #eee;
    padding: 15px 0;
}

.order-item:last-child {
    border-bottom: none;
}

.item-quantity {
    color: #666;
}

.product-list {
    list-style-type: none;
    padding: 0;
    font-size: 0.9em;
    color: #666;
}

a {
    color: #007bff;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.go-to-orders-button {
    width: 100%;
    display: block;
    margin: 20px auto;
    padding: 15px 30px;
    font-size: 1rem;
    font-weight: bold;
    color: #fff;
    background-color: var(--dark-blue);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
}

.go-to-orders-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
}

.go-to-orders-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}
</style>