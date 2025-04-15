<template>
  <Transition name="slide-fade-in" mode="out-in" class="rounded-lg px-3">
    <div
      v-if="fluxesStore.areReelsHidden"
      class="__reel-suggestion--hidden mb-4 rounded-md bg-black px-4 py-4"
    >
      <div
        class="flex items-center justify-between rounded-md px-4 py-1.5 hover:bg-[#101010]"
      >
        <div class="flex items-center gap-3">
          <BaseIconClose class="close-btn stories-main-slider__item-btn" />
          <div>
            <p class="text-base font-medium">
              {{ $t('post.reel.hidden.label') }}
            </p>
            <p class="text-sm text-white/40">
              {{ $t('post.reel.hidden.title') }}
            </p>
          </div>
        </div>
        <div
          class="p-1 text-sm hover:cursor-pointer hover:rounded-md hover:bg-[#06060666]/40"
          @click="fluxesStore.areReelsHidden = false"
        >
          {{ $t('post.reel.undo') }}
        </div>
      </div>
    </div>

    <div
      v-else
      class="__reel-suggestion hide-scrollbar relative mb-4 overflow-hidden bg-black px-4 py-4"
    >
      <div class="mb-5">
        <div class="flex items-center justify-between">
          <p class="text-white">Reels and short videos</p>

          <div class="flex items-center gap-2">
            <BaseButton
              type="outline"
              class="text-xs"
              @click="handleCreateReel"
            >
              Create
            </BaseButton>

            <el-popover
              v-model:visible="showHideSuggestions"
              trigger="click"
              :show-arrow="false"
              placement="bottom-end"
              :popper-style="{
                border: 'none',
                background: 'transparent',
                'box-shadow': 'none',
                padding: '0',
                borderRadius: '0.375rem',
                minWidth: '6.25rem',
                width: 'auto',
              }"
            >
              <template #reference>
                <div
                  class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:rounded-md hover:bg-[#E5E5E51A]/10 active:scale-95"
                >
                  <i class="fa-solid fa-ellipsis-h text-base" />
                </div>
              </template>
              <div class="popupborder bg-[#060606] p-2">
                <div
                  fluxesStore
                  class="flex items-center gap-2 whitespace-nowrap rounded-md bg-black text-sm text-white hover:cursor-pointer"
                  @click="fluxesStore.areReelsHidden = true"
                >
                  <i class="fa-regular fa-eye-slash" />
                  <span>Hide Suggestions</span>
                </div>
              </div>
            </el-popover>
          </div>
        </div>
      </div>

      <div class="mb-4 box-border w-full overflow-hidden">
        <div
          v-if="loading"
          ref="reels"
          class="flex w-[40.5rem] items-center justify-between overflow-hidden pr-3"
        >
          <div
            v-for="i in 10"
            :key="i"
            class="mr-3 inline-block h-[390px] w-[16.2rem] shrink-0 overflow-hidden whitespace-normal"
          >
            <FluxesReelSkeleton />
          </div>
        </div>

        <div
          v-else
          ref="reels"
          class="hide-scrollbar flex w-[40.5rem] items-center overflow-x-auto md:overflow-x-auto"
        >
          <div
            v-for="(item, index) in reelsData"
            :key="item.id"
            class="inline-block h-[390px] w-[16.2rem] shrink-0 overflow-hidden whitespace-normal pr-3"
          >
            <FluxesReelItem :item="item" :index="index" />
          </div>
        </div>
      </div>

      <div
        v-if="pages > 1"
        class="pointer-events-none absolute inset-0 z-20 -mb-4 hidden items-center transition-all sm:flex"
      >
        <div
          v-if="page !== 0"
          class="pointer-events-auto absolute left-8 top-1/2 -mt-12 flex h-12 w-7 cursor-pointer items-center justify-center"
          data-cy="f4d7c5d946f405f1"
          @click="onLeftClick"
        >
          <div
            class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
          />
          <i
            class="fa-light fa-chevron-left pointer-events-none relative z-10 text-base text-white"
          />
        </div>
        <div
          v-if="page !== pages - 1"
          class="pointer-events-auto absolute right-8 top-1/2 -mt-12 flex h-12 w-7 cursor-pointer items-center justify-center"
          data-cy="90448974e7dfe1ab"
          @click="onRightClick"
        >
          <div
            class="absolute inset-0 z-0 h-full w-full scale-100 rounded-lg border border-[#565656] bg-[#101010] transition-all hover:scale-[1.2] hover:border-white active:scale-100"
          />
          <i
            class="fa-light fa-chevron-right pointer-events-none relative z-10 text-base text-white"
          />
        </div>
      </div>

      <BaseButton
        :label="$t('post.content.more')"
        size="large"
        type="outline"
        class="mt-8 flex items-center justify-center"
        @click="handleOpenPreview"
      />
    </div>
  </Transition>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    const profileStore = useProfileStore();
    return { authStore, fluxesStore, profileStore };
  },
  data() {
    return {
      page: 0,
      showHideSuggestions: false,
    };
  },
  computed: {
    user() {
      return this.profileStore.myProfileDetail;
    },
    reelsData() {
      return this.fluxesStore.reelsData?.data;
    },
    loading() {
      return this.fluxesStore.reelsData.loading;
    },
    pages() {
      if (this.loading) {
        return Math.ceil(10 / 3);
      } else {
        return Math.ceil(this.fluxesStore.reelsData.data?.length / 2);
      }
    },
  },
  watch: {
    // loading(val) {
    //   if (!val) {
    //     this.$nextTick(() => {
    //       this.$refs.carousel.updateButtons();
    //     });
    //   }
    // },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.fluxesStore.reelsData.data = [];
      this.fluxesStore.reelsData.next = null;
      this.fluxesStore.reelsData.loading = false;
      this.fluxesStore.reelsData.totalItems = 0;
      await this.fluxesStore.getReels();
    },
    onLeftClick() {
      this.page = Math.max(this.page - 1, 0);
      this.scrollToCard(-1);
    },
    onRightClick() {
      this.page = Math.min(this.page + 1, this.pages - 1);
      this.scrollToCard(1);
    },
    scrollToCard(direction) {
      const reels = this.$refs.reels;
      if (reels) {
        const cardWidth = 16 * 16 + 3.2;
        const scrollAmount = 2 * cardWidth;

        reels.scrollBy({
          left: direction * scrollAmount,
          behavior: 'smooth',
        });
      }
    },
    handleLoadMore() {
      return new Promise(async (resolve) => {
        try {
          if (
            this.fluxesStore.reelsData.data.length <
            this.fluxesStore.reelsData.totalItems
          ) {
            await this.fluxesStore.getReels();
          }
        } finally {
          resolve();
        }
      });
    },
    async handleOpenPreview() {
      if (!this.fluxesStore.reelsData?.data?.length) {
        return;
      }
      this.fluxesStore.reelPreview.index = this.index;
      this.fluxesStore.reelPreview.visible = true;
      this.fluxesStore.reelPreview.data = this.reelsData;
      this.fluxesStore.reelPreview.isCreatePreview = false;
    },
    handleCreateReel() {
      this.fluxesStore.creationTab = 'reel';
      this.fluxesStore.creationVisibility = 'public';
      this.fluxesStore.creationVisible = true;
    },
  },
};
</script>
