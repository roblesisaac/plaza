<template>
    <div v-if="progress"
      class="h-2 bg-blue-500 transition-all duration-300 ease-out z-[100]"
      :style="{ width: `${progress}%` }"
    ></div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const progress = ref(0);
  let timer = null;
  
  const startLoading = () => {
    progress.value = 0;
    timer = setInterval(() => {
      progress.value += Math.random() * 10;
      if (progress.value > 95) {
        clearInterval(timer);
      }
    }, 1);
  };
  
  const stopLoading = () => {
    clearInterval(timer);
    progress.value = 100;
    setTimeout(() => {
      progress.value = 0;
    }, 300);
  };
  
  watch(
    () => router.currentRoute.value,
    () => {
      startLoading();
    }
  );
  
  router.beforeResolve((to, from, next) => {
    if (to.path !== from.path) {
      startLoading();
    }
    next();
  });
  
  router.afterEach(() => {
    stopLoading();
  });
  </script>