<template>
  <client-only>
    <BaseCalendar
      v-if="dateValue.length"
      :dates="dateValue"
      shortcut="Month to date"
      button-size="small"
      @change="onDatesChange"
    />
  </client-only>
</template>

<script setup>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

const hubPaymentStore = useHubPaymentStore();

const dateValue = ref([]);

onMounted(() => {
  init();
});

function init() {
  // 默认当前月1号开始
  const defaultStart = dayjs().startOf('month').toDate();
  const defaultEnd = dayjs().toDate();
  dateValue.value = [defaultStart, defaultEnd];
  load();
}

function onDatesChange({ days }) {
  const currentTime = dayjs().format('HH:mm');
  const startDate = dayjs(`${days[0]} ${currentTime}`);
  const endDate = dayjs(`${days[1]} ${currentTime}`);
  dateValue.value = [startDate.toDate(), endDate.toDate()];
  load();
}

async function load() {
  await hubPaymentStore.getPaymentAnalytics(
    dateValue.value[0].toISOString(),
    dateValue.value[1].toISOString(),
  );
}
</script>
