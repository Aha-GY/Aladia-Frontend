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
            <div class="relative h-12 w-12">
              <BaseAvatarNext
                :picture="user.owner?.picture"
                :story="user.owner?.story"
                :user-id="user.owner?.id"
                :show-story="false"
                :show-online="false"
                size="md"
              />
              <div
                class="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-black bg-black backdrop-blur"
              >
                <BaseReactionItem
                  v-if="user.reaction"
                  :name="user.reaction"
                  :is-image="true"
                  :size="4"
                />
                <div v-else class="scale-75">
                  <i class="fa-solid fa-eye text-xs text-white" />
                </div>
              </div>
            </div>
            <div class="flex flex-1 items-center justify-between">
              <div class="flex flex-1 flex-col">
                <div
                  class="text-base font-medium leading-none text-white hover:underline hover:underline-offset-2"
                  data-cy="41493b13627185fd"
                  @click="handleUserClick(user.owner.id)"
                >
                  {{ user.owner?.name }}
                </div>
                <div class="text-xs text-[#707070]/[70]">
                  {{ seenTimeFormat(user.updatedAt) }}
                </div>
              </div>

              <el-popover
                v-model:visible="popoverVisible"
                trigger="click"
                :show-arrow="false"
                placement="bottom-start"
              >
                <template #reference>
                  <div
                    class="group relative z-10 ml-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 transition-all active:scale-95"
                  >
                    <i class="fa-light fa-ellipsis z-10" />
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="loading" class="flex flex-col">
        <div v-for="i in 3" :key="i" class="flex gap-1 p-2">
          <BaseSkeleton :length="1" class="w-10" height="1rem" />
          <BaseSkeleton :length="1" class="flex-1" height="1rem" />
        </div>
      </div>
      <BaseNoData v-else />
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  props: {
    storyId: {
      type: String,
      required: true,
    },
    reactionType: {
      type: String,
    },
    currReaction: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
  },
  setup() {
    const fluxesStore = useFluxesStore();
    return { fluxesStore };
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
          cursor: { next, totalItems },
          data,
        } = await this.fluxesStore.getSocialReactionList({
          id: this.storyId,
          reaction: this.currReaction === 'all' ? undefined : this.currReaction,
          type: this.type,
          sortDirection: 'desc',
          limit: 20,
          next: this.next,
        });
        this.list = [...this.list, ...data];
        this.next = next;
        this.isNoMore = !next;
        this.loading = false;
        if (isFirst) {
          this.$emit('total', totalItems);
        }
      } catch (e) {
        console.log(e);
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
    handleUserClick(id) {
      this.$emit('user-click', id);
    },
  },
};
</script>
