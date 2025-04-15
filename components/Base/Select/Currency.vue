<template>
  <div ref="divRef" class="flex h-56 flex-col gap-1 overflow-y-auto">
    <div
      v-for="item in currency"
      :key="item"
      class="flex cursor-pointer items-center gap-2 rounded-md p-1.5 transition-all hover:bg-white/5 active:scale-95"
      :class="{
        'bg-white/5': item.code === current.code,
      }"
      data-cy="8355d0a9dbe1b060"
      @click="onClick(item)"
    >
      {{ item.currency }}
    </div>
  </div>
</template>
<script setup>
import currency from 'currency-codes/data';

const emits = defineEmits(['select']);
const current = reactive({});
const onClick = (item) => {
  current.value = item;
  emits('select', item);
};
</script>
