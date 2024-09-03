<template>

<div class="q-grid middle edit-controller">
    <div :class="'q-cell-' + left + ' label-container'">
        <small><b class="item-title">{{ title || prop }}</b></small>
    </div>

    <div v-if="!options" :class="'q-cell-' + right + ' item-value'">
        <input v-if="type !== 'textarea'" :type="type" v-model="data[prop]" step=".01">
        <textarea v-else v-model="data[prop]" rows="5"></textarea>
    </div>

    <div v-if="options" :class="'q-cell-' + right + ' item-value'">
        <select v-model="data[prop]">
            <option v-for="option in options" :value="option">{{ option }}</option>
        </select>
    </div> 
</div>

</template>

<script setup>

const props = defineProps({
    left: {
        type: String,
        default: '45'
    },
    right: {
        type: String,
        default: '55'
    },
    data: Object,
    prop: String,
    title: String,
    options: Array,
    type: {
        type: String,
        default: 'text'
    }
});

</script>

<style scoped>
input, textarea {
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 3px;
}

.edit-controller {
    padding-top: 10px;
}

.item-title {
    text-transform: capitalize;
}

.label-container {
    padding-right: 20px;
    text-align: right;
    text-transform: capitalize;
}
</style>