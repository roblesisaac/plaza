import { defineStore } from 'pinia';
import useApi from '../composables/useApi';
import { useCartStore } from './cartStore';
import { isValidEmail } from '../utils/validation';

const { get, post, loading: apiLoading, error, data } = useApi();
import router from '../router';

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null
  }),
  getters: {
    hasError: () => error,
    isLoading: () => apiLoading,
    isAdmin: (state) => state.isLoggedIn && state.userData.role === 'admin',
    isLoggedOut: (state) => state.userData === null,
    isLoggedIn: (state) => !state.isLoggedOut,
    isVerified: (state) => state.isLoggedIn && state.userData.email_verified === true
  },
  actions: {
    async checkAuth() {  
        if(!this.isLoggedIn) {
            const response = await get('auth/check');

            if(!response?.isLoggedIn) {
                this.userData = null;
                return;
            }

            this.userData = response.data;
        }
        
        if(!this.isVerified) {
            router.push('login')

            return;
        }

        return true;
    },

    async login(email, password) {
        const cartStore = useCartStore();

        if(!email || !password) {
            return this.throwError('Email and password are required.');
        }

        if(!isValidEmail(email)) {
            return this.throwError('Invalid email address.')
        }
        
        await this.submit('login', { email, password });
        cartStore.init();
    },

    async register(email, password='', retype) {
        const cartStore = useCartStore();
        
        if(!isValidEmail(email)) {
            return this.throwError('Invalid email address.')
        }

        if(password.length<8) {
            return this.throwError('Password must be at least 8 characters long.');
        }

        if(password !== retype) {
            return this.throwError('Passwords must match.');
        }

        await this.submit('register', { email, password });
        await cartStore.init();
        await this.checkAuth();
    },

    async submit(submitType, body) {
        const url = `auth/${submitType}/native`;
        
        await post(url, body, { checkIfHuman: true });
           
        if(error.value) {
            return setTimeout(() => error.value = null, 5000);
        }

        this.userData = data.value.data;
    },

    throwError(err) {
        error.value = err;
        setTimeout(() => error.value = null, 5000);
    }
  }
});