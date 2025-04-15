<template>
  <div
    ref="courseItem"
    class="flex cursor-pointer items-center gap-3 rounded-[0.3125rem] px-1 py-1 text-xs transition-all hover:bg-white/5"
    data-cy="a24ba330a6c57ab8"
    @click="handleUserClick"
  >
    <div
      class="relative h-[3.3125rem] w-[5.625rem] shrink-0 rounded-[0.3125rem] bg-black/80"
    >
      <BaseCourseThumbnail
        class="h-full w-full rounded-[0.3125rem] object-contain"
        :url="item.thumbnail?.url"
      />
      <div v-if="owner" class="absolute -bottom-2 -right-1 z-[1]">
        <BaseAvatarNext
          :picture="owner?.picture"
          :story="owner?.story"
          :user-id="owner?.id"
          :online="owner?.online"
          :size="'sm'"
        />
      </div>
    </div>
    <div class="flex flex-col truncate">
      <div
        class="truncate font-medium text-[#E0B92C]"
        :class="{
          'text-[#EB4937]': item.type === 'live',
          'text-[#E0B92C]': item.type === 'on-demand',
        }"
      >
        {{ CourseTypeText }}
      </div>
      <div class="truncate py-1 font-semibold text-[#D9D9D9]" v-html="name" />

      <div class="truncate font-semibold">
        <span class="mr-1 text-[#B0B0B0]">
          {{ $t('post.by') }}
        </span>
        <span
          class="text-[#D9D9D9] hover:underline hover:underline-offset-2"
          data-action="toProfile"
        >
          {{ item?.owner?.name }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: Object,
    searchValue: {
      type: String,
      default: '',
    },
  },
  setup() {
    const profileStore = useProfileStore();
    return { profileStore };
  },
  data() {
    return {
      isLive: false,
    };
  },
  computed: {
    name() {
      const name = this.item.title;
      if (this.searchValue) {
        return highlightKeywords(this.item.title, [this.searchValue]);
      } else {
        return name;
      }
    },
    owner() {
      return this.item?.owner;
    },
    CourseTypeText() {
      if (this.item.type === 'live') {
        return 'Live';
      }
      if (this.item.type === 'on-demand') {
        return 'On Demand';
      }
      return '';
    },
  },
  methods: {
    handleUserClick(event) {
      const parent = this.$refs.courseItem;
      let target = event.target;

      // Traverse up the DOM tree to find the closest element with data-action attribute
      while (target && target !== parent && !target.dataset.action) {
        target = target.parentElement;
      }

      if (target && target.dataset.action === 'toProfile') {
        return this.profileStore.gotoProfilePage(this.item.owner);
      }

      this.$router.push(`/courses/${this.item.id}`);
    },
  },
};
</script>
