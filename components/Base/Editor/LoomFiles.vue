<template>
  <div
    class="__base-editor-loom-files overflow-hidden transition-all duration-300"
  >
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-for="(item, index) in files"
        :key="index"
        class="relative flex w-[13rem] gap-1.5 rounded-md bg-[#060606] p-1.5"
        :class="isClick ? 'cursor-pointer hover:bg-white/5' : ''"
        data-cy="a694e02ae424f395"
        @click.stop="$emit('itemClick', item)"
      >
        <div
          class="flex h-9 w-9 items-center justify-center rounded bg-[#202020]"
        >
          <i class="fa-solid fa-file-image" />
        </div>
        <div class="relative flex w-0 flex-1 flex-col justify-center gap-0.5">
          <div class="text-wihte/80 w-full truncate text-xs">
            {{
              isMediaItemLoom(item)
                ? getLoomTitle(item)
                : item.name || item.title
            }}
          </div>
          <div class="text-xs text-[#707070]">
            {{ isMediaItemLoom(item) ? 'Loom' : getFileSize(item.size || 0) }}
          </div>
        </div>
        <div
          v-if="isClose && !loading"
          class="cursor-pointer text-sm text-white/50 transition-all duration-300 hover:text-white active:scale-90"
          data-cy="29313f4adf7de03f"
          @click.stop="$emit('remove', item)"
        >
          <i class="fa-light fa-xmark" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: Array,
    isClose: {
      type: Boolean,
      default: true,
    },
    isClick: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    return { globalStore };
  },
  computed: {
    loading() {
      return this.globalStore.editorLoading;
    },
  },
};
</script>
