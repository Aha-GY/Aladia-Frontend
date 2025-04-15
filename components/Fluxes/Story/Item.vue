<template>
  <div
    class="group relative flex h-full w-full cursor-pointer flex-col !overflow-hidden !rounded-5 rounded-t-5 bg-[rgba(255,255,255,0.1)]"
    data-cy="9fc138ce2c5f7e3f"
  >
    <div class="name-mask z-[50]" @click="handleOpenPreview" />
    <div
      class="z-40 h-full w-full"
      :style="{ backgroundColor: item.background }"
    >
      <template v-if="item.files.length">
        <FluxesCreationStoryMainWigetsImage
          v-if="hasPlatformVideoCover"
          :image-src="hasPlatformVideoCover.url"
          class="transition duration-300 ease-in-out group-hover:scale-105"
        />
      </template>
    </div>

    <div class="absolute left-1 top-1 z-50">
      <BaseAvatarNext
        :picture="item.owner?.picture"
        :story="item.owner?.story"
        :user-id="item.owner?.id"
        :show-online="false"
        :show-story="true"
        :story-loading="storyLoading"
        size="sm"
      />
    </div>

    <div class="namemask absolute inset-x-0 bottom-1.5 left-1.5 z-[999]">
      <p
        class="w-[6.125rem] overflow-hidden truncate whitespace-nowrap text-[0.875rem] font-semibold text-white hover:underline"
        @click="handleProfileClick"
      >
        {{ item.owner?.name }}
      </p>
    </div>

    <div
      class="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    index: Number,
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();
    return { fluxesStore, profileStore };
  },
  data() {
    return {
      loading: false,
      storyLoading: false,
    };
  },
  computed: {
    hasPlatformVideoCover() {
      return (
        this.item.cover ||
        this.item.files.find((file) =>
          file.metadata.mimetype.startsWith('image/'),
        )
      );
    },
  },
  methods: {
    async handleOpenPreview() {
      // This opens the story preview
      if (!this.item._stories) {
        try {
          this.loading = true;
          this.storyLoading = true;
          const currId = this.item.id;
          let allRelatedStories = [];
          let nextCursor = null;

          do {
            const { data, cursor } = await this.fluxesStore.searchStories({
              ownerId: this.item.owner.id,
              status: 'active',
              limit: 20,
              next: nextCursor,
            });

            allRelatedStories = [...allRelatedStories, ...data];

            nextCursor = cursor?.next || null;
          } while (nextCursor);

          this.fluxesStore.storiesData.data.forEach((story) => {
            if (story.id === currId) {
              story._stories = allRelatedStories;
              return true;
            }
          });
        } finally {
          this.loading = false;
          this.storyLoading = false;
        }
      }

      this.fluxesStore.storiesPreview.index = this.index;
      this.fluxesStore.storiesPreview.data = this.fluxesStore.storiesData.data;
      this.fluxesStore.storiesPreview.isCreatePreview = false;

      this.fluxesStore.storiesData.data.forEach((story) => {
        if (story.owner.story?.status === 'active' && story._stories) {
          const nextIndex = this.fluxesStore.findActiveIndex({
            data: story._stories,
            storyId: story.owner.story.nextStoryId,
          });

          story.startingIndex = Math.max(0, nextIndex);
        } else {
          story.startingIndex = 0;
        }
      });
      const index = this.fluxesStore.storiesData.data[this.index].startingIndex;
      const storyID =
        this.fluxesStore.storiesData.data[this.index]._stories[index].id;
      const ownerID = this.fluxesStore.storiesData.data[this.index].owner.id;

      const url = `/stories/${ownerID}/${storyID}`;
      history.pushState(null, '', url);

      this.fluxesStore.storyPopup.state = true;
      this.fluxesStore.storyPopup.user_id = ownerID;
      this.fluxesStore.storyPopup.story_id = storyID;
      this.fluxesStore.storyViewStartingRoute = this.$route.fullPath;
    },
    handleProfileClick() {
      this.profileStore.gotoProfilePage({
        id: this.item.owner.id,
        entityType: this.item.owner?.type,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.name-mask {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 80%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 40.89%,
    rgba(0, 0, 0, 0.6) 100%
  );
}
</style>
