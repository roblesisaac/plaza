<template>
<div class="q-grid">
    <button v-for="route in routes" @click="changeRoute(route)" class="q-cell-1 router-link"><h2>{{ route.name }}</h2></button>
    <button href="#" class="q-cell-1 router-link"><h2>Shop On Etsy »</h2></button>
    <!-- logout button if logged in -->
    <a v-if="userStore.isLoggedIn" class="q-cell-1 button router-link center" href="/api/auth/logout"><h2>Logout</h2></a>
</div>
</template>

<script setup>
import { computed } from 'vue';
import router from '../router';
import { useUserStore } from '../stores/userStore';

const props = defineProps({
    State: Object
});

const userStore = useUserStore();

const routes = computed(() => {
    return router.getRoutes().filter(route => !route.path.includes(':') && userHasAccess(route) && !routeIsHidden(route)); 
});

function changeRoute(route) {
    router.push(route.path);
    props.State.showingMenu = false;
}

function userHasAccess(route) {
    const { requires } = route.meta;

    if(route.name === 'login') {
        if(userStore.isLoggedIn) return false;
    }

    if (!requires || import.meta.env.DEV) {
        return true;
    }

    if(!userStore.isLoggedIn) {
        return false;
    }

    const { userData } = userStore;
    const roleHierarchy = ['member', 'admin'];
    const requiresRole = roleHierarchy.indexOf(requires);
    const userRole = roleHierarchy.indexOf(userData.role);

    return userRole >= requiresRole;
}

function routeIsHidden(route) {
    return route?.meta?.hide;
}

</script>

<style scoped>
.router-link {
    background: transparent;
    color: #000;
}
</style>