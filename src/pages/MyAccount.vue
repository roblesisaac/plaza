<template>
  <div class="flex">
      <LoginForm class="w-full max-w-md mx-auto p-6" v-if="userStore.isLoggedOut" />
      <MyAccountComponent v-else />
  </div>
</template>

<script setup>
  import MyAccountComponent from '../components/MyAccountComponent.vue';
  import LoginForm from '../components/LoginForm.vue';
  import { useUserStore } from '../stores/userStore';

  const userStore = useUserStore();

</script>