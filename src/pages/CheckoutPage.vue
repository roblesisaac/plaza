<template>
<div class="q-gridf lex flex-wrap items-center justify-center checkout-container">
    <!-- If Loading -->
    <Transition>
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-[80vh] text-center">
        <div class="mb-4"> <!-- Space between icon and heading -->
        <LockCheckIcon :size="40" id="lockCheck" />
        </div>
        <h3>
        Secure checkout loading <LoadingDotsVue />
        </h3>
    </div>
    </Transition>
    
    <!-- Show On Start If Logged Out -->
    <Transition>
        <div v-if="UserStore.isLoggedOut && !isLoading && !CheckoutStore.continueAsGuest" class="q-cell-1">
            <CheckoutLoginPromptVue />
        </div>
    </Transition>
</div>
</template>

<script setup>
import { computed } from 'vue';
import { useCheckoutStore } from '../stores/checkoutStore';
import { useUserStore } from '../stores/userStore';

// Components
import CheckoutLoginPromptVue from '../components/CheckoutLoginPrompt.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';
import LockCheckIcon from 'vue-material-design-icons/LockCheck.vue';

const CheckoutStore = useCheckoutStore();
const UserStore = useUserStore();

CheckoutStore.init();

const isLoading = computed(() => UserStore.isLoading.value);
</script>

<style scoped>
#lockCheck {
    color: var(--dark-blue)
}

.checkout-loading {
    height: 80vh;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cancel-link {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
}

.login-btn {
    width: 100%;
}

.login-container {
    padding: 0 20px 20px;
}

.navigation {
    background-color: #fafafa;
}

.page-title {
    text-align: center;
}

.title-section {
    position: relative;
    padding: 10px;
}

.title-container {
    display: flex;
    justify-content: center;
    position: relative;
}
</style>


