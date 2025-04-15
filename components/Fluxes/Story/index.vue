<template>
  <BaseCarousel ref="carousel" :load-more="handleLoadMore">
    <div
      class="inline-block h-[12.5rem] w-[8.5rem] overflow-hidden whitespace-normal p-1"
      @click="fluxesStore.creationVisible = true"
    >
      <div
        class="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-5"
      >
        <img
          v-if="user.picture"
          class="h-4/5 w-full transform object-cover transition duration-300 ease-in-out group-hover:scale-105"
          :src="user.picture"
          alt="MD. Shibbir Ahmed"
        />
        <div
          v-else
          class="group flex h-4/5 w-full items-center justify-center bg-[#2c2c2c] text-[#515151]"
          style="background-color: rgba(255, 255, 255, 0.1)"
        >
          <i
            class="fa-solid fa-user text-4xl text-white/20 transition-all duration-300 group-hover:scale-110"
          />
        </div>
        <div class="relative flex flex-1 flex-col bg-[#060606]">
          <div
            class="absolute left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-4 border-[#060606] bg-[#E0B92C] p-0.5"
          >
            <i class="fa-regular fa-plus text-base" />
          </div>
          <div
            class="flex flex-1 items-end justify-center pb-1 text-sm font-semibold capitalize text-white"
          >
            <p>{{ $t('flux.highlight.story.create.title') }}</p>
          </div>
        </div>

        <div
          data-cy="create-story-trigger"
          class="absolute inset-0 bg-black opacity-0 transition duration-300 ease-in-out group-hover:opacity-20"
        />
      </div>
    </div>
    <div
      v-for="(item, index) in storiesData.data"
      :key="item.id"
      class="inline-block h-[12.5rem] w-[8.5rem] overflow-hidden whitespace-normal p-1"
    >
      <FluxesStoryItem :item="item" :index="index" />
    </div>
    <template v-if="loading">
      <FluxesStorySkeleton v-for="i in 4" :key="i" />
    </template>
  </BaseCarousel>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();
    return { authStore, fluxesStore, profileStore };
  },
  computed: {
    user() {
      return this.profileStore.myProfileDetail;
    },
    storiesData() {
      return this.fluxesStore.storiesData;
    },
    loading() {
      return this.fluxesStore.storiesData.loading;
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
    async init() {
      this.fluxesStore.storiesData.data = [];
      this.fluxesStore.storiesData.next = null;
      this.fluxesStore.storiesData.loading = false;
      this.fluxesStore.storiesData.totalItems = 0;
      await this.fluxesStore.getLastestStories();
    },
    handleLoadMore() {
      return new Promise(async (resolve) => {
        try {
          if (
            this.fluxesStore.storiesData.data.length <
            this.fluxesStore.storiesData.totalItems
          ) {
            await this.fluxesStore.getLastestStories();
          }
        } finally {
          resolve();
        }
      });
    },
  },
};
</script>
