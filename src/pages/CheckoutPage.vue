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
    
    <!-- Main Checkout Flow -->
    <div v-if="(UserStore.isLoggedIn && !isLoading) || CheckoutStore.continueAsGuest" class="q-cell-1 main-checkout-container">
        <div class="q-grid">

            <!-- Title Section + Cancel -->
            <div class="q-cell-1 title-section">
                <div class="title-container">
                    <router-link to="/cart" class="cancel-link"><ChevronLeftIcon /></router-link>
                    <div class="page-title"><h3>Checkout</h3></div>
                </div>
            </div>
            
            <!-- Navigation -->
            <div class="q-cell-1 navigation p10">
                <CheckoutNavigationVue />
            </div>
            
            <!-- Notifications -->
            <Transition>
                <div v-if="CheckoutStore.notifications.length" class="q-cell-1">
                    <CheckoutNotificationsVue />
                </div>
            </Transition>
            
            <!-- Active Component -->
            <Transition>
                <div v-if="CheckoutStore.activePage !== 'loading'" class="q-cell-1">
                    <Component :is="pages[CheckoutStore.activePage]" />
                </div>
            </Transition>

             <!-- Button to login in -->
            <div class="q-cell-1 login-container">
                <button v-if="CheckoutStore.continueAsGuest" 
                @click="CheckoutStore.continueAsGuest=false"
                class="login-btn">
                    <PersonIcon /> Login
                </button>
            </div>

        </div>
    </div>
</div>
</template>

<script setup>
import { computed } from 'vue';
import { useCheckoutStore } from '../stores/checkoutStore';
import { useUserStore } from '../stores/userStore';

// Components
import CheckoutLoginPromptVue from '../components/CheckoutLoginPrompt.vue';
import CheckoutNavigationVue from '../components/CheckoutNavigation.vue';
import CheckoutNotificationsVue from '../components/CheckoutNotifications.vue';
import CheckoutShippingVue from '../components/CheckoutShipping.vue';
import CheckoutPaymentVue from '../components/CheckoutPayment.vue';
import CheckoutReviewVue from '../components/CheckoutReview.vue';
import CheckoutSuccessVue from '../components/CheckoutSuccess.vue';
import LoadingDotsVue from '../components/LoadingDots.vue';

import PersonIcon from 'vue-material-design-icons/Account.vue';
import ChevronLeftIcon from 'vue-material-design-icons/ChevronLeft.vue';
import LockCheckIcon from 'vue-material-design-icons/LockCheck.vue';

const CheckoutStore = useCheckoutStore();
const UserStore = useUserStore();

CheckoutStore.init();

const isLoading = computed(() => UserStore.isLoading.value);

const pages = [CheckoutShippingVue, CheckoutPaymentVue, CheckoutReviewVue, CheckoutSuccessVue];
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


