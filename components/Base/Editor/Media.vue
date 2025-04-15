<template>
  <div
    class="__base-editor-media relative mt-4 flex w-full flex-wrap gap-1.5 rounded-5 px-2 pt-1"
  >
    <div
      v-for="(item, index) in medias.slice(0, maxItems)"
      :key="index"
      :class="width"
      class="flex gap-1.5 rounded-md bg-[#060606] p-1.5 hover:bg-white/5"
      @click="item.type === 'loom' ? $emit('itemClick', item) : null"
    >
      <div
        class="flex h-9 w-9 items-center justify-center rounded bg-[#202020]"
      >
        <img
          v-if="(item.src || item.url) && item.type?.includes('image')"
          :src="item.src || item.url"
          class="h-8 rounded object-cover"
        />
        <video
          v-else-if="(item.src || item.url) && item.type?.includes('video')"
          :src="item.src || item.url"
          class="h-8 rounded object-cover"
        />
        <i v-else-if="item.type === 'loom'" class="fa-solid fa-file-video" />
        <i
          v-else
          class="fa-solid"
          :class="getFileType(item.name || item.title)"
        />
      </div>
      <div class="flex w-0 flex-1 flex-col justify-center gap-0.5">
        <div class="text-wihte/80 w-full truncate text-xs">
          {{
            isMediaItemLoom(item) ? getLoomTitle(item) : item.name || item.title
          }}
        </div>
        <div class="text-xs text-[#707070]">
          {{ isMediaItemLoom(item) ? 'Loom' : getFileSize(item.size || 0) }}
        </div>
      </div>
      <div
        v-if="!editorLoading"
        class="cursor-pointer text-sm text-white/50 transition-all duration-300 hover:text-white active:scale-90"
        @click.stop="$emit('remove', item)"
      >
        <i class="fa-light fa-xmark" />
      </div>
    </div>
    <div
      v-if="medias.length > maxItems"
      class="text-semibold absolute right-2 top-0 mt-1.5 flex cursor-pointer items-center justify-end rounded-5 px-3 py-2 text-lg text-white hover:bg-white/5"
      @click="$emit('show')"
    >
      +{{ medias.length - maxItems }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    files: Array,
    looms: Array,
    maxItems: {
      type: Number,
      default: 3,
    },
    width: {
      type: String,
      default: 'w-[30%]',
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    return { globalStore };
  },
  data() {
    return {
      referenceWidth: null,
    };
  },
  computed: {
    medias() {
      return [...this.files, ...this.looms];
    },
    editorLoading() {
      return this.globalStore.editorLoading;
    },
  },

  methods: {
    removeFile(file) {
      this.$emit('remove', file);
    },
  },
};
</script>
