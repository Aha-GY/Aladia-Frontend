<template>
  <div class="flex h-full flex-col">
    <div class="mx-auto flex items-center gap-4 pb-6">
      <BaseButton
        label="flux.new.story"
        size="large"
        data-cy="44323b2b5fd5bd94"
        @click="handleSwitchModel('story')"
      />
      <BaseButton
        label="$t:flux.new.highlight"
        size="large"
        data-cy="255a1f511e21a168"
        @click="handleSwitchModel('highlight')"
      />
    </div>

    <div
      v-if="fluxesStore.creationTab === 'story'"
      class="flex flex-1 items-center justify-center"
    >
      <div class="flex w-full items-center gap-4 md:w-[28.5rem]">
        <div
          class="gradient-box-1 relative flex h-[20.625rem] w-1/2 cursor-pointer items-center justify-center rounded-5 transition-all hover:opacity-85"
        >
          <input
            ref="file"
            type="file"
            accept="image/*"
            class="absolute inset-0 z-10 opacity-0"
            data-cy="70c0d57f8d10d69a"
            @change="uploadMedia"
          />
          <div class="flex flex-col items-center justify-center">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full bg-black shadow-sm"
            >
              <i class="fa-regular fa-photo-film" />
            </span>
            <span class="pt-2 text-white/90">
              {{ $t('flux.highlight.story.create.photo') }}
            </span>
          </div>
        </div>
        <div
          class="gradient-box-2 flex h-[20.625rem] w-1/2 cursor-pointer items-center justify-center rounded-5 transition-all hover:opacity-85"
          data-cy="f5eaefcff2829dda"
          @click="handleCreateStory('text')"
        >
          <div class="flex flex-col items-center justify-center">
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full bg-black shadow-sm"
            >
              <i class="fa-regular fa-text" />
            </span>
            <span class="pt-2 text-white/90">
              {{ $t('flux.highlight.story.create.text') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="fluxesStore.creationTab === 'highlight'"
      class="hightlight-content w-full flex-1 overflow-y-auto px-[5%]"
    >
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
      <div class="w-full rounded-5 bg-white/50">
        <div class="pt-[150%]" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    return { authStore, fluxesStore };
  },
  methods: {
    handleSwitchModel(model) {
      this.fluxesStore.creationTab = model;
    },
    handleCreateStory(type) {
      this.fluxesStore.isCreatingStory = true;
      this.fluxesStore.storyType = type;
    },
    async getMediaUrl(file) {
      return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function () {
          resolve(this.result);
        };
      });
    },
    async uploadMedia(event) {
      const file = event.target.files[0];
      if (!(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        return this.$toast.error(this.$t('base.upload.error'));
      }
      file.src = await this.getMediaUrl(file);

      this.fluxesStore.createMediaStory.file = file;

      if (file.type.startsWith('image/')) {
        this.fluxesStore.createMediaStory.type = 'image';
      }

      if (file.type.startsWith('video/')) {
        this.fluxesStore.createMediaStory.type = 'video';
      }

      this.handleCreateStory('media');

      event.target.value = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.gradient-box-1 {
  background: linear-gradient(135deg, #e9c238 0%, #5e9df6 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.gradient-box-2 {
  background: linear-gradient(135deg, #e9c238 0%, #ea4c89 50%, #8e44ad 100%);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.hightlight-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: min-content; /* 让每行的高度取决于内容的高度 */
  align-content: start; /* 防止行之间距离过大 */
  gap: 8px;
  max-width: 1680px;
  height: auto;
  margin: 0 auto;
}
</style>
