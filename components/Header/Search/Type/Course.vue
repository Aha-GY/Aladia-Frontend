<template>
  <div
    class="flex gap-2 rounded bg-black p-2 transition-all hover:bg-[#141414]"
  >
    <BaseCourseThumbnail
      class="h-20 cursor-pointer bg-white/10 !text-2xl"
      :url="course.thumbnail?.url"
      data-cy="search-course-thumbnail"
      @click="onClick"
    />
    <div class="flex flex-1 flex-col justify-between">
      <div class="flex items-center gap-2 text-sm">
        <BaseAvatarNext
          :picture="course.owner.picture"
          :story="course.owner?.story"
          :user-id="course.owner?.id"
          :online="course.owner.online"
          size="sm"
        />
        <div
          class="cursor-pointer text-xs hover:underline"
          data-cy="19496c64bc9e07b7"
          @click="onUserClick"
        >
          {{ course.owner.name }}
        </div>
      </div>
      <div
        class="w-96 cursor-pointer truncate text-sm"
        data-cy="8b84f9011ec08fd0"
        @click="onClick"
        v-html="title"
      />
      <div
        class="flex items-center gap-6 text-xs text-white/50"
        data-cy="4f7cfc91c25b0ab0"
        @click="onClick"
      >
        <div class="flex items-center gap-1">
          <i class="fa-regular fa-star" />
          {{ rating }}
        </div>
        <div class="flex items-center gap-1">
          <i class="fa-regular fa-clock" />
          {{ duration }}
        </div>
        <div class="flex items-center gap-1">
          <i class="fa-regular fa-bookmark" />
          {{ chapters }} {{ $t('base.courses.chapters') }}
        </div>
        <div class="flex items-center gap-1">
          <i class="fa-regular fa-book" />
          {{ lectures }} {{ $t('base.courses.lectures') }}
        </div>
        <BaseCourseType :type="course.type" class="!text-white/50" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    course: Object,
  },
  setup() {
    const profileStore = useProfileStore();
    const searchStore = useSearchStore();
    return { profileStore, searchStore };
  },
  computed: {
    rating() {
      return this.course.review?.globalRating?.toFixed?.(1);
    },
    duration() {
      return secondsToHours(this.course.chaptersDuration || 0);
    },
    chapters() {
      return this.course.version?.numberOf?.chapters;
    },
    lectures() {
      return (
        this.course.version?.numberOf?.onDemandLectures +
        this.course.version?.numberOf?.liveLectures
      );
    },
    title() {
      return highlightKeywords(this.course.title, [
        this.searchStore.query.title,
      ]);
    },
  },
  methods: {
    onClick() {
      this.$router.push(`/courses/${this.course.id}`);
      this.searchStore.query.title = '';
      this.searchStore.isFocus = false;
    },
    onUserClick() {
      this.profileStore.gotoProfilePage(this.course.owner);
      this.searchStore.query.title = '';
      this.searchStore.isFocus = false;
    },
  },
};
</script>
