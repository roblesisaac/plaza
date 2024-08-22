<template>

<!-- Large Screens -->
<div v-if="screenSize === 'large'" class="q-grid middle" id="about">
    <div class="q-cell-50 padding-large">
        <h1>{{ header }}</h1>
        <p>{{ paragraph }}</p>
    </div>
    <div class="q-cell-50 icon">
        <img class="img-large" src="/images/usa.svg" />
    </div>
</div>

<!-- Small Screens -->
<div v-if="screenSize !== 'large'" class="q-grid middle" id="about">
    <div class="q-cell-1 padding-not-large">
        <h2>{{ header }}</h2>
        <p>{{ paragraph }}</p>
    </div>
    <div class="q-cell-1 icon on-small">
        <hr>
        <img class="img-small" src="/images/usa.svg" />
    </div>
</div>

</template>

<script setup>
import { ref } from 'vue';

// Composables
import useScreen from '../composables/useScreen';

const { screenSize } = useScreen();

const header = ref(`Craftsmanship & Durability`);
const paragraph = ref(`Every Garden Hanger is made in Southern California using sturdy 1/4 inch steel. It's then coated with a semi-gloss black paint followed by a final inspection to ensure quality.`);

</script>

<style scoped>
#about {
    background-color: #f1bc4d;
    color: #12291b;
    padding: 100px 0;
}

.on-small {
    flex-direction: column;
}

.padding-large {
    padding: 100px;
}

.padding-not-large {
    text-align: center;
    padding: 0 50px 50px 50px;
}

.icon {
    justify-content: center;
    align-items: center;
    display: flex;
}

.img-small {
    width: 175px;
}

.img-large {
    width: 250px;
}

hr {
    border: none;
    border-top: 2px solid #12291b;
    width: 70%;
    margin-bottom: 50px;
}
</style>