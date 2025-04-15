<template>
  <div>
    <div
      class="group relative mb-4 flex h-12 cursor-pointer items-center justify-center rounded bg-black/60 transition-all active:scale-95"
      :class="isShareHover ? 'border-anim' : ''"
      data-cy="71198333291864ce"
      @mouseenter="isShareHover = true"
      @mouseleave="isShareHover = false"
      @click.stop="onSocial"
    >
      <img
        src="~/assets/social/sidebar/Add2.svg"
        class="absolute left-[3.8rem] top-1/2 h-4 w-4 -translate-y-1/2"
        alt=""
      />
      <div class="text-sm transition-all group-hover:font-semibold">
        {{ $t('post.share.label') }}
      </div>
      <div
        class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-tl border-l border-t border-[#f1f1f1]/80"
        :class="isShareHover ? 'opacity-0' : 'opacity-100'"
      >
        <div
          class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
        />
        <div
          class="absolute -left-[1px] bottom-0 h-full w-[1px] bg-gradient-to-b from-transparent to-black"
        />
      </div>
    </div>

    <div class="relative mb-5 rounded bg-black/60 py-3 pl-11 pr-4">
      <div class="mb-2 flex items-center justify-between text-xs">
        <div
          class="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-[#f1f1f1] after:to-transparent after:transition-all"
          :class="followersKey ? '' : 'after:opacity-0'"
        >
          {{ $t('base.member.followers') }}
        </div>
        <div
          class="relative h-4 w-8 cursor-pointer rounded-full shadow-[0px_4px_4px_rgba(23,23,23,0.7),inset_1px_1px_1px_0px_rgba(0,0,0,0.25)] transition-all active:scale-95"
          :class="
            followersKey
              ? 'filter-bg-action'
              : 'filter-bg border border-[#f1f1f1]/40'
          "
          data-cy="2d0e4673c1cc3d72"
          @click="onFollowers"
        >
          <img
            src="~/assets/social/sidebar/Selector.svg"
            class="absolute left-0.5 top-1/2 h-3 w-3 -translate-y-1/2 select-none overflow-hidden rounded-full transition-all duration-300"
            :class="followersKey ? 'translate-x-4' : ''"
            alt=""
          />
        </div>
      </div>
      <div class="flex items-center justify-between text-xs">
        <div
          class="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:bg-gradient-to-r after:from-[#f1f1f1] after:to-transparent after:transition-all"
          :class="suggestedKey ? '' : 'after:opacity-0'"
        >
          {{ $t('flux.suggested') }}
        </div>
        <div
          class="relative h-4 w-8 cursor-pointer rounded-full shadow-[0px_4px_4px_rgba(23,23,23,0.7),inset_1px_1px_1px_0px_rgba(0,0,0,0.25)] transition-all active:scale-95"
          :class="
            suggestedKey
              ? 'filter-bg-action'
              : 'filter-bg border border-[#f1f1f1]/40'
          "
          data-cy="a8d68aaf6a8af005"
          @click="onSuggested"
        >
          <img
            src="~/assets/social/sidebar/Selector.svg"
            class="absolute left-0.5 top-1/2 h-3 w-3 -translate-y-1/2 select-none overflow-hidden rounded-full transition-all duration-300"
            :class="suggestedKey ? 'translate-x-4' : ''"
            alt=""
          />
        </div>
      </div>
      <div
        class="pointer-events-none absolute left-0 top-0 z-20 h-full w-full rounded-tl border-l border-t border-[#f1f1f1]/80"
      >
        <div
          class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
        />
        <div
          class="absolute -left-[1px] bottom-0 h-full w-[1px] bg-gradient-to-b from-transparent to-black"
        />
      </div>
    </div>

    <div
      class="relative rounded bg-black/60 shadow-[0px_4px_4px_rgba(0,0,0,0.6)]"
    >
      <div class="flex h-11 items-center px-4">
        <div class="relative h-6 text-sm font-semibold">
          {{ $t('base.member.followers') }}
          <div
            class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full"
          />
        </div>
      </div>

      <div class="hide-scrollbar h-[18rem] overflow-y-auto px-4 pt-1">
        <div
          v-for="item in Followers"
          :key="item"
          class="group relative mb-2 flex cursor-pointer items-center rounded px-2 py-1.5 text-xs transition-all duration-300 hover:bg-[#181818]"
        >
          <div class="relative mr-5 h-6 w-6 rounded bg-white">
            <img
              src="~/assets/social/sidebar/Satus.svg"
              class="absolute bottom-0 right-0 h-2 w-2"
              alt=""
            />
          </div>
          <div class="underline-offset-4 group-hover:underline">
            Zain Korsgaard
          </div>
          <div
            class="group/item absolute right-1.5 top-1/2 flex h-[1.625rem] w-[7.25rem] -translate-y-1/2 items-center justify-center rounded bg-[#B39600] text-xs text-white opacity-0 shadow-[0px_4px_4px_rgba(0,0,0,0.6)] group-hover/item:font-semibold group-hover:opacity-100"
            data-cy="353092778e979dc0"
            @click="onGoProfile"
          >
            <i class="fa-solid fa-chevron-right" />
            {{ $t('personal.profile.go') }}
          </div>
        </div>
      </div>

      <div class="flex h-11 items-center px-4">
        <div class="relative h-6 text-sm font-semibold">
          {{ $t('flux.suggested') }}
          <div
            class="bg-gradient-top absolute bottom-0 left-0 h-[1px] w-full"
          />
        </div>
      </div>
      <div class="hide-scrollbar h-[10rem] overflow-y-auto px-4 pt-1">
        <div
          v-for="item in Suggested"
          :key="item"
          class="group relative mb-2 flex cursor-pointer items-center rounded px-2 py-1.5 text-xs transition-all duration-300 hover:bg-[#181818]"
        >
          <div class="relative mr-5 h-6 w-6 rounded bg-white">
            <img
              src="~/assets/social/sidebar/Satus.svg"
              class="absolute bottom-0 right-0 h-2 w-2"
              alt=""
            />
          </div>
          <div class="underline-offset-4 group-hover:underline">
            Zain Korsgaard
          </div>
          <div
            class="group/item absolute right-1.5 top-1/2 flex h-[1.625rem] w-[5.25rem] -translate-y-1/2 items-center justify-center rounded bg-[#B39600] text-xs text-white opacity-0 shadow-[0px_4px_4px_rgba(0,0,0,0.6)] group-hover:opacity-100"
          >
            <img src="~/assets/social/option-follow.svg" class="mr-1" alt="" />
            {{ $t('base.member.follow') }}
          </div>
        </div>
      </div>
      <div
        class="pointer-events-none absolute -left-[1px] -top-[1px] z-20 h-1/2 w-3/4 rounded-tl border-l border-t border-[#f1f1f1]"
      >
        <div
          class="absolute -top-[1px] right-0 h-[1px] w-2/3 bg-gradient-to-r from-transparent to-black"
        />
        <div
          class="absolute -left-[1px] bottom-0 h-2/3 w-[1px] bg-gradient-to-b from-transparent to-black"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    const socialStore = useSocialStore();
    return { socialStore, searchStore };
  },
  data() {
    return {
      followersKey: true,
      suggestedKey: true,
      Followers: [1, 2, 3, 4, 5, 6, 7],
      Suggested: [1, 2, 3, 4],
      isShareHover: false,
    };
  },
  methods: {
    onFollowers() {
      if (!this.followersKey) {
        this.followersKey = true;
      } else if (this.suggestedKey) {
        this.followersKey = false;
      } else if (!this.suggestedKey) {
        this.followersKey = false;
        this.suggestedKey = true;
      }
    },
    onSuggested() {
      if (!this.suggestedKey) {
        this.suggestedKey = true;
      } else if (this.followersKey) {
        this.suggestedKey = false;
      } else if (!this.followersKey) {
        this.suggestedKey = false;
        this.followersKey = true;
      }
    },
    onSocial() {
      this.searchStore.isFocus = true;
      this.searchStore.type = 'social';
    },
    onGoProfile() {
      this.$router.push('/profile');
    },
  },
};
</script>

<style scoped>
.filter-bg {
  background: linear-gradient(93deg, #000 17.86%, #000 100%);
}
.filter-bg-action {
  background: linear-gradient(93deg, #d0d40d 17.86%, rgba(0, 0, 0, 0) 95%);
}
</style>
