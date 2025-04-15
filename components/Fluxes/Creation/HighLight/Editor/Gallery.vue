<template>
  <div class="flex h-full w-full flex-col">
    <div ref="container" v-loading="loading" class="flex-1 overflow-hidden">
      <el-scrollbar
        ref="scroll"
        wrap-class="h-full overflow-x-hidden"
        @scroll="onScroll"
      >
        <div ref="list" class="h-full w-full overflow-hidden">
          <div class="mx-auto w-[98%] py-2 md:w-[70%]">
            <div class="flex flex-wrap items-center">
              <div
                v-for="story in data"
                :key="story.id"
                class="relative w-1/4 cursor-pointer px-3 py-2"
                :data-cy="`${dataCy}-stories`"
                @click="handleSelect(story)"
              >
                <BaseCheckboxStyle
                  class="absolute right-5 top-4 z-[1] h-5 w-5 rounded-full border-2 border-[#060606] bg-[#060606]"
                  :data-cy="`${dataCy}-story-selector`"
                  :state="
                    checkedList.includes(story.id)
                      ? 'correctChecked'
                      : 'unchecked'
                  "
                />
                <div
                  class="absolute left-5 top-4 z-[1] flex size-9 flex-col items-center justify-center rounded-5 bg-[#101010] text-center text-xs text-[#FAFAFA]"
                >
                  <div class="font-semibold">
                    {{ new Date(story.createdAt)?.getDate() }}
                  </div>
                  <div>{{ $t(monthAbbreviations(story.createdAt)) }}</div>
                </div>
                <FluxesCreationHighLightWigetsNewCard :item="story" />
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div
      class="footer absolute bottom-5 left-1/2 z-10 flex w-[calc(100%-2rem)] -translate-x-1/2 items-center justify-between rounded-5 bg-black/60 px-4 py-2 text-[#FAFAFA] md:w-[28.875rem]"
    >
      <div>{{ checkedList.length }} {{ $t('flux.selected') }}</div>
      <div class="flex items-center gap-6">
        <BaseButton
          class="!opacity-100"
          type="tertiary"
          data-cy="c44ea5a0c6aa6c1d"
          @click="$emit('close')"
        >
          <span class="text-[#FAFAFA]">{{ $t('base.upload.cancel') }}</span>
        </BaseButton>
        <BaseButton
          :data-cy="`${dataCy}-addToHighlight-button`"
          @click="handleSave"
        >
          <span>{{ $t('flux.highlight.title') }}</span>
        </BaseButton>
      </div>
    </div>
    <!-- <div class="flex items-center justify-end gap-4 px-2 py-4">
      <BaseButton type="tertiary" @click="$emit('close')" data-cy="fad24f7d3eb490d3">Cancel</BaseButton>
      <BaseButton @click="handleSave" data-cy="46504873d219b150">Save</BaseButton>
    </div>  -->
  </div>
</template>

<script>
export default {
  props: {
    dataCy: {
      type: String,
      default: 'default-highlight-editor',
    },
    index: Number,
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const authStore = useAuthStore();
    return { fluxesStore, authStore };
  },
  data() {
    return {
      isScroll: false,
      data: [],
      next: null,
      loading: false,
      checkeds: [],
    };
  },
  computed: {
    user() {
      return this.authStore.context;
    },
    activeStories() {
      return this.fluxesStore.createMediaList.data.map((item) => item.id);
    },
    checkedList() {
      return [...this.activeStories, ...this.checkeds];
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      try {
        this.loading = true;

        const {
          data,
          cursor: { next },
        } = await this.fluxesStore.searchStories({
          ownerId: this.user,
          next: this.next,
          limit: 20,
          sortDirection: 'desc',
        });

        this.next = next;
        this.data = [...this.data, ...data];
      } finally {
        this.loading = false;
      }
    },
    onScroll(e) {
      const { scrollTop } = e;
      if (scrollTop > 0) {
        this.isScroll = true;
        if (
          Math.round(this.$refs.container.offsetHeight) + scrollTop >=
            this.$refs.list.clientHeight &&
          this.next &&
          !this.loading
        ) {
          this.load();
        }
      } else {
        this.isScroll = false;
      }
    },
    handleSelect(story) {
      if (this.checkedList.includes(story.id)) {
        this.checkeds = this.checkeds.filter((id) => id !== story.id);
      } else {
        this.checkeds = [...this.checkeds, story.id];
      }
    },
    handleSave() {
      const select = [];

      this.data.forEach((item) => {
        if (this.checkeds.includes(item.id)) {
          select.push({ ...item, _isFromGallery: true });
        }
      });

      this.$emit('save', select);
    },
    monthAbbreviations(timestamp) {
      const date = new Date(timestamp);

      const monthAbbreviations = [
        'flux.month.jan',
        'flux.month.feb',
        'flux.month.mar',
        'flux.month.apr',
        'flux.month.may',
        'flux.month.jun',
        'flux.month.jul',
        'flux.month.aug',
        'flux.month.sep',
        'flux.month.oct',
        'flux.month.nov',
        'flux.month.dec',
      ];

      return monthAbbreviations[date.getMonth()];
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  box-shadow: -4px 6px 5.7px 0px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(34px);
}
:deep(.__story-video) {
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
}

:deep(.__story-image) {
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
}
</style>
