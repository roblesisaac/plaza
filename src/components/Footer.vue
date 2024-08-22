<template>
    <div>
        <Contact />
        <div class="bg-[#8c9687] p-8 text-black flex items-center justify-between">
            <div class="max-w-[70%]">
                <a href="#" @click="location.reload()" class="text-black font-bold text-3xl underline leading-tight">
                    Garden Hanger
                </a>
                <br />
                <span>Hang your favorite plants, no tools required</span>
                <div class="mt-4 space-x-4">
                    <router-link to="privacy" class="text-black hover:underline">Privacy</router-link>
                    <router-link to="terms" class="text-black hover:underline">Terms</router-link>
                </div>
            </div>
            <div class="flex-none text-right flex items-center">
                <Facebook class="mx-2" :size="40" />
                <Instagram class="mx-2" :size="40" />
            </div>
        </div>
    </div>
</template>

<script setup>
import Contact from './Contact.vue';
import Facebook from 'vue-material-design-icons/Facebook.vue';
import Instagram from 'vue-material-design-icons/Instagram.vue';
</script>

<style scoped>
a {
    font-family: 'Novecento Slab Bold';
}
</style>