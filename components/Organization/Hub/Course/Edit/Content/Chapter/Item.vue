<template>
  <div
    :chapter-id="chapter.id"
    class="relative mb-2 rounded transition-all"
    :class="open ? 'bg-[#ffffff05]' : 'hover:bg-white/5'"
  >
    <div class="group/chapter relative p-1 pr-1">
      <div class="flex items-center justify-between gap-2">
        <div class="flex flex-1 items-center gap-2">
          <div
            class="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-sm hover:bg-white/5"
            data-cy="ab7640b8ea3496f6"
            @click="open = !open"
          >
            <i
              class="fa-light fa-chevron-right text-white/20 transition-all duration-300 hover:text-white/50"
              :class="open ? 'rotate-90' : '!hidden group-hover/chapter:!flex'"
            />
            <i
              v-if="!open"
              class="fa-light fa-bookmark mt-0.5 text-white/20 group-hover/chapter:hidden"
            />
          </div>
          <BaseInput
            v-model="chapter.name"
            fixed
            class="flex-1"
            title="Chapter Title"
            :class="hubCourse.contentEditable ? '' : 'pointer-events-none'"
            :max-length="200"
            @blur="onChapterNameBlur"
          >
            <template #suffix>
              <div class="flex h-6 w-6 items-center justify-center">
                <el-tooltip
                  v-if="chapterIndex === 0"
                  placement="bottom"
                  effect="light"
                  :show-arrow="false"
                  :offset="5"
                  popper-class="!bg-black !border-white/20"
                >
                  <i
                    class="fa-regular fa-circle-info cursor-pointer text-white/40 hover:text-white/50"
                  />
                  <template #content>
                    <div>{{ $t('course.description.content1') }}</div>
                    <div>{{ $t('course.description.content2') }}</div>
                    <div>{{ $t('course.description.content3') }}</div>
                    <div>{{ $t('course.description.content4') }}</div>
                    <div>{{ $t('course.description.content5') }}</div>
                  </template>
                </el-tooltip>
                <div
                  v-else
                  :class="
                    chapter._state === 'checked' ||
                    chapter._state === 'halfChecked'
                      ? ''
                      : 'opacity-0 group-hover/chapter:opacity-100'
                  "
                >
                  <OrganizationHubCourseEditContentCheckbox :item="chapter" />
                </div>
              </div>
            </template>
          </BaseInput>
        </div>
      </div>
      <OrganizationHubCourseEditContentChapterDuration
        v-if="chapterIndex !== 0 && course.type === 'live'"
        :disabled="!open"
        :chapter="chapter"
        :course="course"
        :is-update="true"
        :chapter-index="chapterIndex"
        :class="hubCourse.contentEditable ? '' : 'pointer-events-none'"
      />
    </div>
    <div
      class="overflow-hidden transition-all"
      :class="{
        'max-h-[1024rem] pt-2': open,
        'max-h-0 pt-0 opacity-0': !open,
        'pointer-events-none': !hubCourse.contentEditable,
      }"
    >
      <OrganizationHubCourseEditContentLecture
        v-for="(lecture, lectureIndex) in chapter.lectures"
        :key="lectureIndex"
        :chapter="chapter"
        :chapter-index="chapterIndex"
        :lecture="lecture"
        :lecture-index="lectureIndex"
      />
      <OrganizationHubCourseEditContentLectureAdd
        :chapter-index="chapterIndex"
        :chapter="chapter"
      />
    </div>
    <div
      class="bg-gradient-left absolute bottom-0 left-0 top-0 w-[1px] opacity-20"
    />
    <div
      class="bg-gradient-left absolute bottom-0 right-0 top-0 w-[1px] opacity-20"
    />
  </div>
</template>

<script>
export default {
  props: {
    chapter: Object,
    chapterIndex: Number,
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      titleFocus: false,
      open: this.chapterIndex !== 0,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
  },
  watch: {
    'hubCourse.listView': {
      handler(newValue) {
        this.open = newValue;
      },
      immediate: true,
    },
  },
  methods: {
    onChapterNameBlur() {
      if (this.chapter.name) {
        this.hubCourse.updateChapter({
          chapterId: this.chapter.id,
          name: this.chapter.name,
        });
      }
    },
  },
};
</script>
