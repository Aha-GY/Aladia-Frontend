<template>
  <BaseSelect :data-cy="dataCy" :data="type === 'year' ? Year : Month" />
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  type: {
    type: String,
    default: 'month', // month、year
  },
  endYear: {
    type: [Number, String],
    default: new Date().getFullYear(),
  },
  startYear: {
    type: [Number, String],
    default: new Date().getFullYear() - 50,
  },
  disabledMonth: {
    type: Array,
    default: () => [],
  },
  dataCy: {
    type: String,
    default: '',
  },
});
const { t } = useI18n();
const Year = computed(() => {
  const endYear = props.endYear || new Date().getFullYear();
  const startYear = props.startYear || new Date().getFullYear() - 50;
  return new Array(endYear - startYear)
    .fill(0)
    .reduce((total) => [...total, total.at(-1) - 1], [endYear])
    .map((label) => ({ label, key: label }));
});
const Month = computed(() => {
  const list = [
    'index.month.long.jan',
    'index.month.long.feb',
    'index.month.long.mar',
    'index.month.long.apr',
    'index.month.long.may',
    'index.month.long.jun',
    'index.month.long.jul',
    'index.month.long.aug',
    'index.month.long.sep',
    'index.month.long.oct',
    'index.month.long.nov',
    'index.month.long.dec',
  ];
  const monthList = list.map((label, index) => {
    const key = index + 1;
    return {
      label: t(label),
      key,
      disabled: props.disabledMonth.includes(key),
    };
  });
  return monthList;
});
</script>
