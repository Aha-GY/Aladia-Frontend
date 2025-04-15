<template>
  <client-only>
    <el-dialog
      :model-value="!!paymentStore.serviceFailedDialog"
      :show-close="false"
      align-center
      append-to-body
      :width="$device.isMobile ? '22rem' : '40rem'"
      height="auto"
      destroy-on-close
      class="!border !border-[#0F0F0F]"
      @close="handleCloseDialog"
    >
      <template v-if="tierDialogContent">
        <div
          class="flex h-fit items-center justify-between rounded-t-md bg-[#0F0F0F] px-6 py-4 text-lg"
        >
          <div class="flex items-center gap-2 text-red-500">
            <i class="fa-regular fa-triangle-exclamation" />
            <span>{{ $t(tierDialogContent.title) }}</span>
          </div>
          <BaseIconClose @click="handleCloseDialog" />
        </div>
        <div class="flex flex-col justify-center bg-[#000000] px-8 py-5">
          <div class="mb-2 flex items-center gap-2 text-base text-[#d9d9d9]">
            <i :class="tierDialogContent.icon" />
            <span>
              {{ $t('payment.serviceDialog.consumed') }}
              <b>{{ tierDialogContent.used }}</b>
              {{ $t('payment.serviceDialog.of') }}
              <b>{{ tierDialogContent.total }}</b>
              {{ tierDialogContent.unit }}.
            </span>
          </div>
          <div class="text-sm text-[#7d7d7d]">
            {{
              $t('payment.serviceDialog.continueUsing', {
                service: tierDialogContent.service,
              })
            }}
          </div>
        </div>
        <div class="flex items-center justify-end gap-4 bg-[#0F0F0F] px-5 py-4">
          <div class="flex items-center justify-end gap-4">
            <BaseButton
              class="rounded-md !py-[1.05rem] px-2"
              :label="$t('base.dialog.close')"
              type="tertiary"
              @click="handleCloseDialog"
            />
            <BaseButton @click="handleAddPaymentMethod">
              {{ $t('payment.serviceDialog.addPaymentMethod') }}
            </BaseButton>
          </div>
        </div>
      </template>

      <template v-else>
        <div
          class="flex h-fit items-center justify-between rounded-t-md bg-[#0F0F0F] px-6 py-4 text-lg"
        >
          <div class="flex items-center gap-2 text-red-500">
            <i class="fa-regular fa-ban" />
            <span>{{ $t('payment.serviceDialog.accountBlocked') }}</span>
          </div>
          <BaseIconClose @click="handleCloseDialog" />
        </div>
        <div class="flex flex-col justify-center bg-[#000000] px-8 py-5">
          <div class="mb-2 flex items-center gap-2 text-base text-[#d9d9d9]">
            {{ $t('payment.serviceDialog.blockedMessage') }}
          </div>
          <div class="text-sm text-[#7d7d7d]">
            {{ $t('payment.serviceDialog.addValidCard') }}
          </div>
        </div>
        <div class="flex items-center justify-end gap-4 bg-[#0F0F0F] px-5 py-4">
          <div class="flex items-center justify-end gap-4">
            <BaseButton @click="handleLinkToFailedTransactions">
              {{ $t('payment.serviceDialog.viewFailedTransactions') }}
            </BaseButton>
          </div>
        </div>
      </template>
    </el-dialog>
  </client-only>
</template>

<script setup>
import { REQUEST_ERROR_MESSAGE } from '~/constant/request';

const paymentStore = usePaymentStore();

const tierDialogContent = computed(() => {
  const errorCode = paymentStore.serviceFailedDialog;
  const contents = {
    [REQUEST_ERROR_MESSAGE[403].FREE_TIER_EXHAUSTED.AI_FREE_TIER_FINISHED
      .errorCode]: {
      title: 'payment.serviceDialog.aiLimitReached',
      icon: 'fa-regular fa-robot',
      used: '3000',
      total: '3000',
      unit: 'Token',
      service: 'AI',
    },
    [REQUEST_ERROR_MESSAGE[403].FREE_TIER_EXHAUSTED.STORAGE_FREE_TIER_FINISHED
      .errorCode]: {
      title: 'payment.serviceDialog.storageLimitReached',
      icon: 'fa-regular fa-server',
      used: '1',
      total: '1',
      unit: 'Gb',
      service: 'storage',
    },
    [REQUEST_ERROR_MESSAGE[403].FREE_TIER_EXHAUSTED.STREAMING_FREE_TIER_FINISHED
      .errorCode]: {
      title: 'payment.serviceDialog.streamingLimitReached',
      icon: 'fa-regular fa-server',
      used: '10',
      total: '10',
      unit: 'Min',
      service: 'streaming',
    },
  };
  return contents[errorCode];
});

function handleCloseDialog() {
  paymentStore.serviceFailedDialog = null;
}

function handleAddPaymentMethod() {
  paymentStore.serviceFailedDialog = null;
  paymentStore.addCardDialog = true;
}

function handleLinkToFailedTransactions() {
  console.log('todo link to failed transactions');
}
</script>
