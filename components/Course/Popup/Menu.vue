<template>
  <div class="flex items-center gap-2 text-13">
    <div
      v-for="item in types"
      :key="item.name"
      class="cursor-pointer border-b px-3 py-1.5 text-center transition-all xs:px-6 md:px-3 lg:px-6"
      :class="
        item.name === popup.type
          ? 'border-[#dabb4b] text-[#dabb4b]'
          : 'border-transparent hover:border-[#a9a9a9] hover:bg-white/10'
      "
      data-cy="c512a8aaa4ed23f6"
      @click="onTypeClick(item.name)"
    >
      <i :class="item.icon" />
      <span class="ml-2 hidden md:inline-block">{{ $t(item.title) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    hasLive() {
      return this.course.type === 'live';
    },
    popup() {
      return this.courseStore.popup;
    },
    types() {
      const subjectsType =
        this.courseStore.subjects?.length > 0
          ? [
              {
                name: 'subjects',
                title: 'course.header.subjects',
                icon: 'fa-regular fa-chalkboard-user',
              },
            ]
          : [];
      return this.hasLive
        ? [
            {
              name: 'chat',
              title: 'course.header.chat',
              icon: 'fa-light fa-message-lines',
            },
            {
              name: 'calendar',
              title: 'course.header.calender',
              icon: 'fa-light fa-calendar-lines',
            },
            {
              name: 'review',
              title: 'course.header.review',
              icon: 'fa-solid fa-star',
            },
            {
              name: 'description',
              title: 'course.header.description',
              icon: 'fa-light fa-list',
            },
            ...subjectsType,
          ]
        : [
            {
              name: 'question',
              title: 'course.header.qaFull',
              icon: 'fa-light fa-comments-question',
            },
            {
              name: 'review',
              title: 'course.header.review',
              icon: 'fa-solid fa-star',
            },
            {
              name: 'description',
              title: 'course.header.description',
              icon: 'fa-light fa-list',
            },
            ...subjectsType,
          ];
    },
  },
  methods: {
    onTypeClick(type) {
      this.courseStore.popup.type = type;
    },
  },
};
</script>
