<template>

<!-- Large Screens -->
<div v-if="screenSize === 'large'" class="q-grid stretch p20">
    <div class="q-cell-65 headline">
        <h1>
            {{ headline }} 
        </h1>
        <span id="slogans">
            {{ slogan }} 
        </span>

        <!-- Call To Action -->
        <Transition>
            <a href="#" v-if="header===headline" id="action">Shop On Etsy</a>
        </Transition>

    </div>
    <MainSlideVue class="q-cell-35 right" />
</div>

<!-- Not Large Screens -->
<div v-if="screenSize !== 'large'" class="q-grid stretch">
    <div class="q-cell-1 headline">
        <h1>
            {{ headline }}<span id="placeHeader">{{ placeHeader }}</span>
        </h1>
        <span id="slogans">
            {{ slogan }}
        </span>

        <!-- Call To Action -->
        <Transition>
            <a href="#" v-if="header===headline" id="action">Shop On Etsy</a>
        </Transition>

    </div>
    <Transition>
        <MainSlideVue class="q-cell-1" />
    </Transition>
</div>

</template>
    
<script setup>

import { computed, onMounted, ref } from 'vue';

// Components
import MainSlideVue from './MainSlide.vue';

// Composables
import useScreen from '../composables/useScreen';

const { screenSize } = useScreen();

const header = ref('Hang your favorite plants.');
const slogans = [
    'On a variety of walls and fencing.',
    'No tools required.'
];

const headline = ref('');
const placeHeader = computed(() => header.value.replace(headline.value, ''));
const slogan = ref('');

let sloganCursor = 0;

function typeNextLeter(target, text, callback, timeout=0) {
    if(window.location.pathname !== '/') {
        return;
    }

    if(target.value === text) {
        if(callback) setTimeout(callback, timeout);
        return;
    }

    target.value += text.charAt(target.value.length);

    setTimeout(() => {
        typeNextLeter(target, text, callback, timeout);
    }, 30)
}

function typeoutSlogans() {
    if(!slogans[sloganCursor]) {
        sloganCursor = 0;
        tremble('#action');
        setTimeout(typeoutSlogans, 7000);
        return;
    }

    const currentSlogan = slogans[sloganCursor];

    sloganCursor++;
    slogan.value = '';

    typeNextLeter(slogan, currentSlogan, typeoutSlogans, 1500);
}

function tremble(selector) {
  const element = document.querySelector(selector);

  if(element === null) return;

  element.classList.add('tremble');

  setTimeout(() => {
    element.classList.remove('tremble');
  }, 700);
}

onMounted(() => {
    typeNextLeter(headline, header.value, typeoutSlogans);
});
    
</script>
    
<style scoped>
h1 {
    font-size: 3.2rem;
    margin: 0.67em 0;
    line-height: 1;
}
.q-grid {
    background-color: #727c6d;
    color: #fff;
}
.headline {
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
img {
    max-width: 100%;
}

#action {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
    align-self: flex-start;
    padding: 10px 20px;
    border-radius: 8px;
}

#placeHeader {
    color: #727c6d;
}

#slogans {
    font-size: 1.5em;
    margin-bottom: 20px;
}

@keyframes tremble {
  0% { transform: translate(0, 0) rotate(0); }
  25% { transform: translate(-2px, 0) rotate(-1deg); }
  50% { transform: translate(0, 0) rotate(0); }
  75% { transform: translate(2px, 0) rotate(1deg); }
  100% { transform: translate(0, 0) rotate(0); }
}

.tremble {
  animation: tremble 0.1s linear infinite;
}

</style>