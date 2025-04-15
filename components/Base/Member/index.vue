<template>
  <div class="relative flex h-full w-full flex-col gap-2">
    <BaseInput
      v-model="name"
      fixed
      class="pb-1 pl-2"
      :placeholder="$t('base.member.search')"
    />
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || !next"
      :infinite-scroll-distance="20"
      class="flex h-0 w-full flex-1 flex-col gap-1 overflow-y-auto pb-8 pr-1"
      :style="{ height }"
    >
      <BaseMemberItem
        v-for="member in members"
        :key="member.id"
        :type="type"
        :params="params"
        :member="member"
        :actives="actives"
        @change="change($event, member)"
      />
      <BaseSkeleton v-show="loading" height="2.5rem" />
    </div>
    <BasePopupBottom
      v-if="isShowPopupBottom"
      :clear="clear"
      @clear="$emit('clear')"
      @close="$emit('close')"
    />
  </div>
</template>

<script>
export default {
  props: {
    clear: {
      type: Boolean,
      default: false,
    },
    actives: {
      type: Array,
      default: () => [],
    },
    exclude: {
      type: Array,
      default: () => [],
    },
    height: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'global',
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    isShowPopupBottom: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const globalStore = useGlobalStore();
    return { globalStore, hubSpaces, hubCourse };
  },
  data() {
    return {
      name: '',
      next: null,
      members: [],
      loading: false,
      timer: null,
    };
  },
  watch: {
    name() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.next = null;
      this.members = [];
      this.load();
    },
    async load() {
      this.loading = true;

      const api = {
        global: this.globalStore.searchProfile,
        space: this.hubSpaces.searchPotentialMembers,
        course: this.hubCourse.searchMembers,
      }[this.type];

      const {
        data,
        cursor: { next },
      } = await api({
        limit: 20,
        next: this.next,
        text: this.name || undefined,
        ...this.params,
      });

      this.next = next;
      this.members = [...this.members, ...data].filter(
        (item) => !this.exclude.includes(item.id),
      );

      this.loading = false;
    },
    change(active, member) {
      this.$emit('onChange', active, member);
    },
  },
};
</script>
