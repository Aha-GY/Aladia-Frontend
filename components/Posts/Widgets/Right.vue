<template>
  <div
    class="__right-widget ml-4 w-[21.25rem]"
    :class="[
      {
        'sticky top-[12rem]': sticky,
      },
      sticky ? height : '',
    ]"
  >
    <div :class="fixed ? 'fixed' : ''">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2 py-1.5 pl-[1.25rem] text-[1.25rem]">
          <i class="fa-regular fa-users text-[#B0B0B0]" />
          <div class="font-medium text-[#B0B0B0]">
            {{ $t('post.users.label') }}
          </div>
        </div>
        <slot name="toolbar" />
      </div>
      <div class="mb-2 px-4">
        <BaseInput
          v-model="name"
          search
          fixed
          clear
          :placeholder="$t('post.users.search')"
        />
      </div>
      <div
        v-if="name === ''"
        class="hide-scrollbar overflow-y-auto pb-20"
        :class="height"
      >
        <PostsWidgetsOnline class="mb-2" />
        <PostsWidgetsFollowers class="mb-2" />
        <PostsWidgetsSuggestions />
      </div>
      <div v-else>
        <PostsWidgetsUserSearch
          :profiles="profiles"
          :loading="loading"
          :total-items="totalItems"
          :load="load"
          :next="next"
          :name="name"
          @change="handleChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    height: {
      type: String,
      default: 'h-[calc(100vh-7rem)]',
    },
    fixed: {
      type: Boolean,
      default: true,
    },
    sticky: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();

    return { globalStore, fluxesStore };
  },
  data() {
    return {
      name: '',
      profiles: [],
      loading: false,
      next: null,
      totalItems: 0,
      timer: null,
    };
  },
  watch: {
    name() {
      this.loading = true;
      this.profiles = [];
      this.next = null;
      this.totalItems = 0;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.load();
      }, 1000);
    },
  },
  methods: {
    async load() {
      try {
        this.loading = true;
        const {
          data,
          cursor: { next, totalItems },
        } = await this.globalStore.searchProfile({
          next: this.next,
          limit: 10,
          text: this.name,
        });
        this.profiles = [...this.profiles, ...data];
        this.next = next;
        this.totalItems = totalItems;
      } finally {
        this.loading = false;
      }
    },
    handleChange({ item, isfollow }) {
      this.profiles = this.profiles.map((p) => {
        if (p.id === item.id) {
          return {
            ...p,
            isFollowing: isfollow,
          };
        }
        return p;
      });
    },
  },
};
</script>
