<template>
  <client-only>
    <el-dialog
      v-model="dialogShow"
      :show-close="false"
      align-center
      append-to-body
      :width="$device.isMobile ? '22rem' : '26rem'"
      destroy-on-close
      @close="handleCloseDialog"
      @open="handleInit"
    >
      <!-- header -->
      <div
        class="flex items-center justify-between rounded-t-md bg-[#0C0C0C] px-4 py-3.5"
      >
        <div class="bg-[#0C0C0C] text-base text-[#B0B0B0]">
          <i class="fa-regular fa-credit-card mr-2.5" />
          <span>
            {{ $t('payment.title') }}
          </span>
        </div>
        <BaseIconClose data-cy="c17337f76505bc1c" @click="handleCloseDialog" />
      </div>
      <!-- body -->
      <div
        class="flex flex-col items-center justify-center bg-[rgb(7,7,7)] py-[1.9375rem]"
      >
        <div
          class="relative mb-6 w-[21.5rem] overflow-hidden text-xs transition-all duration-500"
          :style="{ opacity: flipAnimation ? 0 : 1 }"
        >
          <div
            class="absolute -top-[12.25rem] left-20 h-[24rem] w-[30rem] skew-x-[60deg] overflow-hidden bg-gradient-to-tr from-[#191d20] to-[#000000] transition-all duration-500"
          />
          <PaymentCheckoutCompsEmptyCard @flip="handleClickFlip" />
        </div>

        <i
          v-if="initLoading"
          class="fa-solid fa-spinner animate-spin text-xs"
        />
        <div v-else class="flex w-full items-center justify-between px-12 pb-4">
          <span class="text-xs text-[#707070]">
            {{ $t('payment.setAsDefault') }}
          </span>
          <BaseSwitcher :active="isDefault" @change="isDefault = !isDefault" />
        </div>
        <div id="payment-element" />
      </div>
      <!-- footer -->
      <div class="flex items-center justify-end bg-[#0C0C0C] p-4">
        <BaseButton
          class="mr-5"
          label="$t:base.upload.cancel"
          type="tertiary"
          data-cy="close-dialog"
          @click="handleCloseDialog"
        />
        <BaseButton
          :loading="addLoading"
          data-cy="add-new-card"
          @click="handleClickAddNewCard"
        >
          {{ $t('org.card.add') }}
        </BaseButton>
      </div>
    </el-dialog>
  </client-only>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const { t } = useI18n();

const $toast = useToast();
const paymentStore = usePaymentStore();
const initLoading = ref(false);
const addLoading = ref(false);
const isDefault = ref(true);
const flipAnimation = ref(false);
const dialogShow = computed(() => paymentStore.addCardDialog);

async function handleInit() {
  try {
    initLoading.value = true;
    const paymentElement = await paymentStore.initStripePaymentElement();
    await nextTick();
    paymentElement.mount('#payment-element');
    // paymentElement.on('change', (event) => {
    //   console.log('event', event);
    // });
  } catch (error) {
    console.error('handleInit', error);
  } finally {
    initLoading.value = false;
  }
}

function handleCloseDialog() {
  paymentStore.addCardDialog = false;
}

function handleClickFlip() {
  flipAnimation.value = true;

  setTimeout(() => {
    flipAnimation.value = false;
  }, 300);
}

async function handleClickAddNewCard() {
  addLoading.value = true;
  const saveRes = await paymentStore.saveCardToStripe();
  if (saveRes.error) {
    $toast.error(saveRes.error);
    addLoading.value = false;
    return;
  }

  const { paymentMethodId } = saveRes;
  const addRes = await paymentStore.postStripePaymentMethod({
    paymentMethodId,
    isDefault: isDefault.value,
    toRefreshList: true,
  });
  addLoading.value = false;
  if (addRes) {
    $toast.success(t('payment.card.added'));
    handleCloseDialog();
  }
}
</script>
