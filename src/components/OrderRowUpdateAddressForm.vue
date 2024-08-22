<template>
<form @submit.prevent="handleAddressChange" class="space-y-4">
    <div>
        <label for="customerName" class="form-label">Customer Name</label>
        <input type="text" id="customerName" v-model="newAddress.customerName" class="form-input">
    </div>
    <div>
        <label for="street" class="form-label">Street</label>
        <input type="text" id="street" v-model="newAddress.street" class="form-input">
    </div>
    <div class="grid grid-cols-2 gap-4">
        <div>
            <label for="city" class="form-label">City</label>
            <input type="text" id="city" v-model="newAddress.city" class="form-input">
        </div>
        <div>
            <label for="state" class="form-label">State</label>
            <input type="text" id="state" v-model="newAddress.state" class="form-input">
        </div>
    </div>
    <div>
        <label for="zipCode" class="form-label">Zip Code</label>
        <input type="text" id="zipCode" v-model="newAddress.zipCode" class="form-input">
    </div>
    <div>
        <label for="email" class="form-label">Email</label>
        <input type="email" id="email" v-model="newAddress.email" class="form-input">
    </div>
    <div>
        <button type="submit" class="submit-button">
            Update Address
        </button>
    </div>
</form>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['address-changed']);
const props = defineProps({
    orderData: Object
});

const newAddress = reactive({
    customerName: props.orderData.shippingAddress.customerName,
    street: props.orderData.shippingAddress.street,
    city: props.orderData.shippingAddress.city,
    state: props.orderData.shippingAddress.state,
    zipCode: props.orderData.shippingAddress.zipCode,
    email: props.orderData.shippingAddress.email
});

const handleAddressChange = () => {
    emit('address-changed', { shippingAddress: { ...newAddress } });
}

</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700;
}

.form-input {
  @apply mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md;
}

.submit-button {
  @apply inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
}
</style>