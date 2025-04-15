<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarHeader type="space" @close="onClose" />
    <div class="mb-6 px-4 pt-4 text-sm">
      <div class="mb-3 flex items-end gap-2">
        <div
          class="flex size-5 items-center justify-center pb-2 text-13 text-white/50"
        >
          <i class="fa-solid fa-text" />
        </div>
        <BaseInput
          v-model="data.name"
          required
          :title="$t('index.name')"
          :max-length="60"
          show-limit
        />
      </div>
      <el-popover
        ref="colorPopover"
        :width="350"
        placement="bottom"
        trigger="click"
      >
        <template #reference>
          <div class="mb-3 flex cursor-pointer items-end gap-2">
            <div
              class="flex size-5 items-center justify-center pb-2 text-13 text-white/50"
            >
              <div
                class="size-3 rounded-sm bg-white"
                :style="{
                  backgroundColor: data.color,
                }"
              />
            </div>
            <BaseInput
              ref="color"
              v-model="colorTitle"
              readonly
              title="Color"
            />
          </div>
        </template>
        <div>
          <LazyBaseColor
            :color="data.color"
            class="!mb-0"
            @change="onColorChange"
          />
          <div class="px-2 pb-2">
            <BasePopupBottom @close="onColorClose" />
          </div>
        </div>
      </el-popover>
      <el-popover
        ref="iconPopover"
        :width="350"
        trigger="click"
        placement="bottom"
      >
        <template #reference>
          <div class="flex cursor-pointer items-end gap-2">
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
              ref="icon"
              v-model="iconTitle"
              readonly
              :clear="!!imageUrl"
              :size="file?.size || 0"
              :upload="upload"
              :title="$t('space.iconImage')"
              @clear="file = null"
            />
          </div>
        </template>
        <div>
          <LazyBaseIconPicker :icon="data.icon" @change="onIconChange" />
          <div class="px-2 pb-2">
            <BasePopupBottom @close="onIconClose" />
          </div>
        </div>
      </el-popover>
    </div>
    <div class="h-0 flex-1 px-4">
      <div class="text-sm">
        {{ $t('space.activity.label') }}
      </div>
      <div class="flex flex-col items-center pt-12">
        <div class="mb-2 text-sm">
          {{ $t('space.activity.log.empty') }}
        </div>
        <i class="fa-solid fa-list-timeline text-6xl" />
      </div>
    </div>
    <div class="flex items-center justify-between bg-white/5 px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
        data-cy="286c6c3800962904"
        @click="onClose"
      >
        <i v-if="deleting" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-trash-can text-xs" />
        {{ $t('base.upload.cancel') }}
      </div>
      <div
        class="flex items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        :class="loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
        data-cy="a5dd7d30704d1cf5"
        @click="onSave"
      >
        <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-save text-sm" />
        {{ $t('base.upload.save') }}
      </div>
    </div>
  </OrganizationHubSidebarWrap>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();

    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      open: false,
      colorTitle: '',
      iconTitle: '',
      file: null,
      upload: 0,
      deleting: false,
      saving: false,
      loading: false,
      data: {
        name: '',
        color: '',
        icon: '',
        image: {
          fileId: '',
          metadata: {
            name: '',
            size: 0,
            mimetype: '',
          },
        },
      },
    };
  },
  computed: {
    space() {
      return this.hubSidebar.space;
    },
    imageUrl() {
      return this.file ? URL.createObjectURL(this.file) : this.data.image?.url;
    },
    imageName() {
      const name = this.file ? this.file.name : this.data.image?.metadata?.name;
      return truncateString(name || '', 36);
    },
  },
  watch: {
    colorOpen: {
      immediate: true,
      handler(state) {
        if (state) {
          this.colorTitle = 'Pick a color';
          if (this.$refs.color) {
            this.$refs.color.$refs.input.blur();
            this.$refs.color.focus = true;
          }
        } else {
          this.colorTitle = this.data.color;
          if (this.$refs.color) {
            this.$refs.color.$refs.input.blur();
            this.$refs.color.focus = false;
          }
        }
      },
    },
    iconOpen: {
      immediate: true,
      handler(state) {
        if (state) {
          this.upload = 0;
          this.iconTitle = 'Choose an Icon or Upload an Image';
          if (this.$refs.icon) {
            this.$refs.icon.$refs.input.blur();
            this.$refs.icon.focus = true;
          }
        } else {
          this.iconTitle = (this.imageName || this.data.icon || '').replace(
            /fa-/,
            '',
          );
          if (this.$refs.icon) {
            this.$refs.icon.$refs.input.blur();
            this.$refs.icon.focus = false;
          }
        }
      },
    },
  },
  beforeMount() {
    this.data = cloneDeep(this.space.data);
    this.colorTitle = this.data.color;
    this.iconTitle = (this.imageName || this.data.icon || '').replace(
      /fa-/,
      '',
    );
  },
  mounted() {
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  methods: {
    onColorChange(color) {
      this.data.color = color;
      this.colorTitle = color;
    },
    async onIconChange(info) {
      try {
        this.loading = true;
        this.file = null;
        this.upload = 0;
        this.data.icon = '';

        this.data.image = {
          fileId: '',
          metadata: {
            name: '',
            size: 0,
            mimetype: '',
          },
        };

        if (info.icon) {
          this.data.icon = info.icon;
          this.iconTitle = info.icon.replace(/fa-/, '');
        }

        if (info.file) {
          this.file = info.file;
          this.data.icon = '';
          this.iconTitle = truncateString(info.file.name || '', 36);
          this.iconOpen = false;
          const { fileId } = await upload({
            file: info.file,
            onProgress: (progress) => {
              this.upload = (progress / 100) * info.file.size;
            },
          });
          this.data.image.fileId = fileId;
          this.data.image.metadata = {
            name: info.file.name,
            size: info.file.size,
            mimetype: info.file.type,
          };
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async onSave() {
      if (this.loading) {
        return;
      }

      if (!this.data.name) {
        return this.$toast.error(this.$t('event.schedule.error.name'));
      }

      this.saving = true;

      if (this.data.id) {
        const res = await this.hubSpaces.updateSpace({
          spaceId: this.data.id,
          name: this.data.name,
          color: this.data.color || undefined,
          icon: this.data.icon || undefined,
          image: this.data.image?.fileId
            ? {
                fileId: this.data.image.fileId,
                metadata: this.data.image.metadata,
              }
            : undefined,
        });
        this.space.data = Object.assign(this.space.data, {
          name: res.name,
          color: res.color,
          icon: res.icon,
          image: res.image,
        });
      } else {
        const res = await this.hubSpaces.createSpace({
          type: 'courses',
          mode: 'teaching',
          name: this.data.name,
          color: this.data.color || undefined,
          icon: this.data.icon || undefined,
          image: this.data.image?.fileId
            ? {
                fileId: this.data.image.fileId,
                metadata: this.data.image.metadata,
              }
            : undefined,
        });
        this.space.data = Object.assign(this.space.data, res);
      }

      await this.hubSpaces.getSpaces();
      this.space.state = false;
      this.saving = false;
    },
    async onClose() {
      this.open = false;
      await sleep(500);
      this.hubSidebar.space.state = false;
    },
    onColorClose() {
      this.$refs.colorPopover.hide();
    },
    onIconClose() {
      this.$refs.iconPopover.hide();
    },
  },
};
</script>
