<template>
  <div class="w-60">
    <div class="mb-6 flex items-center gap-4 rounded-l bg-[#0a0a0a] py-1 pl-2">
      <img src="~/assets/blank.png" class="h-4" />
      {{
        index === 0
          ? $t('course.chapter.introduction')
          : $t('course.chapter.index', { index: index })
      }}
    </div>
    <div class="mb-4">
      <div>{{ $t('index.title') }}</div>
      <div class="text-sm text-white/50">
        {{ index === 0 ? $t('course.chapter.introduction') : chapter.title }}
      </div>
    </div>
    <div class="mb-4">
      <div>{{ $t('base.courses.lectures') }}</div>
      <div class="text-sm text-white/50">0 / 5</div>
    </div>
    <div class="mb-4">
      <div>{{ $t('course.duration.name') }}</div>
      <div class="text-sm text-white/50">00:00 mm</div>
    </div>
    <div class="mb-4">
      <div>{{ $t('nav.header.notification.actions.storage.name') }}</div>
      <div class="text-sm text-white/50">0mb</div>
    </div>
    <div class="mb-4">
      <div>{{ $t('nav.header.notificationDesc.system.platform.access') }}</div>
      <div class="text-sm text-white/50" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    chapters() {
      return this.hubCourse.detail.chapters;
    },
    index() {
      return 0;
    },
    chapter() {
      return this.chapters[this.index];
    },
  },
};
</script>
