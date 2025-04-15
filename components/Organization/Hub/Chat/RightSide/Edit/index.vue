<template>
  <div
    class="hide-scrollbar relative flex flex-1 flex-col justify-between overflow-y-auto rounded border border-white/10 bg-black transition-all duration-300"
  >
    <div class="mb-6 flex-1 px-2">
      <div class="p-2 text-sm">
        <div class="mb-3 flex items-end gap-2">
          <div
            class="flex size-5 items-center justify-center pb-2 text-13 text-white/50"
          >
            <i class="fa-solid fa-text" />
          </div>
          <BaseInput
            v-model="data.name"
            required
            title="Name"
            :data-cy="`chat-room-name-${data.name}`"
          />
        </div>
        <div ref="iconRef" class="mb-3 flex cursor-pointer items-end gap-2">
          <div
            class="flex size-5 items-center justify-center pb-2 text-13 text-white/50"
          >
            <i
              v-if="data.icon"
              class="fa-light"
              :class="data.icon"
              :style="{
                color: data.color,
              }"
            />
            <img
              v-else-if="imageUrl"
              :src="imageUrl"
              class="size-5 rounded object-cover"
            />
            <i v-else class="fa-regular fa-image text-white/40" />
          </div>
          <BaseInput
            v-model="fileName"
            readonly
            :clear="!!imageUrl"
            :size="file?.size || 0"
            :upload="upload"
            :title="$t('event.media.image')"
            data-cy="240603009e7c33f7"
            @clear="file = null"
            @click="uploadFile"
          />
          <input
            ref="file"
            type="file"
            accept="image/*"
            class="absolute inset-0 hidden opacity-0"
            data-cy="67602b97e678b4fb"
            @change="onFileChange"
          />
        </div>
        <div class="mb-3 flex items-start gap-1 py-3">
          <div
            class="flex size-5 items-center justify-center pb-2 pt-5 text-13 text-white/50"
          >
            <i class="fa-solid fa-text" />
          </div>
          <div class="relative flex-1">
            <LazyBaseEditor
              v-model="data.description"
              name="description-editor"
              type="textarea"
              :options="{
                placeholder: $t('calendar.description'),
              }"
              area-height="14rem"
              limit-character
              :characters-limit="200"
              :auto-focus="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-[#0c0c0c] px-4 py-2"
  >
    <div
      class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
      data-cy="9a2fa217c6442d7a"
      @click="onClose"
    >
      <i v-if="deleting" class="fa-light fa-loader animate-spin text-base" />
      <i v-else class="fa-light fa-trash-can text-xs" />
      {{ $t('base.upload.cancel') }}
    </div>
    <div
      class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
      data-cy="OrganizationHubChatRightSideEdit-save"
      @click="onSave"
    >
      <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
      <i v-else class="fa-light fa-save text-sm" />
      {{ $t('base.upload.save') }}
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();

    return {
      hubChatStore,
    };
  },
  data() {
    return {
      file: null,
      fileName: '',
      upload: 0,
      deleting: false,
      saving: false,
      uploading: false,
      data: {
        id: '',
        name: '',
        image: '',
        color: ' ',
      },
    };
  },
  computed: {
    room() {
      return this.hubChatStore.roomInfo;
    },
    imageUrl() {
      return this.file ? URL.createObjectURL(this.file) : this.room.image;
    },
    imageName() {
      return this.file ? this.file.name : this.data.image?.metadata?.name;
    },
  },
  mounted() {
    this.data = {
      name: this.room.name,
      description: this.room.description,
      image: this.room.image,
    };
  },
  methods: {
    uploadFile() {
      this.$refs.file.click();
    },
    async onFileChange(event) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        return this.$toast.error(this.$t('auth.signup.image.error'));
      }
      this.data.image = {
        fileId: '',
        metadata: {
          name: '',
          size: 0,
          mimetype: '',
        },
      };
      if (file) {
        this.file = file;
        this.fileName = file.name;
        this.uploading = true;
        const { fileId } = await upload({
          file,
          onProgress: (progress) => {
            this.upload = (progress / 100) * file.size;
          },
        });
        this.data.image.fileId = fileId;
        this.data.image.metadata = {
          name: file.name,
          size: file.size,
          mimetype: file.type,
        };
        this.uploading = false;
      }
    },
    async onSave() {
      if (this.uploading) {
        return this.$toast.error(this.$t('event.media.upload.image'));
      }
      if (!this.data.name) {
        return this.$toast.error(this.$t('event.schedule.error.name'));
      }

      this.saving = true;
      const params = {
        roomId: this.room.id,
        name: this.data.name,
      };
      if (this.file && this.data.image?.fileId) {
        params.image = this.data.image;
      }
      if (this.data.description !== null) {
        params.description = this.data.description;
      }

      await this.hubChatStore.updateRoom(params);

      this.saving = false;
      this.onClose();
    },
    async onClose() {
      this.hubChatStore.rightSiderType = 'info';
    },
  },
};
</script>
