<template>
  <div class="group flex items-center gap-2 overflow-hidden capitalize">
    {{ getFrequencyI18nText(subscriptionInfo.frequency)[0] }}
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const { t } = useI18n();
const productId = computed(() => props.item.productId);
const subscriptionInfo = computed(() => {
  const { cycleId } = props.item;
  return productId.value.subscriptionInfo[cycleId];
});
const getFrequencyI18nText = (frequency) => {
  switch (frequency) {
    case 'day':
      return [
        t('index.interval.name.daily'),
        t('index.interval.name.day', { count: 1 }),
      ];
    case 'week':
      return [
        t('index.interval.name.weekly'),
        t('index.interval.name.days', { count: 7 }),
      ];
    case 'month':
      return [
        t('index.interval.name.monthly'),
        t('index.interval.name.days', { count: 30 }),
      ];
    default:
      return [
        t('index.interval.name.invalid'),
        t('index.interval.name.invalid'),
      ];
  }
};
</script>
