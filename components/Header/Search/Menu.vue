<template>
  <div
    class="relative mb-4 flex items-center border-b border-white/20 pb-1 text-13"
  >
    <div
      v-for="tab in tabs"
      :key="tab.name"
      class="flex w-28 cursor-pointer items-center justify-center gap-2 transition-all active:scale-95"
      :class="
        searchStore.type === tab.name
          ? 'active text-[#E0B92C]'
          : 'text-[#FAFAFA]'
      "
      :data-cy="`search-${tab.name}-tab`"
      @click="searchStore.type = tab.name"
    >
      <i
        :class="[
          tab.icon,
          searchStore.type === tab.name ? 'fa-solid' : 'fa-light',
        ]"
      />
      <span>{{ $t(tab.title) }}</span>
    </div>
    <div
      ref="underline"
      class="pointer-events-none absolute -bottom-[1px] left-0 z-20 h-[1px] w-28 bg-[#E0B92C] transition-all duration-300"
    />
  </div>
</template>

<script>
export default {
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  data() {
    return {
      tabs: [
        {
          name: 'all',
          title: 'nav.header.search.menu.all',
          icon: 'fa-cards-blank',
        },
        {
          name: 'courses',
          title: 'nav.header.search.menu.courses',
          icon: 'fa-books',
        },
        {
          name: 'profiles',
          title: 'nav.header.search.menu.profiles',
          icon: 'fa-users',
        },
        {
          name: 'posts',
          title: 'nav.header.search.menu.posts',
          icon: 'fa-message-image',
        },
      ],
    };
  },
  watch: {
    'searchStore.type': {
      immediate: true,
      handler() {
        this.$nextTick(() => this.onTabChange());
      },
    },
  },
  methods: {
    onTabChange() {
      const tab = this.$el.querySelector('.active');
      if (tab && this.$refs.underline) {
        this.$refs.underline.style.left = `${tab.offsetLeft}px`;
      }
    },
  },
};
</script>
