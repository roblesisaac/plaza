<template>
<div class="q-grid form-wrapper">
    <!-- Login With Google -->
    <div class="q-cell-1 center google-container">
        <button class="bgF3 login-google mb-10" @click="loginWithGoogle">
            <img alt="Google logo" src="../assets/google.svg" class="google-img" />
            <span class="capitalize mr-2">{{ formType }}</span> With Google
        </button>
    </div>
    
    <!-- Divider Text -->
    <div class="q-cell-1">
        <DividerText :text="`Or ${formType} with email`" />
    </div>

    <!-- login form -->
    <div class="q-cell-1">
        <Transition>
            <form v-if="formType" @submit.prevent="nativeSubmit" class="q-grid login-form">         
                <fieldset class="q-cell-1">
                    <div class="q-grid">
                        
                        <!-- Email -->
                        <div class="q-cell-1">
                            <div class="q-grid middle">
                                <div class="q-cell-1">
                                    <label for="email">{{ formType }} Email</label>
                                    <input id="email" v-model="body.email" autocomplete="email" type="text" />
                                </div>
                            </div>
                        </div>
                        
                        <!-- Password -->
                        <div class="q-cell-1">
                            <div class="q-grid">
                                <div class="q-cell-1">                  
                                    <label for="password">{{ formType }} Password</label>
                                    <input id="password" v-model="body.password" autocomplete="current-password" type="password" />
                                </div>
                            </div>
                        </div>
                        
                        <!-- Retype Password -->
                        <div v-if="formType=='register'" class="q-cell-1">
                            <div class="q-grid">
                                <div class="q-cell-1">                  
                                    <label for="retype">Re-Type Password</label>
                                    <input id="retype" v-model="body.retype" autocomplete="current-password" type="password" />
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </fieldset>
                
                <!-- Submit Form -->
                <div class="q-cell-1">
                    <button type="submit" class="expanded capitalize">
                        {{ formType }} <LoadingDotsVue v-if="isLoading" /><ArrowRight v-else />
                    </button>
                </div>
                
                <div class="q-cell-1">
                    <div class="q-grid form-links">
                        
                        <!-- Forgot Password -->
                        <div class="q-cell-50 text-left">
                            <a href="#" @click="Router.push('recover')" class="forgot-password">Forgot Password</a>
                        </div>
                        
                        <!-- Toggle Form Type -->
                        <div class="q-cell-50 text-right">
                            <a href="#" v-if="formType=='login'" @click="toggleFormType('register')">
                                Register
                            </a>
                            <a href="#" v-else @click="toggleFormType('login')">
                                Login
                            </a>
                        </div>
                        
                    </div>
                </div>
                
                <!-- Notify -->
                <br /><br />
                <Transition>
                    <div v-if="hasError" class="q-cell-1 notify" v-html="hasError"></div>
                </Transition>
            </form>
        </Transition>

    </div>
    
</div>
</template>

<script setup>
import { nextTick, ref, defineEmits } from 'vue';
import { ArrowRight } from 'lucide-vue-next';
import Router from '../router';
import DividerText from './DividerText.vue';

// Components
import LoadingDotsVue from './LoadingDots.vue';

// Stores
import { useUserStore } from '../stores/userStore';

const emit = defineEmits(['login-success']);
const userStore = useUserStore();
const { login, register, isLoading, hasError } = userStore;

const body = ref({
    email: '',
    password: '',
    retype: ''
});

const formType = ref('login');

async function loginWithGoogle() {
    location.href='/api/auth/google';
}

async function nativeSubmit() {
    const { email, password, retype } = body.value;

    const submit = formType.value === 'login' 
            ? login 
            : register;
        
    await submit(email, password, retype);

    if(userStore.isLoggedIn) {
        emit('login-success');
    }
}

function toggleFormType(changeTo) {
    formType.value = null;
    
    nextTick(() => {
        formType.value = changeTo;
    });
}


</script>

<style scoped>
button[type="submit"] {
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
    font-weight: bold;
    margin: 15px 0 10px 0;
    background: var(--darkest-gray);
}

fieldset {
    margin: 0;
    padding: 0;
    border: none;
}

input {
    margin-bottom: 15px;
}

/* Labels */
label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    font-size: .9rem;
}

.forgot-password {
    color: #111
}

.form-links a {
    font-weight: bold;
}

.form-wrapper {
    padding: 50px;
}

.google-img {
    height: 20px;
}

.login-form {
    text-transform: capitalize;
}

.login-form button[type="submit"]:hover {
    background-color: #0056b3;
}

.login-google {
    width: 100%;
    color: #333;
    font-weight: bold;
}

.login-google:hover {
    color: #fff;
}

.notify {
    background: var(--dark-red);
    color: #fff;
    text-align: center;
    padding: 20px;
    border-radius: 5px;
    font-weight: bold;
}

</style>