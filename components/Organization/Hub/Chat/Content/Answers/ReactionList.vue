<template>
  <div
    ref="container"
    class="relative flex flex-col rounded-5 border-white/10 bg-black"
  >
    <el-scrollbar
      ref="scroll"
      wrap-class="overscroll-contain  rounded-5 max-h-[18.75rem] border border-white/10 p-1"
      @scroll="onScroll"
    >
      <div
        v-if="list.length > 0"
        ref="list"
        class="flex flex-col px-1 text-base"
      >
        <div
          v-for="user in list"
          :key="user.userProfile.id"
          class="group/item rounded-xs relative flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/10"
        >
          <div class="flex flex-1 items-center gap-2 truncate">
            <BaseAvatarNext
              :picture="user.userProfile.image"
              size="sm"
              :show-online="false"
            />
            <div class="flex flex-1 items-center justify-between truncate">
              <div class="flex flex-1 flex-col truncate">
                <div
                  class="truncate text-sm leading-none text-white/60 hover:underline hover:underline-offset-2"
                  data-cy="8ce5c61dcdde5a4e"
                  @click.stop="visit(user.userProfile)"
                >
                  {{ user.userProfile.fullname }}
                </div>
                <div class="text-xs text-white/30">
                  <i class="fa-sharp fa-thin fa-check-double text-10" />
                  {{ seenTimeFormat(user.updatedAt) }}
                </div>
              </div>

              <BaseReactionItem
                v-if="user.reaction"
                :name="user.reaction"
                :is-image="true"
                :size="4"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="loading" class="flex flex-col">
        <div v-for="i in 3" :key="i" class="flex gap-1 p-2">
          <BaseSkeleton :length="1" class="w-10" height="1rem" />
          <BaseSkeleton :length="1" class="flex-1" height="1rem" />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  props: {
    messageId: {
      type: String,
      required: true,
    },
    reactionType: {
      type: String,
    },
  },
  setup() {
    const profileStore = useProfileStore();
    const hubChatStore = useHubChatStore();
    const container = ref(null);
    const hide = ref(false);
    onClickOutside(
      container,
      () => {
        hide.value = true;
      },
      { ignore: ['.el-popper'] },
    );
    return { profileStore, hubChatStore, container, hide };
  },
  data() {
    return {
      list: [],
      loading: false,
      next: null,
      isNoMore: false,
    };
  },
  computed: {
    disabled() {
      return this.loading || this.isNoMore;
    },
  },
  watch: {
    hide(val) {
      if (val) {
        this.$emit('hide');
      }
    },
  },
  mounted() {
    this.load();
  },

  methods: {
    visit(item) {
      this.profileStore.gotoProfilePage(item);
    },
    async load() {
      if (this.loading) {
        return;
      }
      try {
        this.loading = true;
        const {
          cursor: { next },
          data: { users },
        } = await this.hubChatStore.getMessageInfo({
          roomId: this.hubChatStore.chatId,
          messageId: this.messageId,
          reactionType: this.reactionType,
          next: this.next,
        });
        if (this.next === null) {
          this.list = users || [];
        } else {
          this.list = this.list.concat(users);
        }
        this.next = next;
        this.isNoMore = !next;
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
    },
    onScroll(e) {
      const { scrollTop } = e;
      if (scrollTop > 0) {
        if (
          Math.round(this.$refs.container.offsetHeight) + scrollTop >=
            this.$refs.list.clientHeight &&
          this.next &&
          !this.loading
        ) {
          this.load();
        }
      }
    },
  },
};
</script>
