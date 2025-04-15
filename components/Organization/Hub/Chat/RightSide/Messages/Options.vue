<template>
  <div
    class="flex flex-col gap-1 rounded-5 border border-white/5 bg-[#0C0C0C] p-1"
  >
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80"
      data-cy="941ac71cb07fa99c"
      @click="$emit('locate-message')"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-eye text-xs" />
      </div>
      <div class="text-sm">
        {{ $t('org.activity.message.goTo') }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      @click.stop="onForward(item.id)"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-share text-xs" />
      </div>
      <div class="text-sm">{{ isSelect ? 'Forward selected' : 'Forward' }}</div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      @click.stop="isSelect ? onCancel() : onSelect(item.id)"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-circle-check text-xs" />
      </div>
      <div class="text-sm">{{ isSelect ? 'Clear selection' : 'Select' }}</div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      @click.stop="onDelete(item.id)"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-trash text-xs" />
      </div>
      <div class="text-sm">Delete</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    isSelect: Boolean,
    onSelect: Function,
    onCancel: Function,
    onForward: Function,
    onDelete: Function,
  },
  emits: ['locate-message'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
};
</script>
