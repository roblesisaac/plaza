<template>
<div class="q-grid item-container">
    <!-- When Not Editing -->
    <div class="q-cell-1">
        <div class="q-grid">

            <div class="q-cell-95 item-text">
                <b>{{ box.name }}</b>
                <br>
                <span class="item-metadata">
                    {{ box.length }} x {{ box.width }} x {{ box.height }}
                    <br>
                    {{ boxCost }}
                    <br>
                    {{ formatPhone(boxPhone) }}
                </span>
            </div>
            
            <div @click="editing=!editing" class="q-cell-5 item-dots">
                <DotsVue />
            </div>
        </div>
    </div>

    <!-- When Editing -->
    <div v-if="editing" class="q-cell-1">
        <BoxFormVue :box="box" />
        <button @click="boxes.remove(box._id)" class="delete-item">Delete</button>
    </div>

</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

// Components
import BoxFormVue from './BoxForm.vue';
import DotsVue from 'vue-material-design-icons/DotsVerticalCircleOutline.vue';

// Stores + Utils
import { useBoxStore } from '../stores/boxStore';
import { formatAsPrice, formatPhone } from '../utils/formats';

const boxes = useBoxStore();

const props = defineProps({
    box: Object
});

const editing = ref(false);

const boxCost = computed(() => {
    const supplier = getDefaultSupplier();

    if(!supplier) {
        return 'n/a';
    }

    return formatAsPrice(supplier.cost);
});

const boxPhone = computed(() => {
    const supplier = getDefaultSupplier();

    if(!supplier) {
        return 'n/a';
    }

    return supplier.phone;
});

function getDefaultSupplier() {
    return props.box.suppliers.find(s => s.isDefault === true);
}

watch(props.box, () => {
    boxes.updateBox(props.box)
}, { deep: true })

</script>

<style scoped>
.delete-item {
    width: 100%;
}
.item-container {
    padding: 20px 10px;
    border-bottom: 2px solid #ccc;
}
.item-dots {
    cursor: pointer;
}
.item-metadata {
    font-size: .9rem;
    color: #999;
}
.item-text {
    padding-left: 20px;
}
</style>