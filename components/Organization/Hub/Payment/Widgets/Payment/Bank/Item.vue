<template>
  <div class="relative mb-3 flex items-center justify-between gap-1">
    <!-- bank info -->
    <div class="flex flex-1 items-center">
      <div
        class="mr-2 flex h-8 w-8 items-center justify-center rounded bg-[#D9D9D9]"
      >
        <i class="fa-regular fa-building-columns text-[#202020]" />
      </div>
      <div>
        <div class="flex items-center">
          <div class="mr-2 line-clamp-1 max-w-40 break-all">
            {{ bank.name }}
          </div>
          <div class="flex items-center">
            <span
              class="rounded bg-[#D9D9D9] px-1 text-xs uppercase !text-[#202020]"
            >
              {{ bank.currency }}
            </span>
            <img
              v-if="bank.isDefault"
              class="ml-3 h-2 w-[2.8125rem]"
              src="~/assets/payment/default.svg"
            />
          </div>
        </div>
        <div class="text-xs">
          <span>
            <i class="fa-solid fa-ellipsis-vertical mx-1" />
            {{ bank.routingNumber }}
          </span>
          <span>
            <i class="fa-solid fa-ellipsis-vertical mx-1" />
            {{ `···· ${bank.lastFour}` }}
          </span>
        </div>
      </div>
    </div>

    <!-- operation -->
    <div>
      <div
        ref="popupButtonRef"
        class="h-6 w-6 cursor-pointer rounded-sm text-center hover:bg-white/5"
        data-cy="20efb0b1758f840b"
        @click="popupShow = true"
      >
        <i class="fa-solid fa-ellipsis text-xs text-[#707070]" />
      </div>
      <BasePopup
        :open="popupShow"
        :button-ref="popupButtonRef"
        placement="bottom-end"
        :width="130"
        :popper-style="{ 'min-width': '140px' }"
        class="p-1.5"
      >
        <div ref="popupRef">
          <div
            class="flex items-center rounded-md py-1 text-sm text-[#E5E5E5] hover:bg-white hover:bg-opacity-5"
            :class="
              bank.isDefault
                ? 'cursor-not-allowed opacity-70'
                : 'cursor-pointer'
            "
            data-cy="0219fd9a083bdd87"
            @click="handleClickSetDefault"
          >
            <div class="flex w-5 items-center justify-center">
              <i
                class="fa-solid"
                :class="setLoading ? 'fa-spinner animate-spin' : 'fa-star'"
              />
            </div>
            <span class="ml-1">Set as default</span>
          </div>
          <div
            class="flex items-center rounded-md py-1 text-sm text-[#AE2B26] hover:bg-white hover:bg-opacity-5"
            :class="
              bank.isDefault
                ? 'cursor-not-allowed opacity-90'
                : 'cursor-pointer'
            "
            data-cy="302eeebe78b9998a"
            @click="handleClickDelete"
          >
            <div class="flex w-5 items-center justify-center">
              <i
                class="fa-solid"
                :class="delLoading ? 'fa-spinner animate-spin' : 'fa-trash'"
              />
            </div>
            <span class="ml-1">Delete</span>
          </div>
        </div>
      </BasePopup>
    </div>
  </div>
</template>
<script setup>
import { useToast } from 'vue-toastification';

const props = defineProps({
  bank: {
    type: Object,
    required: true,
  },
});

const paymentStore = usePaymentStore();
const $toast = useToast();
const setLoading = ref(false);
const delLoading = ref(false);
const popupButtonRef = ref(null);
const popupRef = ref(null);
const popupShow = ref(false);

onClickOutside(popupRef, () => {
  popupShow.value = false;
});

async function handleClickSetDefault() {
  if (props.bank.isDefault) {
    return;
  }
  setLoading.value = true;
  await paymentStore.updateBankAccount(props.bank.id, { isDefault: true });
  $toast.success('Default Bank has been set!');
  setLoading.value = false;
}

async function handleClickDelete() {
  if (props.bank.isDefault) {
    return;
  }
  delLoading.value = true;
  await paymentStore.deleteBankAccountById(props.bank.id);
  $toast.success('Bank has been deleted!');
  delLoading.value = false;
}
</script>
