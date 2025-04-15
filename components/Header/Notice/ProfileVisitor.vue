<template>
  <el-dialog
    v-model="notificationStore.showVisitors"
    modal-class="!bg-transparent w-[28rem] dialog-popup-chat overflow-hidden overscroll-contain"
    class="h-[43.75rem] !w-[28rem] !rounded-5 border border-white/10 !shadow-none max-sm:!w-full"
    :append-to-body="true"
    :show-close="false"
  >
    <div class="flex h-full flex-col">
      <div
        class="flex h-[3.75rem] items-center justify-between bg-[#0c0c0c] p-4"
      >
        <div class="text-xl text-[#B0B0B0]">
          {{ $t('nav.header.profile.visitors') }}
        </div>
        <BaseIconClose
          data-cy="5715dbcd22fa253c"
          @click="notificationStore.showVisitors = false"
        />
      </div>
      <div
        v-infinite-scroll="load"
        class="flex h-[40rem] flex-col gap-2 overflow-y-auto overscroll-contain px-4 py-4 text-base"
        :infinite-scroll-disabled="disabled"
      >
        <template v-for="(item, index) in dataList" :key="item.id">
          <div v-if="isNewDate(index)" class="px-6 py-2">
            {{
              isThisWeek(item.createdAt)
                ? $t('nav.header.update.thisWeek')
                : $t('nav.header.update.later')
            }}
          </div>
          <div
            class="flex h-[3.75rem] items-center gap-2 rounded-5 px-[0.75rem] py-[0.375rem] transition-all hover:bg-[#252525]"
          >
            <div class="flex flex-1 gap-2 truncate">
              <BaseAvatarNext
                :picture="item.image"
                :show-online="true"
                size="md"
              />
              <div
                class="flex flex-1 flex-col justify-center truncate transition-all"
              >
                <div
                  class="mr-1 cursor-pointer truncate hover:underline hover:underline-offset-2"
                  data-cy="b926542da041efe3"
                  @click.stop="visit(item)"
                >
                  {{ item.fullName }}
                </div>
                <div class="text-xs text-white/30">
                  <!-- <span v-if="item.isOnline" class="text-[#E4B53D]/80">
                    online
                  </span> -->
                  <span>
                    {{ timeAgo3(item.createdAt, 'nav.header.visited') }}
                  </span>
                </div>
              </div>
            </div>
            <BaseButton
              v-if="!item.isFollowing"
              size="small"
              :icon="
                !(followLoadingId === item.id) ? 'fa-solid fa-user-plus' : ''
              "
              :loading="followLoadingId === item.id"
              data-cy="1a1291ce0befa762"
              @click.stop="onFollow(item)"
            >
              {{ $t('base.member.follow') }}
            </BaseButton>
            <div v-else class="flex items-center gap-1.5 text-xs">
              <i class="fa-solid fa-circle-check" />
              <span>{{ $t('base.member.following') }}</span>
            </div>
          </div>
        </template>
        <div v-show="loading" class="flex flex-col">
          <div v-for="i in 6" :key="i" class="flex gap-2 p-4">
            <BaseSkeleton :length="1" class="w-10" height="2rem" />
            <BaseSkeleton :length="1" class="flex-1" height="2rem" />
          </div>
        </div>
        <div
          v-if="
            dataList.length > 0 &&
            !isThisWeek(dataList[dataList.length - 1].createdAt)
          "
          class="border-t border-t-white/10 px-20 py-4 text-center text-white/40"
        >
          {{ $t('nav.header.profile.status.inactive') }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    const notificationStore = useNotificationStore();
    return { authStore, profileStore, notificationStore };
  },
  data() {
    return {
      open: false,
      dataList: [],
      loading: false,
      next: null,
      isNoMore: false,
      followLoading: false,
      followLoadingId: null,
    };
  },
  computed: {
    disabled() {
      return this.loading || this.isNoMore;
    },
  },
  watch: {
    'notificationStore.showVisitors'(val) {
      if (val) {
        this.load();
      }
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const {
        data,
        cursor: { next },
      } = await this.notificationStore.getProfileViewers({
        limit: 20,
        next: this.next,
      });
      if (this.next === null) {
        this.dataList = data || [];
      } else {
        data.forEach((item) => {
          if (!this.dataList.find((i) => i.id === item.id)) {
            this.dataList.push(item);
          }
        });
      }
      this.next = next;
      this.isNoMore = !next;
      this.loading = false;
    },
    visit(item) {
      this.profileStore.gotoProfilePage(item);
      this.notificationStore.showVisitors = false;
    },
    async onFollow(item) {
      if (this.followLoadingId) {
        return;
      }
      this.followLoadingId = item.id;
      const { followed } = await this.profileStore.follow(item);
      item.isFollowing = followed;
      this.followLoadingId = null;
    },
    isNewDate(index) {
      if (index === 0) {
        return true;
      }
      const prev = this.dataList[index - 1];
      const current = this.dataList[index];
      if (isThisWeek(prev.createdAt) && !isThisWeek(current.createdAt)) {
        return true;
      }
    },
  },
};
</script>
