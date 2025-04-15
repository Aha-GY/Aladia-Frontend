<template>
  <div class="flex w-full flex-col gap-2 bg-[#060606] p-2 text-white/80">
    <BaseEditorActionItem :has-gif="hasGif" :tool-tip-content="toolTipContent">
      <template #main>
        <div
          class="relative flex cursor-pointer items-center gap-4 rounded-[0.3125rem] p-2 hover:bg-white/5 hover:text-white active:bg-[rgba(255,255,255,0.02)]"
        >
          <i class="fa-regular fa-image w-4" />
          {{ $t('base.upload.photoOrVideo') }}
          <input
            ref="file"
            type="file"
            multiple
            :disabled="globalStore.editorLoading"
            accept="image/*,video/*"
            class="absolute inset-0 z-10 opacity-0"
            data-cy="93b08b5cfe8e4f01"
            @change="uploadMedia"
          />
        </div>
      </template>
      <template #button>
        <i class="fa-regular fa-image w-4" />
        {{ $t('base.upload.photoOrVideo') }}
      </template>
    </BaseEditorActionItem>
    <BaseEditorActionItem
      v-if="showFile"
      :has-gif="hasGif"
      :tool-tip-content="toolTipContent"
    >
      <template #main>
        <div
          class="relative flex cursor-pointer items-center gap-4 rounded-[0.3125rem] p-2 hover:bg-white/5 hover:text-white active:bg-[rgba(255,255,255,0.02)]"
        >
          <i class="fa-regular fa-file w-4" />
          {{ $t('base.upload.file') }}
          <input
            ref="file"
            type="file"
            multiple
            :disabled="globalStore.editorLoading"
            accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
            class="absolute inset-0 z-10 opacity-0"
            data-cy="3c183ee50ad07844"
            @change="uploadFiles"
          />
        </div>
      </template>
      <template #button>
        <i class="fa-regular fa-file w-4" />
        {{ $t('base.upload.file') }}
      </template>
    </BaseEditorActionItem>

    <div
      v-if="locationAllowed"
      class="flex cursor-pointer items-center gap-4 rounded-[0.3125rem] p-2 hover:bg-white/5 hover:text-white active:bg-[rgba(255,255,255,0.02)]"
      @click="handleLocationPopup"
    >
      <i class="fa-regular fa-location-dot w-4" />
      {{ $t('base.upload.location') }}
    </div>
    <BaseEditorActionLoom
      v-if="!$device.isMobile && showLoom"
      :with-action-tool-tip="true"
      :has-gif="hasGif"
      :tool-tip-content="toolTipContent"
      @loom="(video) => $emit('loom', video)"
    />
  </div>
</template>
<script>
export default {
  props: {
    locationAllowed: {
      type: Boolean,
      default: false,
    },
    showLoom: {
      type: Boolean,
    },
    showFile: {
      type: Boolean,
    },
    hasGif: {
      type: Boolean,
      default: false,
    },
    toolTipContent: {
      type: String,
      default: '',
    },
  },
  emits: ['upload', 'close'],
  setup() {
    const globalStore = useGlobalStore();
    return { globalStore };
  },
  methods: {
    onChange(label) {
      switch (label) {
        case '':
          break;
      }
    },
    handleLocationPopup() {
      if (this.globalStore.editorLoading) {
        return;
      }
      this.globalStore.editorLocationPickerVisible = true;
    },
    async uploadMedia(event) {
      if (this.globalStore.editorLoading) {
        return;
      }
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          !(file.type.startsWith('image/') || file.type.startsWith('video/'))
        ) {
          return this.$toast.error(this.$t('base.upload.error'));
        }
        file.src = await getMediaUrl(file);
        if (file.type.startsWith('image/')) {
          file.dimensions = await getImageDimensions(file);
        } else {
          file.dimensions = await getVideoDimensions(file);
        }
        this.$emit('upload', file);
      }
      event.target.value = '';
    },
    async uploadFiles(event) {
      if (this.globalStore.editorLoading) {
        return;
      }
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.$emit('upload', file);
      }
      event.target.value = '';
    },
  },
};
</script>
