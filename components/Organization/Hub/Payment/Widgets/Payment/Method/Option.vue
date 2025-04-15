<template>
  <div class="flex flex-col gap-1 text-[#707070]">
    <div
      class="flex items-center gap-1 rounded-md p-2 text-sm transition-all hover:bg-white/5 hover:text-[#D9D9D9]"
      :class="
        disabledClick ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
      "
      data-cy="1c5ce1098f8a6a8a"
      @click="handleClickSetDefault"
    >
      <i
        class="fa-solid"
        :class="setLoading ? 'fa-spinner animate-spin' : 'fa-star'"
      />
      Set As Default
    </div>
    <div
      class="flex items-center gap-2 rounded-md p-2 text-sm text-[#EA4848] transition-all hover:bg-white/5"
      :class="
        disabledClick ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
      "
      data-cy="852f60c97729cbe0"
      @click="handleClickDelete"
    >
      <i
        class="fa-solid"
        :class="delLoading ? 'fa-spinner animate-spin' : 'fa-trash'"
      />
      Delete Card
    </div>
  </div>
</template>
<script setup>
import { useToast } from 'vue-toastification';

const emits = defineEmits(['hide-popup']);

const $toast = useToast();
const paymentStore = usePaymentStore();
const setLoading = ref(false);
const delLoading = ref(false);
const currentPaymentMethod = computed(() => {
  if (!paymentStore.paymentMethods.length) {
    return null;
  } else {
    return paymentStore.paymentMethods[paymentStore.selectedPaymentMethodIndex];
  }
});
const disabledClick = computed(
  () =>
    currentPaymentMethod.value === null ||
    currentPaymentMethod.value?.isDefault,
);

async function handleClickSetDefault() {
  if (currentPaymentMethod.value?.defaultPaymentMethod) {
    return;
  }
  if (setLoading.value) {
    return;
  }
  setLoading.value = true;
  await paymentStore.setDefaultPaymentMethod({
    paymentMethodId: currentPaymentMethod.value.stripeId,
  });
  $toast.success('Default payment method has been set!');
  setLoading.value = false;
  emits('hide-popup');
}

async function handleClickDelete() {
  if (currentPaymentMethod.value?.defaultPaymentMethod) {
    return;
  }
  if (delLoading.value) {
    return;
  }
  delLoading.value = true;
  await paymentStore.deleteStripePaymentMethodById(
    currentPaymentMethod.value.stripeId,
  );
  $toast.success('Payment methed has been deleted!');
  delLoading.value = false;
  emits('hide-popup');
}
</script>
