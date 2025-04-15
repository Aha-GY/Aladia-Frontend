<template>
  <div
    class="relative size-14 cursor-pointer rounded-md transition-all hover:bg-white/5 active:scale-95"
    :class="active ? 'bg-white/5' : 'bg-transparent'"
  >
    <BaseRipple class="!rounded-md">
      <el-tooltip effect="light" :content="tooltip" placement="right">
        <div class="flex h-full w-full items-center justify-center text-base">
          <slot />
        </div>
      </el-tooltip>
      <div
        v-if="active"
        class="absolute left-0 top-0 h-full w-0.5 bg-[#EAB308]"
      />
    </BaseRipple>
  </div>
</template>

<script>
export default {
  props: {
    tooltip: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
