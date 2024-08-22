<template>
    <div class="bg-[#12291b] px-5 sticky top-0 z-50 flex items-center justify-between">
        <div class="flex-1 max-w-[65%]">
            <a href="#" @click="reload">
                <img src="/images/logo.svg" class="logo" alt="Logo" />
            </a>
        </div>
        <div class="flex-none max-w-[35%] text-right">
            <a @click='toggleMenu' class="p-2 cursor-pointer text-white">
                <CloseVue v-if="State.showingMenu" />
                <MenuVue v-else />
            </a>
        </div>
    </div>
</template>

<script setup>
// import logo from '/src/assets/images/logo.svg';
import router from '../router';

// Components
import MenuVue from 'vue-material-design-icons/Menu.vue';
import CloseVue from 'vue-material-design-icons/Close.vue';

const props = defineProps({
    State: Object
});

function reload() {
    if (window.location.pathname === '/') {
        return window.location.reload();
    }
    router.push('/');
}

function toggleMenu() {
    props.State.showingMenu = !props.State.showingMenu;
}
</script>

<style scoped>
a:hover {
    color: #fff;
}

.logo {
    height: 30px;
}
</style>