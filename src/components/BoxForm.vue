<template>
<form @submit.prevent="onSubmit" class="q-grid box-form">

    <div class="q-cell-1">

        <!-- Name -->
        <EditPropVue :data="boxData" prop="name" title="box name" left="20" right="80" />
        
        <!-- Length -->
        <EditPropVue :data="boxData" prop="length" type="number" left="20" right="80" />

        <!-- Width -->
        <EditPropVue :data="boxData" prop="width" type="number" left="20" right="80" />

        <!-- Height -->
        <EditPropVue :data="boxData" prop="height" type="number" left="20" right="80" />

    </div>

    <!-- Suppliers -->
    <div class="q-cell-1 suppliers-container">
        <div class="q-grid">
            <h3>Suppliers</h3>

            <div v-for="(supplier, index) in boxData.suppliers" :key="supplier.name" class="q-cell-1 supplier-item">
                <EditPropVue :data="boxData.suppliers[index]" prop="companyName" title="company name" left="20" right="80" />
                <EditPropVue :data="boxData.suppliers[index]" prop="cost" type="number" title="supplier cost" left="20" right="80" />
                <EditPropVue :data="boxData.suppliers[index]" prop="isDefault" left="20" right="80" :options="[true, false]" />
                <EditPropVue :data="boxData.suppliers[index]" prop="url" left="20" right="80" />
                <EditPropVue :data="boxData.suppliers[index]" prop="phone" type="number" title="supplier phone" left="20" right="80" />
            </div>

            <div class="q-cell-1">
                <div class="q-grid">
                    <div class="q-cell-50 supply-buttons">
                        <button @click="removeSupplier(index)" type="button" class="remove"><b>- Supplier</b></button>
                    </div>
                    <div class="q-cell-50 supply-buttons">
                        <button @click="insertNewSupplier" type="button"><b>+ Supplier</b></button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="!boxData._id" class="q-cell-1 submit">
        <button type="submit" class="button"><h3>Save Box</h3></button>
    </div>

    <!-- Form Status -->
    <Transition>
    <div v-if="boxes.status" class="q-cell-1 status-container">
        {{ boxes.status }}<LoadingDotsVue />
    </div>
    </Transition>
    <Transition>
    <div v-if="boxes.error" class="q-cell-1 status-container error">
        {{ boxes.error }}
    </div>
    </Transition>
</form>
</template>

<script setup>

import { ref } from 'vue';

// Components
import EditPropVue from './EditProp.vue';
import LoadingDotsVue from './LoadingDots.vue';

// Store
import { useBoxStore } from '../stores/boxStore';

const boxes = useBoxStore();

const props = defineProps({
    box: Object
});

const boxData = ref(props.box || emptyBox());

function emptyBox() {
    return {
        name: '',
        length: '',
        width: '',
        height: '',
        suppliers: [
            {
                companyName: '',
                cost: '',
                isDefault: '',
                url: '',
                phone: ''
            }
        ]
    }
}

function insertNewSupplier() {
    boxData.value.suppliers.push({name: '', cost: '', isDefault: '', url: ''});
}

function removeSupplier(index) {
    boxData.value.suppliers.splice(index, 1);
}

async function onSubmit() {
    try {
        await boxes.saveNewBox(boxData.value);
        boxData.value = emptyBox();
    } catch (err) {
        console.log(err);
    }
}

</script>

<style scoped>
button {
    width: 100%;
}

.box-form {
    padding: 20px;
}

.status-container {
    background: var(--darkest-blue);
    text-transform: capitalize;
    color: #fff;
    padding: 20px;
    text-align: center;
    border-radius: 1rem;
    margin-top: 10px;
    font-weight: bold;
}

.status-container.error {
    background-color: var(--dark-red);
}

.submit {
    padding-top: 20px;
}

.supply-buttons {
    padding: 20px;
}

.supply-buttons button {
    background: #111;
    color: #fff;
    font-size: .9rem;
    padding: 5px;
}

.supply-buttons button.remove {
    color: var(--lightest-red)
}

.suppliers-container {
    padding: 20px;
}

.supplier-item {
    padding: 20px;
    border-bottom: 1px solid #ccc;
}

</style>