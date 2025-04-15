<template>
  <div
    class="relative flex h-[10.375rem] min-w-[15.625rem] flex-col items-center justify-center !rounded-5 border-[1px] border-white/10 bg-[#060606] py-[12px]"
  >
    <BaseIconClose
      class="absolute right-[11px] top-[12px] text-base font-normal !text-[#fafafa] hover:!bg-transparent"
      data-cy="bcaa1e5ec656ffb"
      @click="handleClose"
    />

    <div class="flex h-[109px] flex-col">
      <div
        class="flex w-full flex-col items-center justify-center gap-[0.375rem] p-2"
      >
        <div
          class="flex size-[1.9375rem] items-center justify-center rounded-full bg-[#35a823] text-center text-[#d9d9d9]"
        >
          <i class="fa-solid fa-check" />
        </div>
        <div class="text-base font-medium text-[#fafafa]">
          {{ $t('flux.message.sent') }}
        </div>
      </div>
      <div class="mx-auto flex items-center justify-between px-[11px] pb-[8px]">
        <BaseButton
          type="tertiary"
          data-cy="e2e9199008b41cd3"
          class="!z-[9999] flex w-full items-center justify-center !gap-2 !rounded-5 bg-[#a98200] !px-[6px] text-center font-normal text-[#0a0a0a] !opacity-100 hover:!bg-[#a98200]/90"
          @click="handleGotoChat"
        >
          <div>
            <i class="fa-light fa-comment-alt" />
          </div>
          <p>
            {{ $t('flux.message.go') }}
          </p>
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.handleClose();
    }, 4000);
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleGotoChat() {
      this.$emit('goto');
    },
  },
};
</script>
