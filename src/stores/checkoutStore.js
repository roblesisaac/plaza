import { defineStore } from 'pinia';

export const useCheckoutStore = defineStore('checkout', {
  state: () => ({
    stripe_session_id: null
  }),
  getters: {
  },
  actions: {
    init: () => console.log('initiated...')
  }
});