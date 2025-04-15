<template>
  <BaseCarousel ref="carousel" :load-more="handleLoadMore">
    <div
      v-if="!isView"
      class="inline-block cursor-pointer overflow-hidden whitespace-normal p-1 transition duration-300 ease-in-out hover:scale-105"
      data-cy="0ac9ea41e85d27f8"
      @click="handleCreate"
    >
      <div class="overflow-hidden">
        <div class="p-[0.375rem]">
          <div
            class="flex size-12 items-center justify-center overflow-hidden rounded-full bg-[#1f1f1f] text-xl text-white/50"
          >
            <div class="flex h-full w-full items-center justify-center">
              <i class="fa-solid fa-plus" />
            </div>
          </div>
        </div>

        <div class="truncate py-1 text-center text-xs text-[#D9D9D9]">
          {{ $t('course.header.new') }}
        </div>
      </div>
    </div>
    <div
      v-for="(item, index) in storiesGroupData"
      :key="item.id"
      class="mx-1 inline-block max-w-[5.25rem] cursor-pointer overflow-hidden whitespace-normal p-1 transition duration-300 ease-in-out hover:scale-105 hover:opacity-70"
      data-cy="5d58bc3b1c9d4588"
      @click="handleOpenPreview(index)"
    >
      <BaseAvatarNext
        :picture="item?.cover?.url"
        :show-story="false"
        :user-id="item?.owner?.id"
        :show-online="false"
        size="md"
      />
      <div class="truncate py-1 text-center text-xs text-[#D9D9D9]">
        {{ item.title }}
      </div>
    </div>
  </BaseCarousel>
</template>

<script>
export default {
  props: {
    isView: {
      type: Boolean,
      default: false,
    },
    isOrg: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();

    return { fluxesStore, profileStore };
  },
  computed: {
    detail() {
      return this.isOrg
        ? this.profileStore.getOrganizationProfileDetail()
        : this.profileStore.getPersonalProfileDetail();
    },
    storiesGroupData() {
      return this.fluxesStore.storiesGroupData.data;
    },
    loading() {
      return this.fluxesStore.storiesGroupData.loading;
    },
  },
  watch: {
    loading(val) {
      if (!val) {
        this.$nextTick(() => {
          this.$refs.carousel.updateButtons();
        });
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    handleCreate() {
      this.fluxesStore.creationVisible = true;
      this.fluxesStore.creationTab = 'highlight';
      this.fluxesStore.sourcePageIsProfile = true;
    },
    async init() {
      this.fluxesStore.storiesGroupData.data = [];
      this.fluxesStore.storiesGroupData.next = null;
      this.fluxesStore.storiesGroupData.loading = false;
      this.fluxesStore.storiesGroupData.totalItems = 0;

      await this.fluxesStore.searchStoriesGroup({
        ownerId: this.detail.id,
      });

      this.fluxesStore.storiesGroupData.data.forEach((story) => {
        story.stories.forEach((item) => {
          item.owner = story.owner;
        });
      });
    },
    handleLoadMore() {
      return new Promise(async (resolve) => {
        try {
          if (
            this.fluxesStore.storiesGroupData.data.length <
            this.fluxesStore.storiesGroupData.totalItems
          ) {
            await this.fluxesStore.searchStoriesGroup({
              ownerId: this.detail.id,
            });
          }
        } finally {
          resolve();
        }
      });
    },
    async handleOpenPreview(index) {
      this.fluxesStore.storiesGroupData.data.forEach((story) => {
        story._stories = story.stories;
        story.startingIndex = '0';
      });

      const currStory = this.fluxesStore.storiesGroupData.data[index];
      const storyId = currStory._stories[0].id;
      const url = `/stories/highlights/${currStory.id}/${storyId}`;
      this.fluxesStore.storyViewStartingRoute = this.$route.fullPath;
      this.fluxesStore.storiesPreview.index = index;
      this.fluxesStore.storiesPreview.data =
        this.fluxesStore.storiesGroupData.data;

      this.fluxesStore.storyPopup.state = true;
      this.fluxesStore.storyPopup.user_id = currStory?.owner?.id;
      this.fluxesStore.storyPopup.story_id = storyId;
      history.pushState(null, '', url);
      this.fluxesStore.storyPopup.isHighlight = true;
    },
  },
};
</script>
