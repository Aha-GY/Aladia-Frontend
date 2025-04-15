<template>
  <el-dialog
    id="base-dialog"
    :show-close="false"
    :lock-scroll="props.isLockedScroll"
    append-to-body
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
    class="!absolute bottom-0 left-0 right-0 top-0 !m-[auto] h-fit !rounded-lg !bg-transparent"
  >
    <template #header="{ close, titleId, titleClass }">
      <div
        class="flex flex-row items-center justify-between rounded-t-lg border-[1px] border-b-0 border-white/10 bg-[#0C0C0C] p-4"
      >
        <div class="flex flex-row items-center">
          <slot name="titleIcon" />
          <div :id="titleId" :class="` ${titleClass} ${props.titleClass}`">
            {{ props.title }}
          </div>
        </div>
        <BaseIconClose data-cy="0c449f8d98d3e9e7" @click="close" />
      </div>
    </template>
    <div
      class="overflow-hidden rounded-b-lg border-[1px] border-t-0 border-white/10 bg-[#060606] p-5 pr-[0.5rem]"
      :class="{ '!p-0': !props.needPadding }"
    >
      <slot />
    </div>
  </el-dialog>
</template>
<script setup>
const props = defineProps({
  title: String,
  titleClass: {
    type: String,
    default: '!text-xl !text-[#b0b0b0]',
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  closeOnClickModal: {
    type: Boolean,
    default: true,
  },
  needPadding: {
    type: Boolean,
    default: true,
  },
  isLockedScroll: {
    type: Boolean,
    default: false,
  },
});
</script>
