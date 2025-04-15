<template>
  <div
    class="col-span-7 flex items-center gap-1.5 transition-colors"
    :class="[
      active
        ? 'text-[#D9D9D9'
        : 'cursor-pointer text-[#707070] hover:text-[#D9D9D9]',
    ]"
  >
    <div v-if="iconClass" class="w-4 text-center">
      <i :class="iconClass" />
    </div>
    <span>
      {{ titleText }}
    </span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import { DIALOG_TITLE_TYPES } from '~/constant/payment';

const props = defineProps({
  dataType: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  viewAllTotal: {
    type: Number,
    default: 0,
  },
});

const { t } = useI18n();

const iconClass = computed(() => {
  switch (props.dataType) {
    case DIALOG_TITLE_TYPES.TRANS_INCOME:
    case DIALOG_TITLE_TYPES.TRANS_SPENDING:
    case DIALOG_TITLE_TYPES.CUS_VIEW_ALL_TRANS:
    case DIALOG_TITLE_TYPES.PAYOUT_VIEW_ALL_TRANS:
      return 'fa-regular fa-money-bills';
    case DIALOG_TITLE_TYPES.SUB_INCOME:
    case DIALOG_TITLE_TYPES.SUB_SPENDING:
    case DIALOG_TITLE_TYPES.CUS_VIEW_ALL_SUBS:
      return 'fa-light fa-calendar-clock';
    case DIALOG_TITLE_TYPES.PAYOUT:
      return 'fa-regular fa-square-dollar';
    case DIALOG_TITLE_TYPES.CUSTOMER:
      return 'fa-regular fa-user';
    default:
      return null;
  }
});

const titleText = computed(() => {
  switch (props.dataType) {
    case DIALOG_TITLE_TYPES.TRANS_INCOME:
    case DIALOG_TITLE_TYPES.TRANS_SPENDING:
      return t('category.transaction.label');
    case DIALOG_TITLE_TYPES.SUB_INCOME:
    case DIALOG_TITLE_TYPES.SUB_SPENDING:
      return t('category.money.subscription');
    case DIALOG_TITLE_TYPES.PAYOUT:
      return t('category.payout.label');
    case DIALOG_TITLE_TYPES.CUSTOMER:
      return 'Customer';
    case DIALOG_TITLE_TYPES.CUS_VIEW_ALL_SUBS:
      return t('category.money.subscriptions');
    case DIALOG_TITLE_TYPES.CUS_VIEW_ALL_TRANS:
      return t('category.transaction.label2');
    case DIALOG_TITLE_TYPES.PAYOUT_VIEW_ALL_TRANS:
    default:
      return `Payout Transactions`;
  }
});
</script>
