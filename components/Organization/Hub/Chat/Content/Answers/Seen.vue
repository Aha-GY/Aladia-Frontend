<template>
  <div
    ref="container"
    class="relative m-0 flex flex-col rounded-5 border-white/10 bg-black p-0"
  >
    <i
      v-if="loading && !usersNext"
      class="fa-solid fa-spinner mr-1 animate-spin text-xs"
    />
    <el-scrollbar
      ref="scroll"
      wrap-class="overscroll-contain rounded-5 max-h-[18.75rem] border border-white/10 p-1"
      @scroll="onScroll"
    >
      <div v-if="users.length > 0" ref="list" class="flex flex-col px-1">
        <div
          v-for="user in users"
          :key="user.userProfile.id"
          class="group/item rounded-xs relative flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/10"
        >
          <div
            class="flex flex-1 items-center gap-2 truncate"
            @mouseenter="user.showTime = true"
            @mouseleave="user.showTime = false"
          >
            <BaseAvatarNext
              :show-online="false"
              :picture="user.userProfile.image"
              size="sm"
            />
            <div class="flex flex-1 items-center justify-between truncate">
              <div class="flex flex-1 flex-col truncate">
                <div
                  class="truncate text-sm leading-none text-white/60 hover:underline hover:underline-offset-2"
                  data-cy="c81d8308c233a3e0"
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
      <div v-show="loadingNext" class="flex flex-col">
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
    users: Array,
    loading: {
      type: Boolean,
      default: false,
    },
    usersNext: {
      type: String,
    },
    load: Function,
  },
  setup() {
    const profileStore = useProfileStore();
    return { profileStore };
  },
  data() {
    return {
      show: true,
      loadingNext: false,
    };
  },
  methods: {
    visit(item) {
      this.profileStore.gotoProfilePage(item);
    },
    async onScroll(e) {
      const { scrollTop } = e;
      if (scrollTop > 0) {
        if (
          Math.round(this.$refs.container.offsetHeight) + scrollTop >=
            this.$refs.list.clientHeight &&
          this.usersNext &&
          !this.loading
        ) {
          this.loadingNext = true;
          await this.load();
          this.loadingNext = false;
        }
      }
    },
  },
};
</script>
