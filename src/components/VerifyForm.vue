<template>
<form @submit.prevent="verifyUser" class="q-grid">
    <div class="q-cell-1">
        <!-- Prompt user to enter verification code -->
        <h3>Please enter the verification code sent to {{ userStore.userData?.email || 'your inbox' }}.</h3>
    </div>

    <div class="q-cell-1 p20y">
        <input type="number" v-model="code" />
    </div>

    <div class="q-cell-1">
        <button type="submit">Verify <ArrowRightVue /></button>
    </div>

    <div v-if="notification" class="q-cell-1" id="notify" v-html="notification"></div>
</form>
</template>

<script setup>
import { ref } from 'vue';

// Components
import ArrowRightVue from 'vue-material-design-icons/ArrowRightThick.vue';

// Composables + Stores
import useApi from '../composables/useApi';
import { useUserStore } from '../stores/userStore';

const api = useApi();
const userStore = useUserStore();
const code = ref('');
const notification = ref(false);

function notify(message) {
    notification.value = message;
    setTimeout(() => {
        notification.value = false;
    }, 3000);
}

async function verifyUser() {

    const verificationResult = await api.post('auth/verify', {
        code: code.value
    });

    if(!verificationResult.success) {
        return notify(verificationResult.message);
    }

    userStore.userData.email_verified = true;
}
</script>

<style scoped>
form {
    padding: 30px;
}

input {
    border: 3px solid #000;
}

#notify {
    margin-top: 10px;
    border-radius: 5px;
    padding: 20px;
    font-weight: bold;
    text-align: center;
    background-color: var(--dark-red);
    color: white;
}

button {
    border: none;
    color: #fff;
    padding: 15px 32px;
    font-weight: bold;
    width: 100%;
}
</style>../useApi