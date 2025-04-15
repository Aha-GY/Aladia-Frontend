<template>
  <transition name="slide-fade">
    <div
      v-if="show"
      class="absolute bottom-0 left-0 right-0 top-[3.4375rem] flex w-full flex-col bg-[#0c0c0c] text-white/80"
    >
      <div class="flex items-center gap-2 px-4 py-4 text-sm">
        <BaseIconClose @click="onCancel" />
        {{ $t('filter.user.select') }}
      </div>
      <div class="px-5">
        <BaseInput
          v-model="username"
          search
          clear
          fixed
          class="mb-3 text-sm"
          :placeholder="$t('base.search.user')"
          @enter="onEnter"
        />
      </div>
      <div
        v-infinite-scroll="load"
        :infinite-scroll-disabled="loading || !next"
        :infinite-scroll-distance="20"
        class="hide-scrollbar h-0 flex-1 overflow-y-auto px-2"
      >
        <template v-for="member in list" :key="member.id">
          <div
            class="flex cursor-pointer items-center justify-between gap-2 rounded p-1 hover:bg-white/10"
            @click="onChecked(member)"
          >
            <div class="flex flex-1 items-center gap-2 truncate">
              <div class="relative">
                <BaseAvatarNext
                  :picture="member.image"
                  :user-id="member.id"
                  :story="member?.story"
                  :size="'md'"
                  :show-online="false"
                  :checked="selecteds.some((m) => m.id === member.id)"
                  :show-check="true"
                  @change="onChecked(member)"
                />
              </div>
              <div class="flex-1 truncate">
                <div
                  class="truncate text-sm text-white"
                  v-html="highlightName(member.fullName)"
                />
                <div class="flex items-center gap-1 text-11">
                  <div v-if="member.isOnline" class="text-white/50">
                    {{ $t('base.member.online') }}
                  </div>
                  <div v-else class="w-32 truncate text-white/50">
                    {{ $t('base.member.lastSeen') }}
                    {{ timeAgo(member.lastAccessAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <BaseSkeleton v-if="loading" height="3.5rem" class="mx-2" />
      </div>
      <div class="flex items-center justify-between bg-white/5 px-4 py-2">
        <div
          class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
          @click="onCancel"
        >
          <i class="fa-light fa-trash-can text-xs" />
          {{ $t('base.upload.cancel') }}
        </div>
        <div
          class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
          @click="onSave"
        >
          <i class="fa-regular fa-filter" />
          {{ $t('filter.apply') }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    show: Boolean,
  },
  setup() {
    const hubChat = useHubChatStore();
    return { hubChat };
  },
  data() {
    return {
      username: '',
      selecteds: [],
      loading: false,
      list: [],
      next: null,
    };
  },
  watch: {
    username() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
    show(val) {
      if (val) {
        this.selecteds = [];
      }
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async init() {
      this.next = null;
      this.list = [];
      this.load();
    },
    async load() {
      this.loading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChat.searchRoomMembers({
        roomId: this.hubChat.roomInfo?.id,
        query: this.username.trim(),
        next: this.next,
      });
      if (this.next) {
        this.list = [...this.list, ...data];
      } else {
        this.list = data;
      }
      this.next = next;
      this.loading = false;
    },
    onEnter() {
      this.init();
    },
    onRemove() {},
    onCancel() {
      this.$emit('cancel');
    },
    onSave() {
      this.$emit('filter', this.selecteds);
    },
    onChecked(item) {
      if (this.selecteds.some((m) => m.id === item.id)) {
        this.selecteds = this.selecteds.filter((m) => m.id !== item.id);
      } else {
        this.selecteds.push(item);
        this.selecteds = this.selecteds.filter((m) => m.id === item.id);
      }
    },
    highlightName(name) {
      if (this.username) {
        return highlightKeywords(name || '', [this.username.trim()]);
      } else {
        return name;
      }
    },
  },
};
</script>
<style scoped>
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to /* .slide-fade-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateX(100%);
}
</style>
