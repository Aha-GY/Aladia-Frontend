<template>
  <div class="h-[40.5rem] w-[23.5rem] md:w-[26.625rem]">
    <div class="flex h-full flex-col gap-3" @wheel.stop>
      <div class="flex justify-between gap-5 p-4">
        <div class="flex items-center gap-5">
          <i
            v-if="followerType === 'followers'"
            class="fa-regular fa-user-plus text-xl"
          />
          <i v-else class="fa-regular fa-circle-check text-xl" />
          <span class="text-xl">
            {{
              followerType === 'followers'
                ? $t('base.member.followers')
                : $t('base.member.following')
            }}
          </span>
        </div>
        <BaseIconClose
          data-cy="38f50e2d69171ebd"
          @click.stop="handleDialogClose"
        />
      </div>

      <div class="flex h-full flex-col gap-2 px-2 py-4">
        <div class="flex items-center gap-1 px-4">
          <BaseInput
            v-model.trim="name"
            search
            fixed
            :placeholder="$t('personal.profile.search')"
          />
        </div>

        <ProfileFollowersType v-model="type" />

        <div class="h-[27.5rem] w-full overflow-y-auto px-3">
          <div
            v-infinite-scroll="loadinfiniteData"
            :infinite-scroll-disabled="infiniteLoading || !infiniteNext"
            :infinite-scroll-distance="40"
          >
            <ProfileFollowersItem
              v-for="item in filterUnique(membersList)"
              :key="item.id"
              class="mb-3 last:mb-0"
              :item="item"
              :search-name="name"
              :follower-type="item.type"
              :is-follower-type="followerType === 'followers'"
              :is-mine-page="isMe"
              @change="handleChange"
              @remove-follower="removeFollower"
            />
            <div
              v-if="!membersList.length && !infiniteLoading"
              class="flex flex-col items-center justify-center gap-5 py-5"
            >
              <div
                class="flex h-[6.25rem] w-[6.25rem] items-center justify-center rounded-full bg-[#0C0C0C] p-6"
              >
                <i class="fa-solid fa-users text-[2.8125rem]" />
              </div>
              <div class="text-center text-xs leading-4 text-[#D9D9D9]">
                <p>{{ $t(followerTips) }}</p>
                <p>{{ $t('personal.friends.suggested.content1') }}</p>
                <p>{{ $t('personal.friends.suggested.content2') }}</p>
              </div>
            </div>
            <template v-if="followLoadEnd && suggestionMembers.length">
              <div class="my-3 rounded-md bg-[#0C0C0C] p-4 text-base">
                {{ $t('personal.friends.suggested.label') }}
              </div>
              <ProfileFollowersItem
                v-for="item in filterUnique(suggestionMembers)"
                :key="item.id"
                class="mb-3 last:mb-0"
                :item="item"
                :is-suggest="true"
                :follower-type="item.type"
                :is-mine-page="isMe"
                @hide-item="handleHideSug"
                @change="handleChange"
              />
            </template>
            <ProfileFollowersSkeleton v-show="infiniteLoading" :search="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFollowers, getFollowing } from '~/api/v2/followers';
import WebSocketService from '~/utils/websocket';

export default {
  props: {
    detail: {
      type: Object,
      default: () => ({}),
    },
    followerType: {
      type: String,
      default: '', // followers or following
    },
  },
  setup() {
    const websocket = WebSocketService.getInstance();
    const globalStore = useGlobalStore();
    const profileStore = useProfileStore();
    const fluxesStore = useFluxesStore();
    return {
      globalStore,
      websocket,
      profileStore,
      fluxesStore,
    };
  },
  data() {
    return {
      type: undefined,
      name: '',
      timer: null,
      followLoadEnd: false,
      infiniteLoading: false,
      infiniteNext: null,
      membersList: [],
      suggestionMembers: [],
    };
  },
  computed: {
    isMe() {
      return this.profileStore.myProfileDetail.id === this.$route.params.name;
    },
    followerTips() {
      const meTips =
        this.followerType === 'following'
          ? 'personal.friends.empty.following'
          : 'personal.friends.empty.follower';
      const userTips =
        this.followerType === 'following'
          ? 'personal.friends.user.empty.following'
          : 'personal.friends.user.empty.follower';
      return this.isMe ? meTips : userTips;
    },
  },
  watch: {
    name() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.initLoad();
      }, 300);
    },
    type() {
      this.initLoad();
    },
  },
  async mounted() {
    this.websocket.on('broadcast', this.handleUserConnectStatus);
    this.loadinfiniteData();
  },
  unmounted() {
    this.websocket.off('broadcast', this.handleUserConnectStatus);
  },
  methods: {
    // filter unique list
    filterUnique(data) {
      const uniqueData = new Map();
      data.forEach((u) => {
        if (!uniqueData.has(u.id)) {
          uniqueData.set(u.id, u);
        }
      });
      return Array.from(uniqueData.values());
    },
    handleDialogClose() {
      this.$emit('close');
    },
    async initLoad() {
      this.infiniteLoading = true;
      this.infiniteNext = null;
      this.membersList = [];
      this.suggestionMembers = [];
      await this.onInit();
    },
    async onInit() {
      this.followerType === 'followers'
        ? await this.searchFollowes()
        : await this.searchFollowing();
    },
    async searchFollowes() {
      const params = {
        limit: 10,
      };

      // Only include params if they are defined
      if (this.detail.id) {
        params.followerId = this.detail.id;
      }
      if (this.name) {
        params.name = this.name;
      }
      if (this.type) {
        params.type = this.type;
      }
      if (this.infiniteNext) {
        params.next = this.infiniteNext;
      }
      try {
        const { data, cursor } = await getFollowers(params);
        this.infiniteNext = cursor.next;
        this.membersList = [...this.membersList, ...data];
        this.followLoadEnd = cursor.next === null;
        if (this.followLoadEnd) {
          this.infiniteNext = null;
          this.infiniteLoading = true;
          this.loadSuggestion();
        }
      } finally {
        this.infiniteLoading = false;
      }
    },
    async searchFollowing() {
      try {
        // Build the parameters dynamically
        const params = {
          limit: 10,
        };

        // Only include params if they are defined
        if (this.detail.id) {
          params.followerId = this.detail.id;
        }
        if (this.name) {
          params.name = this.name;
        }
        if (this.type) {
          params.type = this.type;
        }
        if (this.infiniteNext) {
          params.next = this.infiniteNext;
        }
        const { data, cursor } = await getFollowing(params);
        this.infiniteNext = cursor.next;
        this.membersList = [...this.membersList, ...data];
        this.followLoadEnd = cursor.next === null;
        if (this.followLoadEnd) {
          this.infiniteNext = null;
          this.infiniteLoading = true;
          this.loadSuggestion();
        }
      } finally {
        this.infiniteLoading = false;
      }
    },
    async loadSuggestion() {
      try {
        const { data, cursor } = await this.globalStore.searchProfile({
          next: this.infiniteNext,
          limit: 10,
          followSuggestion: true,
        });
        this.infiniteNext = cursor.next;
        this.suggestionMembers = [...this.suggestionMembers, ...data];
      } finally {
        this.infiniteLoading = false;
      }
    },
    async loadinfiniteData() {
      if (this.infiniteLoading) {
        return;
      }
      this.infiniteLoading = true;
      if (!this.followLoadEnd) {
        this.onInit();
      } else {
        this.loadSuggestion();
      }
    },
    async handleChange({ item, isfollow, isSuggest }) {
      if (isSuggest && isfollow) {
        this.handleHideSug(item.id);
        if (this.followerType === 'following' && this.isMe) {
          this.membersList = [...this.membersList, item];
        }
      } else if (isfollow || this.followerType === 'followers') {
        this.membersList = this.membersList.map((ele) =>
          ele.id === item.id ? item : ele,
        );
      } else {
        this.membersList = this.membersList?.filter(
          (ele) => ele.id !== item.id,
        );
      }
    },
    removeFollower(id) {
      this.membersList = this.membersList?.filter((item) => item.id !== id);
    },
    handleHideSug(id) {
      this.suggestionMembers = this.suggestionMembers?.filter(
        (item) => item.id !== id,
      );
    },
    handleUserConnectStatus(data) {
      if (!data || !data.data) {
        return;
      }

      const { userId, online, type } = data.data;

      if (type !== 'profile-status') {
        return;
      }

      // membersList list
      const targetMember = this.membersList.find((item) => item.id === userId);
      if (targetMember) {
        targetMember.online = online;
      }

      // suggestionMembers list
      const targetSuggestMember = this.suggestionMembers.find(
        (item) => item.id === userId,
      );
      if (targetSuggestMember) {
        targetSuggestMember.online = online;
      }
    },
  },
};
</script>
