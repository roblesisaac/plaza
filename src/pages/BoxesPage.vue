<template>
<div class="q-grid">
    <div class="q-cell-1">
        <button @click="showForm=!showForm">
            <span v-if="!showForm">Show</span><span v-else>Hide</span><span>Form</span>
            <Down v-if="!showForm" />
            <Up v-else />
        </button>
    </div>
    <Transition>
    <div v-if="showForm" class="q-cell-1">
        <AddNewBoxForm />
    </div>
    </Transition>

    <div class="q-cell-1">
        <Boxes />
    </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import AddNewBoxForm from '../components/BoxForm.vue';
import Boxes from '../components/Boxes.vue';

import Down from 'vue-material-design-icons/ChevronDown.vue';
import Up from 'vue-material-design-icons/ChevronUp.vue'

const showForm = ref(false);

</script>

<style scoped>

button {
    width: 100%;
    font-weight: bold;
    background: transparent;
    color: var(--darkest-blue)
}

</style>