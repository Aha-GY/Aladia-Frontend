<template>
  <div
    class="__base-editor-attachment overflow-hidden transition-all duration-300"
    :class="size === 'sm' ? '__base-editor-attachment--sm' : ''"
  >
    <div class="flex flex-wrap items-center gap-3">
      <div
        v-for="(item, index) in files"
        :key="index"
        class="relative flex w-[13rem] gap-1.5 rounded-md bg-[#060606]"
        :class="[
          isClick ? 'cursor-pointer hover:bg-white/5' : '',
          size === 'sm' ? 'p-0.5' : 'p-1.5',
        ]"
        data-cy="d2ed1e84912e5df3"
        @click.stop="$emit('click', item)"
      >
        <div
          class="flex items-center justify-center rounded bg-[#202020]"
          :class="size === 'sm' ? 'h-4 w-4' : 'h-9 w-9'"
        >
          <img
            v-if="(item.src || item.url) && item.type?.includes('image')"
            :src="item.src || item.url"
            class="rounded object-cover"
            :class="size === 'sm' ? 'h-4 w-4' : 'h-9 w-9'"
          />
          <video
            v-else-if="(item.src || item.url) && item.type?.includes('video')"
            :src="item.src || item.url"
            class="rounded object-cover"
            :class="size === 'sm' ? 'h-4 w-4' : 'h-9 w-9'"
          />
          <i
            v-else
            class="fa-solid"
            :class="[
              getFileType(item.name || item.title),
              size === 'sm' ? 'text-base' : 'text-xl',
            ]"
          />
        </div>
        <div class="relative flex w-0 flex-1 flex-col justify-center gap-0.5">
          <div class="text-wihte/80 w-full truncate text-xs">
            {{
              isMediaItemLoom(item)
                ? getLoomTitle(item)
                : item.name || item.title
            }}
          </div>
          <div v-if="size !== 'sm'" class="text-xs text-[#707070]">
            {{ isMediaItemLoom(item) ? 'Loom' : getFileSize(item.size || 0) }}
          </div>
        </div>
        <div
          v-if="isClose && !editorLoading"
          class="cursor-pointer text-sm text-white/50 transition-all duration-300 hover:text-white active:scale-90"
          data-cy="a9a9da12084ffb44"
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
      default: false,
    },
    size: {
      type: String,
      default: 'md', // sm, md
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    return { globalStore };
  },
  computed: {
    editorLoading() {
      return this.globalStore.editorLoading;
    },
  },
};
</script>
