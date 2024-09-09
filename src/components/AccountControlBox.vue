<template>
<div class="q-grid account-wrapper">
    <div class="q-cell-1 text-right">
        <a v-if="!isEditing" @click="isEditing=true" class="edit-account"><Settings /></a>
        <a v-else @click="isEditing=false" class="edit-account"><CircleX /></a>
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

import { CircleX, Settings } from 'lucide-vue-next';
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