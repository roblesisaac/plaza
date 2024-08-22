<template>
    <!-- large screens -->
    <form v-if="screenSize === 'large'" @submit.prevent="sendMessage" class="q-grid contact-form">

        <div class="q-cell-50">
            <div class="q-grid">
                <div class="q-cell-50 padding-right">
                    <input type="text" placeholder="Name" v-model="body.name">
                </div>

                <div class="q-cell-50">
                    <input type="text" placeholder="Email" v-model="body.from">
                </div>

                <div class="q-cell-1">
                    <textarea placeholder="Message" rows="10" v-model="body.text"></textarea>
                </div>

                <Transition>
                <div v-if="notice.length" class="q-cell-1" id="notice">
                    {{ notice }}<LoadingDotsVue v-if="loading" />
                </div>
                </Transition>

                <div class="q-cell-1 recaptcha-notice">
                    This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
                </div>

                <div class="q-cell-1 align-right">
                    <button type="submit">Send</button>
                </div>
            </div>
        </div>
        <div class="q-cell-50 p30">
            <h2 class="header">{{ header }}</h2>
            <p class="caption">{{ caption }}</p>
        </div>

    </form>

    <!-- not large screens -->
    <form v-if="screenSize !== 'large'" @submit.prevent="sendMessage" class="q-grid contact-form">

        <div class="q-cell-1 p30b">
            <h2 class="header">{{ header }}</h2>
            <p class="caption">{{ caption }}</p>
        </div>

        <div class="q-cell-1">
            <input type="text" placeholder="Name" v-model="body.name">
        </div>

        <div class="q-cell-1">
            <input type="text" placeholder="Email*" v-model="body.from" autocomplete="email">
        </div>

        <div class="q-cell-1">
            <textarea placeholder="Message*" rows="10" v-model="body.text"></textarea>
        </div>

        <Transition>
        <div v-if="notice.length" class="q-cell-1" id="notice">
            {{ notice }}<LoadingDotsVue v-if="loading" />
        </div>
        </Transition>

        <div class="q-cell-1 recaptcha-notice">
            This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a> and <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </div>

        <div class="q-cell-1 align-right">
            <button type="submit">Send</button>
        </div>

    </form>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

// Components
import LoadingDotsVue from './LoadingDots.vue';

// Composables + Utils
import { isValidEmail } from '../utils/validation';
import useApi from '../composables/useApi';
import useScreen from '../composables/useScreen';

const api = useApi();

const { screenSize } = useScreen();

const body = ref({
    name: '',
    text: '',
    recaptchaToken: ''
});

const notice = ref('');
const loading = ref(false);
const header = ref('Contact Us Now');

const buttonDirection = computed(() => screenSize.value === 'large' ? 'to the left' : 'below');
const caption = ref(`Fill out the form ${buttonDirection.value} to get in touch with us. We are here to help with all your plant hanging needs.`);

const sendMessage = async () => {
    const requiredFieldsMet = isValidEmail(body.value.from) && !!body.value.text.length;

    if(!requiredFieldsMet) {
        return notify('Please provide a valid email address and message.');
    }

    notice.value = 'Sending message';
    loading.value = true;

    const response = await api.post('contact-form', body.value, { checkIfHuman: true });

    loading.value = false;
    notify(response.message);

    if(!response.success) {
        return;
    }

    resetBody();
}

function notify(message) {
    notice.value = message;

    setTimeout(() =>  notice.value = '', 3000);
}

function resetBody() {
    body.value.name = '';
    body.value.from = '';
    body.value.text = '';
    body.value.recaptchaToken = ''
}

// watchers

watch(() => body.value.from, () => {
    body.value.from = body.value.from.toLowerCase();
});

</script>

<style scoped>
button {
    background-color: transparent;
    border: 2px solid #111;
    padding: 10px 50px;
    color: #333;
}

input,
textarea {
    background-color: #dfe5e9;
    border: 0;
    padding: 10px;
    border-radius: 5px;
    width: 100%;
    margin-bottom: 20px;
}

#notice {
    margin-bottom: 20px;
    padding: 10px;
    border-radius: 7px;
    background-color: #12291b;
    font-weight: bold;
    color: #fff;
}

.align-right {
    text-align: right;
}

.caption {
    font-size: 1.2rem;
    margin-bottom: 0;
    color: #777;
}

.contact-form {
    padding: 30px;
    background-color: #f0f6fb;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.header {
    font-size: 2rem;
    margin-bottom: 0
}

.padding-right {
    padding-right: 15px;
}

.p30 {
    padding: 30px;
}

.p30b {
    padding-bottom: 30px;
}

.recaptcha-notice {
    font-size: 0.8rem;
    color: #777;
    padding-bottom: 30px;
}
</style>