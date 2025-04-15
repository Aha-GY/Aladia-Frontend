<template>
  <div
    v-loading="loading"
    class="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-5"
    @click="handleOpenPreview"
  >
    <div class="group relative h-full w-full">
      <video
        class="h-full w-full transform object-cover object-center transition duration-300 ease-in-out"
        :src="videoUrl"
        :poster="thumbnail"
      />

      <div
        class="absolute inset-0 transition-opacity duration-300 hover:bg-[rgba(48,48,48,0.34)]"
      />
    </div>

    <div class="absolute right-3 top-3">
      <el-popover
        v-model:visible="isHideRealPopup"
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
            class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-[0.3125rem] transition-all hover:bg-white/5 active:scale-95"
            :class="{ 'opacity-50': isHideRealPopup }"
            @click.stop
          >
            <i class="fa-solid fa-ellipsis-h text-base" />
          </div>
        </template>
        <div class="popupborder bg-[#060606] p-1">
          <div
            class="flex items-center gap-2 whitespace-nowrap rounded-md bg-black p-1 text-sm text-white hover:cursor-pointer"
            @click="toggleHideReel(item.id)"
          >
            <i class="fa-regular fa-eye-slash" />
            <span>Hide reel</span>
          </div>
        </div>
      </el-popover>
    </div>

    <div
      v-if="isItemHidden(item.id)"
      class="absolute inset-x-0 flex h-full w-full items-center justify-center bg-black/75 p-3"
    >
      <div
        class="absolute left-[2.5rem] top-[9.1563rem] inline-flex flex-col items-center justify-start gap-3"
      >
        <div
          class="text-center text-base font-black leading-none text-white/75"
        >
          <i class="fa-solid fa-eye-slash" />
        </div>

        <div
          class="self-stretch text-center font-['Inter'] text-base font-semibold tracking-tight text-white/75"
        >
          {{ $t('post.reel.hidden.label2') }}
        </div>
        <div
          class="w-[11.25rem] text-center font-['Inter'] text-xs font-normal text-white/75"
        >
          {{ $t('post.reel.hidden.desc') }}
        </div>
        <div
          class="inline-flex items-center justify-start gap-1.5 rounded-[0.3125rem] bg-[#e0b92c] px-1.5 py-[0.1875rem]"
        >
          <div
            class="text-center font-['Inter'] text-xs font-medium leading-[1.125rem] text-[#090909]"
            @click.stop="unhidePost(item.id)"
          >
            {{ $t('post.reel.undo') }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!isItemHidden(item.id)"
      class="absolute inset-x-0 bottom-0 flex items-center bg-gradient-to-b p-3"
      style="
        background-image: linear-gradient(
          to bottom,
          rgba(38, 38, 38, 0),
          rgba(38, 38, 38, 0.8)
        );
      "
    >
      <i
        class="fas fa-play"
        style="color: white; font-size: 1rem; margin-right: 8px"
      />
      <p class="line-clamp-2 text-base font-semibold text-white">
        {{ numberOfViews }}
      </p>
    </div>
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
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    const router = useRouter();
    return { fluxesStore, socialStore, router, authStore };
  },
  data() {
    return {
      loading: false,
      isHideRealPopup: false,
      isHidden: false,
    };
  },
  computed: {
    videoUrl() {
      return this.item.files[0]?.url;
    },
    thumbnail() {
      return this.item.cover?.url;
    },
    numberOfViews() {
      return this.item.numberOf.views;
    },
  },
  methods: {
    async handleOpenPreview() {
      this.fluxesStore.reelPopup.reel_Id = this.item.id;
      this.fluxesStore.reelPopup.state = true;
      this.fluxesStore.reelPreview.previousRoute =
        this.router.currentRoute.value.fullPath;
      const url = `/reels/${this.item.id}`;
      history.pushState(null, '', url);
      // this.$router.push(url);
    },
    formatSocialCount(number) {
      if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
      } else if (number >= 1_000) {
        return `${(number / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
      } else {
        return number.toString();
      }
    },
    toggleHideReel(postId) {
      this.fluxesStore.hidePost({
        postId,
        userId: this.authStore.context,
      });
      this.isHideRealPopup = false;
    },
    isItemHidden(itemId) {
      return this.fluxesStore.hiddenPosts.has(itemId);
    },
    unhidePost(itemId) {
      return this.fluxesStore.unhidePost({
        postId: itemId,
        userId: this.authStore.context,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.name-mask {
  background-image: linear-gradient(to top, black, rgba(0, 0, 0, 0));
}
</style>
