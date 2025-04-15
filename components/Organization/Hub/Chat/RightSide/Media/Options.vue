<template>
  <div
    class="flex flex-col gap-1 rounded-md border border-white/5 bg-[#0C0C0C] p-1 shadow-sm backdrop-blur"
  >
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      @click.stop="onMessage"
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
      @click.stop="onDownload"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-download text-xs" />
      </div>
      <div class="text-sm">
        {{ $t('event.download') }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      @click.stop="onForward(item.id)"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-share text-xs" />
      </div>
      <div class="text-sm">
        {{ isSelect ? $t('event.select.forward') : $t('event.forward') }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      @click.stop="onDelete(item.id)"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-trash text-xs" />
      </div>
      <div class="text-sm">
        {{ $t('base.editor.delete') }}
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded-md p-2 text-white/60 transition-all hover:bg-white/5 hover:text-white/80 active:scale-95"
      @click.stop="isSelect ? onCancel() : onSelect(item.id)"
    >
      <div class="flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-circle-check text-xs" />
      </div>
      <div class="text-sm">
        {{ isSelect ? $t('event.select.clear') : $t('event.select.label') }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    isSelect: Boolean,
    onSelect: Function,
    onDelete: Function,
    onCancel: Function,
    onForward: Function,
  },
  emits: ['locate-message'],
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  methods: {
    onMessage() {
      this.$emit('locate-message', this.item.messageId);
    },
    async onDownload() {
      const blob = await (await fetch(this.item.url)).blob();
      const url = URL.createObjectURL(blob);
      download(url, this.item.name);
      URL.revokeObjectURL(url);
    },
  },
};
</script>
