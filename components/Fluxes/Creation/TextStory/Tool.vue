<template>
  <div class="h-full px-2">
    <div class="h-[calc(100%-3.25rem)] overflow-x-auto">
      <div class="bg-[#0C0C0C]">
        <textarea
          v-model="description"
          :placeholder="$t('index.type.start')"
          class="min-h-[10rem] w-full flex-1 resize-none rounded-5 border-[1px] border-white/10 bg-transparent p-2 text-white/70 outline-none placeholder:text-white/30 focus:border-[#a2842a]"
          @input="handleInput"
        />
      </div>
      <div class="mt-4">
        <el-popover
          v-model:visible="showSelectMenu"
          trigger="click"
          :popper-style="{
            width: '304px',
          }"
        >
          <template #reference>
            <div
              class="group flex h-[2.125rem] w-full cursor-pointer items-center justify-between rounded-5 border border-white/10 bg-[#0C0C0C] p-2"
            >
              <div class="flex flex-1 items-center">
                <i class="fa-regular fa-text" />
                <span class="ml-2 text-[#B0B0B0]">
                  {{ selectShape?.label ? $t(selectShape?.label) : '' }}
                </span>
              </div>
              <i
                class="fa-solid fa-chevron-down text-white transition-all duration-300"
                :class="showSelectMenu ? 'fa-rotate-180' : ''"
              />
            </div>
          </template>
          <BaseSelect :data="selectMenu" class="w-full" @select="onMenuClick" />
        </el-popover>
      </div>
      <div class="mt-4 rounded-5 border border-white/10 p-2">
        <div>{{ $t('flux.highlight.story.background') }}</div>
        <div class="mt-4 flex flex-wrap gap-4">
          <div
            v-for="item of bgList"
            :key="item"
            data-cy="d018921c5946fa4e"
            @click="handleBg(item)"
          >
            <div
              :style="{ backgroundColor: item }"
              class="h-6 w-6 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300"
              :class="
                fluxesStore.createTextStory.color === item
                  ? '!border-[#E0B92C]'
                  : ''
              "
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex items-center justify-between gap-4 rounded-5 bg-[#0c0c0c] py-2"
    >
      <BaseButton
        type="tertiary"
        data-cy="be15d1d05294849e"
        @click="handleBackNav"
      >
        {{ $t('base.upload.cancel') }}
      </BaseButton>
      <BaseButton data-cy="29b7da2ac4d0f408" @click="handleShare">
        <div class="flex size-3 items-center justify-center">
          <i
            v-if="fluxesStore.createTextStory.loading"
            class="fa-light fa-loader animate-spin text-base"
          />
          <i v-else class="fa-solid fa-save text-sm" />
        </div>
        {{ $t('flux.save') }}
      </BaseButton>
    </div>
  </div>
</template>
<script>
import html2canvas from 'html2canvas';

export default {
  setup() {
    const fluxesStore = useFluxesStore();
    return { fluxesStore };
  },
  data() {
    return {
      description: '',
      showSelectMenu: false,
      selectType: {
        label: this.$t('flux.shape.clean'),
        value: 'clean',
      },
      selectMenu: [
        {
          label: this.$t('flux.shape.clean'),
          value: 'clean',
        },
        {
          label: this.$t('flux.shape.casual'),
          value: 'casual',
        },
        {
          label: this.$t('flux.shape.fancy'),
          value: 'fancy',
        },
        {
          label: this.$t('flux.shape.headline'),
          value: 'headline',
        },
      ],
      bgList: [
        '#E0B92C',
        '#2CE0B9',
        '#FF5733',
        '#33FF57',
        '#3357FF',
        '#FF33A6',
        '#33FFF5',
        '#FF8C33',
        '#8C33FF',
        '#FF338C',
        '#33FF8C',
        '#8CFF33',
        '#338CFF',
        '#FF3333',
        '#900C3F',
        '#3333FF',
      ],
      createloading: false,
    };
  },
  computed: {
    selectShape() {
      return this.selectMenu.find(
        (item) => item.value === this.fluxesStore.createTextStory.shape,
      );
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.fluxesStore.createTextStory = {
        content: this.$t('index.type.start'),
        shape: 'clean',
        color: '#E0B92C',
      };
    },
    onMenuClick(item) {
      this.selectType = item;
      this.fluxesStore.createTextStory.shape = item.value;
      this.showSelectMenu = false;
    },
    handleBg(color) {
      this.fluxesStore.createTextStory.color = color;
    },
    handleInput(val) {
      const value = val.target.value;

      this.fluxesStore.createTextStory.content = value
        ? value
        : this.$t('index.type.start');
    },
    handleBackNav() {
      this.fluxesStore.resetTextStory();
      this.$emit('back');
    },
    async handleShare() {
      try {
        this.createloading = true;
        const params = {
          // source: 'platform-story',
          type: 'text',
          content: this.fluxesStore.createTextStory.content,
          background: this.fluxesStore.createTextStory.color,
          visibility: this.fluxesStore.creationVisibility,
        };

        // const files = await this.handleHtml2Img();

        // if (files.length) {
        //   params.files = files;
        // }

        this.$emit('createTextStory', params);

        // await this.fluxesStore.createStories(params);
        // this.$toast.success('share successfully');
        // this.fluxesStore.resetTextStory();
        // this.fluxesStore.creationVisible = false;
        // this.$nextTick(() => {
        //   this.fluxesStore.onceGetLastestStories();
        // });
      } finally {
        this.createloading = false;
      }
    },
    async handleHtml2Img() {
      const files = [];
      const textStoryWrap = document.getElementById('text-story-wrap');
      if (!textStoryWrap) {
        return [];
      }

      const canvas = await html2canvas(textStoryWrap, {
        scale: 1,
      });

      const blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob));
      });
      // 检查 Blob 是否生成成功
      if (!blob) {
        throw new Error(this.$t('flux.blob.generate.failed'));
      }

      // 创建 File 对象
      const file = new File([blob], `exported-image-${Date.now()}.jpeg`, {
        type: 'image/jpeg',
      });

      // 上传文件到后端并获取 fileId
      const { fileId } = await upload({ file });
      files.push({
        fileId,
        metadata: {
          mimetype: file.type,
          size: file.size,
          name: file.name,
        },
      });

      return files;
    },
  },
  reGetStories() {
    this.fluxesStore.storiesData.data = [];
    this.fluxesStore.storiesData.next = null;
    this.fluxesStore.storiesData.loading = false;
    this.fluxesStore.storiesData.totalItems = 0;

    this.fluxesStore.getLastestStories();
  },
};
</script>
