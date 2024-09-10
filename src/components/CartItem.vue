<template>
  <div class="flex items-center justify-between py-6 border-b border-gray-200">
    <!-- Thumbnail -->
    <div class="w-20 h-20 flex-shrink-0">
      <router-link :to="'products/' + item.title" class="block w-full h-full">
        <img :src="item.coverPhoto" :alt="item.name" class="w-full h-full object-cover rounded-md shadow-sm" />
      </router-link>
    </div>

    <!-- Details -->
    <div class="flex-grow ml-4">
      <h3 class="text-lg font-semibold">
        <router-link :to="'products/' + item.title" class="text-gray-800 hover:text-blue-600 transition duration-150 ease-in-out">
          {{ item.title }}
        </router-link>
      </h3>
      <p class="text-gray-600 mt-1">{{ formattedPrice }}</p>
    </div>

    <!-- Quantity and Actions -->
    <div class="flex items-center space-x-2">
      <div class="flex items-center bg-gray-100 rounded-full">
        <button @click="updateQuantity(-1)" class="p-1.5 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out">
          <Minus class="w-4 h-4" />
        </button>
        <span class="px-2 py-1 text-gray-800 text-xl font-bold">{{ item.qty }}</span>
        <button @click="updateQuantity(1)" class="p-1.5 text-gray-600 hover:text-gray-800 transition duration-150 ease-in-out">
          <Plus class="w-4 h-4" />
        </button>
      </div>
      <div class="relative">
        <button @click="toggleActions" class="p-1.5 text-gray-700 hover:text-gray-600 transition duration-150 ease-in-out">
          <MoreVertical class="w-4 h-4" />
        </button>
        <div v-if="showActions" class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
          <button @click="emitRemoveItem" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition duration-150 ease-in-out">
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { formatAsPrice } from '../utils/formats';
import { Plus, Minus, MoreVertical } from 'lucide-vue-next';

const props = defineProps({ 
  item: {
    type: Object,
    required: true
  }
});

const emits = defineEmits(['update-qty', 'remove-item']);

const formattedPrice = computed(() => {
  return formatAsPrice((props.item.price * props.item.qty));
});

const showActions = ref(false);

function updateQuantity(amount) {
  emits('update-qty', props.item.title, Number(amount));
}

function emitRemoveItem() {
  emits('remove-item', props.item.title);
  showActions.value = false;
}

function toggleActions() {
  showActions.value = !showActions.value;
}
</script>