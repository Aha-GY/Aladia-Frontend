<template>
  <div class="h-[calc(100vh-12rem)] overflow-auto">
    <div class="grid grid-cols-9 bg-[#0C0C0C] px-3 text-[#d9d9d9]">
      <div class="col-span-9 col-start-1 mt-2 flex items-center gap-2">
        <i class="fa-regular fa-calendar-clock pl-1 text-xs" />
        <span>
          {{ $t('category.money.subscriptions') }}
        </span>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-5 bg-white/5 p-1"
        >
          {{ subscriptions.length }}
        </div>
      </div>
      <div
        v-for="subscription in subscriptions"
        :key="subscription.id"
        v-loading="subInfoLoadingId === subscription.id"
        class="col-span-9 mb-1.5 mt-2 grid cursor-pointer grid-cols-9 items-center rounded-5 px-3 hover:bg-white/5"
        @click="handleClickSubscriptionItem(subscription.id)"
      >
        <!-- First Row: Date and Status -->
        <div
          class="col-span-9 col-start-1 flex items-center justify-between py-1"
        >
          <span class="text-sm text-[#565656]">
            {{ formatDate(subscription.createdAt, 'DD MMM YYYY, HH:mm') }}
          </span>
          <OrganizationHubPaymentHistoryListStatus
            :item="{ status: subscription.subscriptionStatus }"
          />
        </div>

        <!-- Second Row: Title -->
        <div class="col-span-8 col-start-1 text-base text-[#D9D9D9]">
          {{ subscription.course.title }}
        </div>

        <!-- Third Row: ID, QTY, and Amount -->
        <div
          class="col-span-9 col-start-1 flex items-center justify-between py-1.5"
        >
          <span class="truncate text-xs text-[#565656]">
            {{ `ID: ${subscription.id}` }}
          </span>
          <div class="flex items-center space-x-1">
            <span>{{ `QTY: ${subscription.licencesBought}` }}</span>
            <div class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="subscription.totalPaid"
                  :is-bold="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DIALOG_TITLE_TYPES } from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const hubPaymentStore = useHubPaymentStore();

const subInfoLoadingId = ref(null);
const subscriptions = computed(() => props.item?.data || []);

async function handleClickSubscriptionItem(subscriptionId) {
  if (subInfoLoadingId.value) {
    return;
  }
  subInfoLoadingId.value = subscriptionId;
  const res =
    await hubPaymentStore.getPaymentSubscriptionsDetail(subscriptionId);
  console.log('res', res);
  subInfoLoadingId.value = null;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.SUB_INCOME,
    cacheData: res,
  });
}
</script>
