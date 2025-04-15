<template>
  <div
    class="relative overflow-hidden rounded-md text-xs text-[#D9D9D9] backdrop-blur"
  >
    <div class="relative h-[10rem] w-full">
      <BaseCourseThumbnail class="h-full w-full" :url="courseItem?.thumbnail" />
      <!-- <div class="rounded-br-md bg-[#FEF0D9] p-1.5 text-xs text-[#101010]">
        {{ timeStamp }}
      </div> -->
      <!-- course type -->
      <div class="absolute right-3 top-3 rounded-md bg-black/60 p-1.5 text-xs">
        <BaseCourseType :type="courseItem?.type" />
      </div>
    </div>

    <!-- course owner -->
    <div class="flex p-4">
      <BaseAvatarNext
        :picture="courseOwner?.picture"
        :online="courseOwner?.online"
        :show-online="false"
        size="md"
      />
      <div class="ml-2 w-[12rem]">
        <div class="text-xs text-[#555555]">
          {{ courseOwner?.username }}
        </div>
        <div class="truncate text-sm font-semibold text-[#D9D9D9]">
          {{ courseItem?.title }}
        </div>
      </div>
    </div>

    <!-- course price... -->

    <OrganizationHubPaymentHistoryListProductPopoverSpendingOnePay
      v-if="popupType === 0"
      :item="item"
    />
    <OrganizationHubPaymentHistoryListProductPopoverSpendingSubFee
      v-if="popupType === 1"
      :item="item"
    />
    <OrganizationHubPaymentHistoryListProductPopoverSpendingSubPay
      v-if="popupType === 2"
      :item="item"
    />
    <OrganizationHubPaymentHistoryListProductPopoverIncomeOnePay
      v-if="popupType === 3"
      :item="item"
    />
    <OrganizationHubPaymentHistoryListProductPopoverIncomeSubFee
      v-if="popupType === 4"
      :item="item"
    />
    <OrganizationHubPaymentHistoryListProductPopoverIncomeSubPay
      v-if="popupType === 5"
      :item="item"
    />
    <OrganizationHubPaymentHistoryListProductPopoverSpendingSubscription
      v-if="popupType === 6"
      :item="item"
    />
    <OrganizationHubPaymentHistoryListProductPopoverIncomeSubscription
      v-if="popupType === 7"
      :item="item"
    />
  </div>
</template>

<script setup>
import { QUERY_PARAMS } from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const courseItem = computed(() => props.item.course);
const courseOwner = computed(() => props.item.recipient?.owner);
const isSubscription = computed(() => !!props.item.subscriptionStatus);

const popupType = computed(() => {
  // return undefined;

  const {
    purpose,
    isIncoming: transcationIsIncome,
    feeTransaction,
  } = props.item;
  const isIncome = transcationIsIncome || feeTransaction?.isIncoming;
  const { ONE_TIME_PAYMENT, SUBSCRIPTION_FEE, RECURRING_PAYMENT } =
    QUERY_PARAMS.PURPOSE;
  if (!isIncome) {
    if (purpose === ONE_TIME_PAYMENT) {
      return 0;
    }
    if (purpose === SUBSCRIPTION_FEE) {
      return 1;
    }
    if (purpose === RECURRING_PAYMENT) {
      return 2;
    }
    if (isSubscription.value) {
      return 6;
    }
  }

  if (isIncome) {
    if (purpose === ONE_TIME_PAYMENT) {
      return 3;
    }
    if (purpose === SUBSCRIPTION_FEE) {
      return 4;
    }
    if (purpose === RECURRING_PAYMENT) {
      return 5;
    }
    if (isSubscription.value) {
      return 7;
    }
  }

  console.error('wrong popup type');
  return undefined;
});
</script>
