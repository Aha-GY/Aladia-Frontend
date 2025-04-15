<template>
  <div
    class="fixed bottom-0 left-0 right-0 top-0 z-[50] flex h-full w-full touch-pan-y items-center justify-center bg-black/20 text-white backdrop-blur"
    data-cy="42fc804374786313"
    @click.self="resetReactPopup"
  >
    <div
      class="relative mb-11 w-[29rem] rounded border border-[#565656]/40 transition-all"
      :class="animation ? 'opacity-100' : 'opacity-0'"
    >
      <div
        class="relative flex items-center justify-between bg-black py-1 pl-2 pr-4"
      >
        <div
          class="bg-gradient-top absolute bottom-0 left-2 h-[1px] w-[3.625rem] transition-all duration-300"
          :style="{ transform: `translateX(${(66 * tabIndex) / 16}rem)` }"
        />
        <div class="flex items-center text-xs">
          <div
            class="mr-2 flex h-[2.125rem] w-[3.625rem] cursor-pointer items-center justify-center text-[#707070] transition-all hover:bg-[#0B0B0B] active:scale-95"
            data-cy="ec443e9ef5287fda"
            @click="getReactionUsers('', -1)"
          >
            <div class="mr-1.5 text-base font-bold text-white">All</div>
            {{ reactionsCount }}
          </div>
          <div
            v-for="(react, index) in reactions"
            :key="react.reaction"
            class="mr-2 flex h-[2.125rem] w-[3.625rem] cursor-pointer items-center justify-center text-[#707070] transition-all hover:bg-[#0B0B0B] active:scale-95"
            data-cy="4380e97ef81a4667"
            @click="getReactionUsers(react.reaction, index)"
          >
            <SocialItemReact
              :name="react.reaction"
              class="mr-1.5"
              :un-hover="true"
            />
            {{ react.count }}
          </div>
        </div>
        <div
          class="group cursor-pointer rounded border border-[#565656]/20 bg-[#070707] p-2 shadow-[0px_4px_4px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-white active:scale-95"
          data-cy="b71dbc6d6770b8fe"
          @click="resetReactPopup"
        >
          <img
            src="~/assets/social/option-close.svg"
            class="h-3 w-3 transition-all duration-300 group-hover:rotate-90 group-hover:scale-125"
            alt=""
          />
        </div>
      </div>
      <div
        class="hide-scrollbar relative h-60 overflow-y-auto bg-black px-2 pt-2 text-xs backdrop-blur"
      >
        <div
          v-for="(item, index) in userTypeData"
          :key="item.id"
          class="group relative mb-[0.375rem] flex h-[2.375rem] cursor-pointer touch-auto items-center px-2 after:absolute after:left-0 after:-z-10 after:h-2 after:w-full after:rounded after:bg-[#0B0B0B] after:opacity-0 after:transition-all after:duration-300 hover:after:h-full hover:after:opacity-100"
          data-cy="f833f762f82bb873"
          @click.stop="handleUserClick(item)"
        >
          <BaseAvatarNext
            :show-online="false"
            size="sm"
            :picture="item.owner.picture"
            class="mr-5 size-[1.625rem]"
          />

          <div
            class="underline-offset-2 group-hover:underline"
            :data-id="item.owner.id"
          >
            {{
              item.owner.type === 'profile'
                ? `${item.owner.name}`
                : item.owner.organizationName
            }}
          </div>
          <div v-if="item.isFollowing" class="mx-2 font-bold text-[#707070]">
            ·
          </div>
          <div v-if="item.isFollowing" class="text-[#707070]">
            {{ $t('post.record.follower') }}
          </div>
          <div
            v-if="isDef(item.isFollowing)"
            class="absolute right-2 top-1/2 flex min-w-[5.25rem] -translate-y-1/2 cursor-pointer items-center justify-center rounded bg-[#B39600] px-1.5 py-1.5 opacity-0 shadow-[0px_4px_4px_rgba(0,0,0,0.6)] transition-all duration-300 active:scale-95 group-hover:opacity-100"
            :class="[item.isFollowing && isFollowHover ? '' : 'font-semibold']"
            data-cy="d014e953031cb509"
            @click.stop="
              onChecked({
                id: item.owner.id,
                type: item.owner.type,
                index,
                item,
              })
            "
            @mouseenter="isFollowHover = true"
            @mouseleave="isFollowHover = false"
          >
            <img
              v-if="
                followId !== item.owner.id &&
                (item.isFollowing || !isFollowHover)
              "
              src="~/assets/social/option-follow.svg"
              class="mr-1 h-4 w-4"
              alt=""
            />
            <img
              v-if="
                followId !== item.owner.id && !item.isFollowing && isFollowHover
              "
              src="~/assets/social/addfollow.svg"
              class="mr-1 h-4 w-4"
              alt=""
            />
            <img
              v-if="followId === item.owner.id"
              src="~/assets/social/option-loading.svg"
              class="rotate-animation mr-1 h-4 w-4"
              alt=""
            />
            {{
              followId === item.owner.id || item.isFollowing
                ? $t('post.record.following')
                : $t('post.record.follow')
            }}
          </div>
        </div>

        <BaseSkeleton
          v-show="socialStore.reactionUsersLoading"
          height="2.5rem"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { _REACT_USERLIST_CACHE } from '~/constant/social';
/**
 * isFollowing field
 * true - for a user I am following
 * false - for users not followed by me
 * null - for my post or reaction (because I cannot follow myself)
 */

export default {
  props: {
    item: Object,
  },
  setup() {
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    return { authStore, socialStore, profileStore };
  },
  data() {
    return {
      searchFocus: false,
      reaction: '',
      dataList: [],
      animation: false,
      followId: null,
      isFollowHover: false,
      tabIndex: 0,
      next: null,
      searchReact: '',
    };
  },
  computed: {
    reactionsCount() {
      console.log('this one ??');
      return this.item?.numberOf?.reactionsCount || 0;
    },
    reactions() {
      if (!this.item?.numberOf?.reactions) {
        return [];
      }
      const reactions = [];
      for (const key in this.item.numberOf.reactions) {
        const count = this.item.numberOf.reactions[key];
        if (count && count > 0) {
          reactions.push({
            reaction: key,
            count,
          });
        }
      }
      return reactions;
    },
    userData() {
      return this.item[_REACT_USERLIST_CACHE] || [];
    },
    userTypeData() {
      return (
        this.userData.filter((user) =>
          !this.searchReact ? true : user.type === this.searchReact,
        ) || []
      );
    },
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);
    this.$nextTick(() => {
      const index = this.reactions.findIndex(
        (item) => item.reaction === this.socialStore.reactIdType,
      );
      this.getReactionUsers(this.socialStore.reactIdType, index);
    });
  },
  beforeUnmount() {
    this.resetReactPopup();
  },
  methods: {
    resetList() {
      this.next = null;
      this.dataList = [];
    },
    async onChecked({ id, type, item }) {
      this.followId = id;
      const originFollowing = item.isFollowing;
      const targetFollowing = !originFollowing;
      await this.profileStore.follow({ id, type }).finally(() => {
        this.followId = null;
      });

      // // Modify dataList first
      // this.dataList[index].isFollowing = targetFollowing;

      // const cacheReactListIndex = this.item[_REACT_USERLIST_CACHE].findIndex(
      //   (user) => user.owner.id === id,
      // );

      // // Modify the data of _REACT_USERLIST_CACHE
      // if (cacheReactListIndex !== -1) {
      //   this.item[_REACT_USERLIST_CACHE][cacheReactListIndex] &&
      //     (this.item[_REACT_USERLIST_CACHE][cacheReactListIndex].isFollowing =
      //       targetFollowing);
      // }

      // // Modify external item data
      // if (this.item.owner.id === id) {
      //   this.item.isFollowing = targetFollowing;
      // }

      this.socialStore.updatePostlistFollow({
        userId: id,
        status: targetFollowing,
      });
    },
    async getReactionUsers(reaction, index) {
      const originTabIndex = this.tabIndex;
      const newTabIndex = index + 1;

      if (index !== -1 && originTabIndex === newTabIndex) {
        return;
      }

      this.tabIndex = newTabIndex;
      this.searchReact = reaction;
    },
    resetReactPopup() {
      this.socialStore.reactId = null;
      this.socialStore.reactIdType = '';
    },
    handleUserClick(item) {
      if (item.id) {
        this.profileStore.gotoProfilePage({ id: item.owner.id });
      }
    },
  },
};
</script>

<style scoped>
.rotate-animation {
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
