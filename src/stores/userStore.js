import { defineStore } from 'pinia';
import useApi from '../composables/useApi';
import { useCartStore } from './cartStore';
import { isValidEmail } from '../utils/validation';

const { get, post, loading: apiLoading, data, notify } = useApi();

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: false
  }),
  getters: {
    isLoading: () => apiLoading,
    isAdmin: (state) => state.isLoggedIn && state.userData.role === 'admin',
    isLoggedOut: (state) => state.userData === false,
    isLoggedIn: (state) => !state.isLoggedOut,
    isVerified: (state) => state.userData?.email_verified === true,
    status: (state) => {
        if(state.isLoggedOut) {
            return 'LOGGED_OUT';
        }

        if(state.isVerified) {
            return 'VERIFIED';
        }

        return 'NOT_VERIFIED';
    }
  },
  actions: {
    async checkAuth() {  
        try {
            if(this.isLoggedIn) {
                return true;
            }
    
            const response = await get('auth/check');
    
            this.userData = response.data || response;
    
            return this.userData === false ? false : true;
        } catch (err) {
            this.userData = false;
            return false;
        }
    },

    async login(email, password) {
        const cartStore = useCartStore();

        if(!email || !password) {
            return notify('Email and password are required.');
        }

        if(!isValidEmail(email)) {
            return notify('Invalid email address.')
        }
        
        await this.submit('login', { email, password });
        cartStore.init();
    },

    async register(email, password='', retype) {
        const cartStore = useCartStore();
        
        if(!isValidEmail(email)) {
            return notify('Invalid email address.')
        }

        if(password.length<8) {
            return notify('Password must be at least 8 characters long.');
        }

        if(password !== retype) {
            return notify('Passwords must match.');
        }

        await this.submit('register', { email, password });
        await cartStore.init();
        await this.checkAuth();
    },

    async submit(submitType, body) {
        const url = `auth/${submitType}/native`;
        
        await post(url, body, { checkIfHuman: true });

        this.userData = data.value.data;
    }
  }
});