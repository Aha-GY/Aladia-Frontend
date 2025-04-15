<template>
  <div class="mb-[1.625rem] rounded-md bg-[#E5E5E506] p-4 text-[#B0B0B0]">
    <div v-if="props.title" class="mb-[1.125rem] text-[1.125rem]">
      {{ props.title }}
    </div>
    <slot name="title" />
    <template v-if="props.singleCol">
      <div class="grid grid-cols-1 gap-4"><slot /></div>
    </template>
    <slot v-else />
    <div v-if="$slots.console" class="mt-4 flex justify-end">
      <slot name="console" />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  singleCol: Boolean,
});
</script>
<style lang="scss" scoped>
:deep(input) {
  color: #b0b0b0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(span) {
  color: #b0b0b0;
}
</style>
