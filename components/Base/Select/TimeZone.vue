<template>
  <div class="flex h-56 flex-col gap-1 overflow-y-auto">
    <div
      v-for="item in filterZones"
      :key="item"
      class="flex cursor-pointer items-center justify-between gap-2 rounded-md p-1.5 transition-all hover:bg-white/5 active:scale-95"
      :class="{
        'bg-white/5': item.zone === current.zone,
      }"
      @click="onClick(item)"
    >
      <div :data-cy="`${item.key}-time-zone`">{{ item.zone }}</div>
      <div class="text-[#707070]">UTC{{ item.gmt }}</div>
    </div>
    <BaseNoData v-if="filterZones.length === 0" />
  </div>
</template>
<script setup>
import moment from 'moment-timezone';

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['select']);

const Zones = moment.tz.names().map((zone, index) => {
  const gmt = moment.tz(zone).format('Z');
  return {
    key: index,
    zone,
    gmt,
  };
});

const filterZones = computed(() => {
  const name = props.name?.trim()?.match(/^([\w/]+)/);
  if (!name || !name[0]) {
    return Zones;
  } else {
    const data = Zones.filter((item) =>
      item.zone.toLowerCase().includes(name[0].toLowerCase()),
    );
    return data;
  }
});
const current = ref({});
const onClick = (item) => {
  current.value = item;
  emits('select', item);
};
</script>
