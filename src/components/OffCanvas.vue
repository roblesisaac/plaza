<template>
    <div class="q-grid">
        <button v-for="route in userRoutes" @click="changeRoute(route)" class="q-cell-1 router-link"><h2>{{ route.name }}</h2></button>
        <button href="#" class="q-cell-1 router-link"><h2>Shop On Etsy »</h2></button>
        <!-- logout button if logged in -->
        <a v-if="userStore.isLoggedIn" class="q-cell-1 button router-link center" href="/api/auth/logout"><h2>Logout</h2></a>
    </div>
</template>

<script setup>
import router, { userRoutes } from '../router';
import { useUserStore } from '../stores/userStore';

const props = defineProps({
    State: Object
});

const userStore = useUserStore();

function changeRoute(route) {
    router.push(route.path);
    props.State.showingMenu = false;
}

</script>

<style scoped>
.router-link {
    background: transparent;
    color: #000;
}
</style>