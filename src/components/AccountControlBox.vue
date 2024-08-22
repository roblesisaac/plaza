<template>
<div class="q-grid account-wrapper">
    <div class="q-cell-1 text-right">
        <a v-if="!isEditing" @click="isEditing=true" class="edit-account"><PencilVue /></a>
        <a v-else @click="isEditing=false" class="edit-account"><CloseVue /></a>
    </div>
    <div class="q-cell-1 text-center account-details">
        <div class="q-grid">
            <div v-if="!isEditing" class="q-cell-1">
                {{ userEmail }}
            </div>
            <Transition>
            <div v-if="isEditing" class="q-cell-1">
                <input v-model="userStore.userData.email" type="text" />
            </div>
            </Transition>
        </div>
    </div>
</div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../stores/userStore';

import PencilVue from 'vue-material-design-icons/PencilCircleOutline.vue';
import CloseVue from 'vue-material-design-icons/CloseCircleOutline.vue';
const userStore = useUserStore();

const userEmail = computed(() => {
    if(userStore.isLoggedOut) {
        return 'My Account';
    }

    return userStore.userData.email;
});

const isEditing = ref(false);
</script>

<style scoped>
.account-details {
    padding: 30px;
}

.account-wrapper {
    background: #ccc;
    border-radius: 20px;
    padding: 10px;
}

.edit-account {
    color: #000;
}
</style>