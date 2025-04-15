<template>
  <div>
    <div
      v-if="showAll"
      class="group flex cursor-pointer items-center"
      :class="$device.isMobile ? '' : 'px-3 py-2'"
      @click="() => $emit('back')"
    >
      <span class="flex items-center gap-2 leading-6 text-[#FAFAFA]">
        <span class="translation-all duration-300 group-hover:-translate-x-1">
          <i class="fa-solid fa-arrow-left" />
        </span>
        <span class="text-xs">Back</span>
      </span>
    </div>
    <div
      :class="[
        'relative flex w-full flex-wrap gap-2 rounded-5',
        showAll && 'max-h-[12rem] overflow-y-auto',
      ]"
    >
      <div
        v-for="(item, index) in displayedMedias"
        :key="index"
        :class="width"
        class="flex !h-8 !w-14 gap-2 overflow-hidden rounded-5 bg-[#202020] hover:bg-white/5"
        @click="item.type === 'loom' ? $emit('itemClick', item) : null"
      >
        <div class="flex w-9 items-center justify-center rounded bg-[#202020]">
          <img
            v-if="(item.src || item.url) && item.type?.includes('image')"
            :src="item.src || item.url"
            class="h-8 w-full object-cover"
          />
          <video
            v-else-if="(item.src || item.url) && item.type?.includes('video')"
            :src="item.src || item.url"
            class="h-8 object-cover"
          />
          <i v-else-if="item.type === 'loom'" class="fa-solid fa-file-video" />
          <i
            v-else
            class="fa-solid"
            :class="getFileType(item.name || item.title)"
          />
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
        v-if="!showAll && medias.length > maxItems"
        class="flex size-8 cursor-pointer items-center justify-center rounded-5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/5"
        @click="$emit('show')"
      >
        +{{ medias.length - maxItems }}
      </div>
    </div>
  </div>
</template>

<script>
import { icons } from '~/constant/files';

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
    showAll: {
      type: Boolean,
      default: false,
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
      return [
        ...this.files,
        ...this.looms.map((item) => ({ ...item, type: 'loom' })),
      ];
    },
    displayedMedias() {
      return this.showAll ? this.medias : this.medias.slice(0, this.maxItems);
    },
    editorLoading() {
      return this.globalStore.editorLoading;
    },
  },
  methods: {
    getFileType(url = '') {
      const type = url.split('.').pop().toLowerCase();
      return icons[type] || 'fa-file-image';
    },
    formatFileSize(size) {
      if (!size || isNaN(size)) {
        return 'Unknown Size';
      }
      if (size < 1024) {
        return `${size} B`;
      }
      const i = Math.floor(Math.log(size) / Math.log(1024));
      const units = ['B', 'KB', 'MB', 'GB', 'TB'];
      return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
    },
    removeFile(file) {
      this.$emit('remove', file);
    },
  },
};
</script>
