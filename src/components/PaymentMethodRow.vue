<template>
    <div
      class="payment-method-card"
      :class="{ 'selected': isSelected }"
      @click="$emit('select-card', paymentMethod)"
    >
      <div class="card-content">
        <div class="card-info">
          <img class="card-icon" :src="getCardIcon(paymentMethod)" alt="Card Icon" />
          <span class="card-number">•••• {{ paymentMethod.last4 }}</span>
          <span v-if="paymentMethod.default" class="default-indicator">Default</span>
        </div>
        <div class="card-actions">
          <span v-if="isSelected" class="selected-icon"></span>
          <button
            v-if="paymentMethod.methodId"
            @click.stop="toggleEditButton"
            class="more-options-button"
          >
            <CircleDots class="dots" fill="#000" />
          </button>
        </div>
      </div>
  
      <!-- Edit Buttons -->
      <transition name="fade">
        <div v-if="showingEditRow" class="edit-buttons">
          <button
            @click.stop="makeDefault(paymentMethod)"
            class="default-button"
          >
            Make Default
          </button>
          <button
            @click.stop="deleteCard(paymentMethod)"
            class="delete-button"
          >
            Delete
          </button>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import useBrain from '../composables/useBrain';
  
  import CircleDots from 'vue-material-design-icons/DotsVerticalCircleOutline.vue';
  
  const showingEditRow = ref(false);
  const brain = useBrain();
  
  const props = defineProps({
    paymentMethod: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  });
  
  const emit = defineEmits(['select-card', 'make-default', 'delete-card']);
  
  const cardIcons = {
    visa: 'visa.png',
    mastercard: 'mastercard.png',
    amex: 'amex.png',
    american_express: 'amex.png',
    discover: 'discover-card.svg',
    generic: 'generic-card.svg',
    union_pay: 'union-pay.png',
  };
  
  const getCardIcon = ({ brandCode }) => {
    const icon = cardIcons[brandCode.toLowerCase()] || cardIcons.generic;

    return `/images/cards/${icon}`;
  };
  
  const makeDefault = async (paymentMethod) => {
    await brain.makeDefaultPaymentMethod(paymentMethod.methodId);
    showingEditRow.value = false;
  };
  
  const deleteCard = async (paymentMethod) => {
    if (!confirm('Are you sure you want to delete this card?')) {
      return;
    }
  
    await brain.deletePaymentMethod(paymentMethod.methodId);
  };
  
  const toggleEditButton = () => {
    showingEditRow.value = !showingEditRow.value;
  };
  </script>
  
  <style scoped>
  .payment-method-card {
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .payment-method-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .payment-method-card.selected {
    border-color: #3490dc;
    box-shadow: 0 0 0 2px rgba(52, 144, 220, 0.5);
  }
  
  .card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .card-icon {
    width: 48px;
    height: 32px;
  }
  
  .card-number {
    font-size: 18px;
    font-weight: 500;
  }
  
  .card-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .default-indicator {
    background-color: #e6f3ff;
    color: #3490dc;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    margin-left: 8px;
  }
  
  .selected-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #3490dc;
    position: relative;
  }
  
  .selected-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: white;
  }
  
  .more-options-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #000;
    padding: 4px;
  }
  
  .dots {
    display: flex;
    gap: 2px;
  }
  
  .edit-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 12px;
  }
  
  .default-button,
  .delete-button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .default-button {
    background-color: #e6f3ff;
    color: #3490dc;
  }
  
  .default-button:hover {
    background-color: #cce7ff;
  }
  
  .delete-button {
    background-color: #fde8e8;
    color: #e53e3e;
  }
  
  .delete-button:hover {
    background-color: #fbd5d5;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>  