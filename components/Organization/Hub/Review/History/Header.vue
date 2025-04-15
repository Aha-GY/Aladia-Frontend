<template>
  <div class="flex items-center justify-between">
    <div ref="menu" class="relative flex items-center gap-2">
      <div
        v-for="(item, index) in menu"
        :key="item.name"
        class="flex h-7 cursor-pointer items-center justify-center gap-2 px-6 text-xs font-semibold text-[#707070] transition-all hover:text-[#D9D9D9] active:scale-95"
        :class="activeClass(index)"
        data-cy="bf7148546abe2a73"
        @click="onTabChange($event, index)"
      >
        <i v-if="item.icon" class="fa-light" :class="`${item.icon}`" />
        {{ $t(item.title) }}
      </div>
      <div
        ref="underline"
        class="pointer-events-none absolute bottom-0 left-0.5 z-20 h-[1px] w-16 bg-[#D9D9D9] transition-all duration-300"
      />
    </div>

    <div class="flex items-center gap-4">
      <BaseButton
        class="transition-all"
        type="secondary"
        :icon="hubReviewStore.open ? 'fa-chevron-up' : 'fa-chevron-down'"
        data-cy="543e9edd6bd96a6a"
        @click="hubReviewStore.open = !hubReviewStore.open"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore };
  },
  data() {
    return {
      menu: [
        {
          title: 'course.question.status.all',
          name: 'all',
        },
        {
          title: 'course.question.status.notAnswered',
          name: 'not-answered',
          icon: 'fa-xmark text-[#C35959]',
        },
        {
          title: 'course.question.status.answered',
          name: 'answered',
          icon: 'fa-check text-[#88C359]',
        },
      ],
    };
  },
  computed: {
    length() {
      return this.hubReviewStore.selects.length;
    },
    index() {
      return this.hubReviewStore.index;
    },
  },
  watch: {
    index() {
      this.$nextTick(() => {
        const tab = this.$refs.menu.children[this.index];
        if (tab) {
          this.$refs.underline.style.width = `${tab.clientWidth}px`;
          this.$refs.underline.style.left = `${tab.offsetLeft}px`;
        }
      });
    },
  },
  methods: {
    onTabChange(event, index) {
      this.hubReviewStore.index = index;
      const tab = event.currentTarget;
      if (tab) {
        this.$refs.underline.style.width = `${tab.clientWidth}px`;
        this.$refs.underline.style.left = `${tab.offsetLeft}px`;
      }
    },
    activeClass(index) {
      const className = 'text-[#D9D9D9]';
      return this.index === index ? className : '';
    },
  },
};
</script>
