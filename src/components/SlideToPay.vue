<template>
  <div 
    class="slider-container"
    ref="sliderRef"
  >
    <div
      class="slider-thumb"
      :class="{ 'completed': completed }"
      :style="thumbStyle"
      ref="thumbRef"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    </div>
    <div class="slider-text">
      {{ completed ? 'Payment Confirmed' : `Slide to pay ${total}` }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  onComplete: {
    type: Function,
    required: true
  },
  total: {
    type: String,
    required: true
  }
});

const sliding = ref(false);
const progress = ref(0);
const sliderRef = ref(null);
const thumbRef = ref(null);
const maxProgress = ref(0);
const completed = ref(false);
const startX = ref(0);

const thumbStyle = computed(() => {
  if (completed.value) {
    return { right: '5px', left: 'auto' };
  }
  return { transform: `translateX(${progress.value}px)` };
});

const updateMaxProgress = () => {
  if (sliderRef.value && thumbRef.value) {
    const sliderRect = sliderRef.value.getBoundingClientRect();
    const thumbRect = thumbRef.value.getBoundingClientRect();
    maxProgress.value = sliderRect.width - thumbRect.width - 10;
  }
};

const handleStart = (clientX) => {
  if (!completed.value) {
    sliding.value = true;
    startX.value = clientX - progress.value;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
};

const handleEnd = async () => {
  if (sliding.value && !completed.value) {
    sliding.value = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    if (progress.value >= maxProgress.value * 0.95) {
      completed.value = true;
      
      try {
        await props.onComplete();
      } catch (err) {
        completed.value = false;
        progress.value = 0;
      } 

    } else {
      progress.value = 0;
    }
  }
};

const updateProgress = (clientX) => {
  if (sliding.value && sliderRef.value && !completed.value) {
    const newProgress = Math.max(0, Math.min(clientX - startX.value, maxProgress.value));
    progress.value = newProgress;
  }
};

const handleMouseDown = (e) => handleStart(e.clientX);
const handleMouseMove = (e) => updateProgress(e.clientX);
const handleMouseUp = handleEnd;

const handleTouchStart = (e) => e.touches[0] && handleStart(e.touches[0].clientX);
const handleTouchMove = (e) => e.touches[0] && updateProgress(e.touches[0].clientX);
const handleTouchEnd = handleEnd;

onMounted(() => {
  updateMaxProgress();
  window.addEventListener('resize', updateMaxProgress);
  sliderRef.value.addEventListener('mousedown', handleMouseDown);
  sliderRef.value.addEventListener('touchstart', handleTouchStart);
  sliderRef.value.addEventListener('touchmove', handleTouchMove);
  sliderRef.value.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMaxProgress);
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  if (sliderRef.value) {
    sliderRef.value.removeEventListener('mousedown', handleMouseDown);
    sliderRef.value.removeEventListener('touchstart', handleTouchStart);
    sliderRef.value.removeEventListener('touchmove', handleTouchMove);
    sliderRef.value.removeEventListener('touchend', handleTouchEnd);
  }
});
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 60px;
  background-color: #f0f0f0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}

.slider-thumb {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 100px;
  height: 50px;
  background-color: #fff;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px #0003;
  transition: transform .1s ease, background-color .3s ease, right .3s ease;
  z-index: 100;
}

.slider-thumb.completed {
  background-color: #4CAF50;
  right: 5px;
  left: auto;
}

.slider-thumb svg {
  color: #4a90e2;
  transition: color 0.3s ease;
}

.slider-thumb.completed svg {
  color: white;
}

.slider-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 18px;
  font-weight: 500;
  pointer-events: none;
}
</style>