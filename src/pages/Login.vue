<template>
<Transition>
<LoginForm v-if="userStore.isLoggedOut" />
<VerifyForm v-else-if="!userStore.isVerified" />

<div v-else-if="userStore.isLoggedIn" class="q-grid">
    <div class="q-cell-1 center">
        <a href="/api/auth/logout">Logout</a>
    </div>
</div>
</Transition>

</template>

<script setup>
import LoginForm from '../components/LoginForm.vue';
import VerifyForm from '../components/VerifyForm.vue';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();

</script>