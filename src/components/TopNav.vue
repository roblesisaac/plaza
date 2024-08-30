<template>
    <header class="bg-[#12291b] pl-5 py-4 sticky top-0 z-50 flex items-center justify-between">
        <div class="flex-1">
            <a href="#" @click="reload" class="inline-block">
                <img src="/images/logo.svg" class="h-8" alt="Logo" />
            </a>
        </div>
        <nav class="hidden md:flex space-x-4">
            <router-link v-for="link in userRoutes" :to="link.path" class="text-white hover:text-green-300 transition-colors duration-200 pr-5">
                <b>{{ formatProper(link.name) }}</b>
            </router-link>
        </nav>
        <button @click="toggleMenu" class="md:hidden p-2 text-white focus:outline-none">
            <MenuVue v-if="!State.showingMenu" />
            <CloseVue v-else />
        </button>
    </header>
</template>

<script setup>
import router, { userRoutes } from '../router';
import { formatProper } from '../utils/formats';

import MenuVue from 'vue-material-design-icons/Menu.vue';
import CloseVue from 'vue-material-design-icons/Close.vue';

const props = defineProps({
    State: Object
});

function reload() {
    if (window.location.pathname === '/') {
        return window.location.reload();
    }
    props.State.showingMenu = false;
    router.push('/');
}

function toggleMenu() {
    props.State.showingMenu = !props.State.showingMenu;
}
</script>