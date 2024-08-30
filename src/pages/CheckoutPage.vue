<template>
    <div class="flex flex-wrap items-center justify-center checkout-container">
        <!-- If Loading -->
        <Transition>
            <div v-if="isLoading" class="flex flex-col items-center justify-center h-[80vh] text-center">
                <h3>
                    Loading <LoadingDotsVue />
                </h3>
            </div>
        </Transition>

        <h1>{{ loginSuccess }}</h1>
        
        <Transition>
            <div v-if="UserStore.isLoggedOut && !isLoading" class="q-cell-1">
                <CheckoutLoginPromptVue />
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useCheckoutStore } from '../stores/checkoutStore';
import { useUserStore } from '../stores/userStore';
import useApi from '../composables/useApi';

// Components
import CheckoutLoginPromptVue from '../components/CheckoutLoginPrompt.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';

const CheckoutStore = useCheckoutStore();
const UserStore = useUserStore();
const { get } = useApi();

const savedOrder = ref(null);

console.log('CheckoutStore', CheckoutStore);

CheckoutStore.init();

const isLoading = computed(() => UserStore.isLoading.value);

onMounted(async () => {
    savedOrder.value = await get('stripe/session-order');
    console.log(savedOrder.value);
});

</script>
