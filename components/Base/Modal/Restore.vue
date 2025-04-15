<template>
  <div>
    <div
      class="flex h-12 items-center justify-between rounded-t-sm bg-white/5 px-4"
    >
      <div class="flex items-center gap-2">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <BaseIconClose data-cy="1e06e20f945af97c" @click="$emit('close')" />
    </div>

    <div class="flex h-24 items-center px-4">
      <slot name="content">
        {{ content }}
      </slot>
    </div>

    <div class="flex items-center justify-between bg-white/5 px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
        data-cy="209a582905b01b3c"
        @click="$emit('close')"
      >
        <i class="fa-light fa-trash-can text-xs" />
        {{ cancelText }}
      </div>

      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="13c9c684571d337f"
        @click="$emit('confirm')"
      >
        <i v-if="loading" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-check text-sm" />
        {{ confirmText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
    confirmText: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'confirm'],
};
</script>
