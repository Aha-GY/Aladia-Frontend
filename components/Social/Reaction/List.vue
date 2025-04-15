<template>
  <div
    ref="container"
    class="relative flex flex-col overflow-hidden rounded-5 border-white/10"
  >
    <el-scrollbar
      ref="scroll"
      wrap-class="overscroll-contain"
      @scroll="onScroll"
    >
      <div
        v-if="list.length > 0"
        ref="list"
        class="flex flex-col rounded-5 p-1 px-1 text-base"
      >
        <div
          v-for="user in list"
          :key="user.owner.id"
          class="group/item rounded-xs relative flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/10"
        >
          <div class="flex flex-1 items-center gap-2">
            <div class="relative">
              <BaseAvatarNext
                :picture="user.owner?.picture"
                :story="user.owner?.story"
                :user-id="user.owner?.id"
                :show-online="false"
                :show-story="false"
                size="md"
              >
                <template #button>
                  <div
                    class="flex size-full items-center justify-center rounded-full border-2 border-black bg-black backdrop-blur"
                  >
                    <BaseReactionItem
                      v-if="user.reaction"
                      :name="user.reaction"
                      :is-image="true"
                      :size="4"
                    />
                    <div
                      v-else
                      class="flex size-full scale-75 items-center justify-center rounded-full bg-black"
                    >
                      <i class="fa-solid fa-eye text-xs text-white" />
                    </div>
                  </div>
                </template>
              </BaseAvatarNext>
            </div>
            <div class="flex flex-1 items-center justify-between pr-4">
              <div class="flex flex-1 flex-col gap-0.5">
                <div class="flex items-center justify-between">
                  <div
                    class="z-[9999] max-w-44 truncate text-base font-medium leading-none text-white hover:underline hover:underline-offset-2 2xl:max-w-52"
                    data-cy="3bc6244a3e04a5ed"
                    @click="handleUserClick(user.owner)"
                  >
                    {{ user.owner?.name }}
                  </div>
                  <SocialReactionOptions
                    :user="user"
                    :item="item"
                    :source="type"
                    @chat="handleChat"
                    @hide="handleHide"
                    @follow="handleFollow"
                  />
                </div>
                <div class="text-xs text-[#707070]/[70]">
                  {{ seenTimeFormat(user.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="loading" class="flex w-full flex-col px-1">
        <div v-for="i in 3" :key="i" class="flex gap-1 p-2">
          <SocialReactionSkeleton class="!w-full" />
        </div>
      </div>
      <BaseNoData v-else />
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  props: {
    itemId: {
      type: String,
      required: true,
    },
    reactionType: {
      type: String,
    },
    currReaction: {
      type: String,
    },
    item: {
      type: Object,
    },
    type: {
      type: String,
    },
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    return { fluxesStore, authStore, profileStore };
  },
  data() {
    return {
      list: [],
      loading: false,
      next: null,
      isNoMore: false,
      reaction: null,
      popoverVisible: false,
    };
  },
  computed: {
    disabled() {
      return this.loading || this.isNoMore;
    },
  },
  watch: {
    currReaction() {
      this.list = [];
      this.next = null;
      this.isNoMore = false;
      this.load();
    },
  },
  mounted() {
    this.load(true);
  },
  methods: {
    async load(isFirst = false) {
      if (this.loading) {
        return;
      }
      try {
        this.loading = true;
        const {
          cursor: { next },
          data,
        } = await this.fluxesStore.getSocialReactionList({
          id: this.itemId,
          reaction: this.currReaction === 'all' ? undefined : this.currReaction,
          type: this.type,
          sortDirection: 'desc',
          limit: 20,
          next: this.next,
        });
        this.list = [...this.list, ...data];

        this.next = next;
        this.isNoMore = !next;
        if (isFirst) {
          this.$emit('total', this.list.length);
        }
      } catch (error) {
        console.error('Error loading reactions:', error);
      } finally {
        this.loading = false;
      }
    },
    onScroll(e) {
      const { scrollTop } = e;
      if (scrollTop > 0) {
        if (
          Math.round(this.$refs.container.offsetHeight) + scrollTop >=
            this.$refs?.list.clientHeight &&
          this.next &&
          !this.loading
        ) {
          this.load();
        }
      }
    },
    handleUserClick(item) {
      this.$emit('user-click', item);
    },
    handleChat({ item }) {
      if (this.authStore.logged) {
        this.$router.push(
          `${this.authStore.hub}/chat?${item.entityType === 'organization' ? 'orgId' : 'userId'}=${item.id}`,
        );
      } else {
        this.authStore.popup = true;
      }
    },
    async handleHide(item) {
      const entityId = this.item.id;
      const userId = item.id;
      const index = this.list.findIndex((i) => i.owner?.id === userId);
      if (this.type === 'reel') {
        await this.fluxesStore.hideReel({
          userId,
          entityId,
        });
      } else {
        await this.fluxesStore.hideStory({
          userId,
          entityId,
          fromReaction: true,
        });
      }

      if (index > -1) {
        this.list[index].isHidden = !this.list[index].isHidden;
      }
    },
    async handleFollow(item, isFollowing) {
      item = {
        ...item,
        isFollowing,
        entityType: item.type,
      };

      await this.profileStore.follow(item);
      const userId = item?.id;
      const index = this.list.findIndex((i) => i.owner?.id === userId);
      if (index > -1) {
        this.list[index].isFollowing = !this.list[index].isFollowing;
      }
    },
  },
};
</script>
