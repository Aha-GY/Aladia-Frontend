<template>
  <el-popover
    v-model:visible="open"
    trigger="click"
    :show-arrow="false"
    :popper-style="{
      padding: '0px !important',
      width: '30rem',
    }"
    :teleported="false"
  >
    <template #reference>
      <div
        class="relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-base leading-none transition-all hover:bg-white/10 active:scale-95"
        :class="open ? 'bg-white/10' : 'text-[#D9D9D9]/80 hover:text-[#D9D9D9]'"
        @mouseenter="hover = true"
        @mouseleave="hover = false"
      >
        <BaseRipple class="!rounded-md">
          <i
            class="fa-grid-2"
            :class="hover || open ? 'fa-solid' : 'fa-light'"
          />
        </BaseRipple>
      </div>
    </template>
    <HeaderMenu />
  </el-popover>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      hover: false,
    };
  },
};
</script>
