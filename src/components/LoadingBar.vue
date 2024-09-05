<template>
  <div
    v-if="isVisible"
    class="fixed top-0 left-0 right-0 h-2 bg-blue-500 transition-all duration-300 ease-out z-[100]"
    :style="{ width: `${progress}%` }"
  ></div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const progress = ref(0);
const isVisible = ref(false);
let timer = null;
let hideTimer = null;

const startLoading = () => {
  clearTimeout(hideTimer);
  isVisible.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    progress.value += (100 - progress.value) / 10;
    if (progress.value > 95) {
      clearInterval(timer);
    }
  }, 200);
};

const stopLoading = () => {
  clearInterval(timer);
  progress.value = 100;
  hideTimer = setTimeout(() => {
    isVisible.value = false;
    progress.value = 0;
  }, 500); // Delay hiding the bar
};

watch(
  () => router.currentRoute.value,
  (newRoute, oldRoute) => {
    if (!isVisible.value && oldRoute.name) {
      startLoading();
    }
  }
);

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    startLoading();
  }
  next();
});

router.afterEach(() => {
  console.log('after each');
  stopLoading();
});
</script>