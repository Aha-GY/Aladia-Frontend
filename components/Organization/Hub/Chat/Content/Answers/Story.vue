<template>
  <div v-if="isAvailable">
    <div class="flex-1 truncate pb-1 text-xs text-white/40">
      <template v-if="action === 'share'">
        <span class="truncate">{{ name }}</span>
        {{ $t('org.activity.chat.story.shared') }}
      </template>
      <template v-else>
        <div v-if="isOwner">
          {{ $t('org.activity.chat.story.answered') }}
        </div>
        <div v-else-if="ownerId === userId">
          {{ $t('org.activity.chat.story.replied') }}
        </div>
      </template>
    </div>
    <div class="w-[12.5rem] shrink-0">
      <FluxesCreationHighLightWigetsNewCard
        class="mb-1 cursor-pointer border-[1px] border-white/10 transition-all duration-300 hover:border-white/20"
        :item="story"
        data-cy="a63913cbdc30d14b"
        @click="handleShowDetail"
      />
    </div>
  </div>
  <div v-else class="pb-1 text-xs text-white/40">
    {{ $t('org.activity.chat.story.unavailable') }}
  </div>
</template>
<script>
export default {
  props: {
    isOwner: Boolean,
    storyId: String,
    ownerId: String,
    action: String,
    item: Object,
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();
    return { fluxesStore, profileStore };
  },
  data() {
    return {
      story: {
        loading: true,
      },
    };
  },
  computed: {
    userId() {
      return this.profileStore.myProfileDetail.id;
    },
    isAvailable() {
      return this.storyId && this.ownerId;
    },
    name() {
      if (this.isOwner) {
        if (this.item.author?.type === 'profile') {
          return this.$t('meet.you');
        } else {
          return this.item.author?.fullname;
        }
      } else {
        if (this.item.author.type === 'profile' && !this.item.authorFrom) {
          return this.item.author?.fullname;
        } else {
          // return this.item?.createdBy?.fullname;
          return this.item?.author?.fullname;
        }
      }
    },
  },
  watch: {
    'fluxesStore.creationVisible': debounce(function (value) {
      if (!value && this.fluxesStore.storiesPreview.storyId === this.story.id) {
        this.load();
      }
    }, 100),
  },
  mounted() {
    if (this.isAvailable) {
      this.load();
    }
  },
  methods: {
    async load() {
      this.story = await this.fluxesStore.getStoryById(this.storyId);
    },
    handleShowDetail() {
      if (!this.story || this.story.loading) {
        return;
      }
      this.story._stories = [cloneDeep(this.story)];
      this.fluxesStore.showRetrieveStory([this.story]);
      this.fluxesStore.storiesPreview.isCreatePreview = true;
      this.fluxesStore.storiesPreview.id = this.story.owner.id;
      this.fluxesStore.storiesPreview.storyId = this.story.id;
      this.fluxesStore.storiesPreview.visible = true;
      this.fluxesStore.storyViewStartingRoute = this.$route.fullPath;
    },
  },
};
</script>
