<template>
  <div v-if="!hasGif">
    <slot name="main" v-bind="props" />
  </div>
  <el-tooltip
    v-else
    :content="toolTipContent"
    effect="light"
    placement="top-start"
    :show-after="100"
  >
    <button
      class="relative flex cursor-not-allowed items-center gap-4 rounded-[0.3125rem] p-2 hover:bg-white/5 hover:text-white active:bg-[rgba(255,255,255,0.02)]"
      disabled
    >
      <slot name="button" v-bind="props" />
    </button>
  </el-tooltip>
</template>
<script setup>
const props = defineProps({
  hasGif: {
    type: Boolean,
    default: false,
  },
  toolTipContent: {
    type: String,
    default: '',
  },
});
</script>
