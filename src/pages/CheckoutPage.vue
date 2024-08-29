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
import { computed, ref } from 'vue';
import { useCheckoutStore } from '../stores/checkoutStore';
import { useUserStore } from '../stores/userStore';

// Components
import CheckoutLoginPromptVue from '../components/CheckoutLoginPrompt.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';

const CheckoutStore = useCheckoutStore();
const UserStore = useUserStore();

CheckoutStore.init();

const params = new URLSearchParams(window.location.search);
const loginSuccess = ref(params.get('session_id'));

const isLoading = computed(() => UserStore.isLoading.value);

</script>
