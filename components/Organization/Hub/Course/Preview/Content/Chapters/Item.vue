<template>
  <div :data-chapter-index="chapterIndex" class="mb-4 text-sm">
    <div class="flex items-center justify-between gap-2 py-1">
      <div
        class="group/chevron flex h-7 w-7 cursor-pointer items-center justify-center"
        data-cy="85f254f11c1a2e3a"
        @click="open = !open"
      >
        <div
          v-if="!open"
          class="text-sm text-white/50 group-hover/chevron:hidden"
        >
          {{ chapterIndex + 1 }}
        </div>
        <div
          class="h-5 w-5 items-center justify-center rounded hover:bg-white/10"
          :class="open ? 'flex' : 'hidden group-hover/chevron:flex'"
        >
          <i
            class="fa-regular fa-chevron-right text-xs transition-all duration-300"
            :class="{ 'rotate-90': open }"
          />
        </div>
      </div>
      <div
        class="flex w-0 flex-1 items-center justify-between gap-8"
        :class="{
          'pointer-events-none': !hubCourse.contentEditable,
        }"
      >
        <BaseInput
          v-model="chapter.name"
          fixed
          title="Chapter Title"
          :max-length="200"
          show-limit
          @blur="onChapterNameBlur"
        />
        <div
          v-if="chapterIndex === 0"
          class="shrink-0 text-xs font-thin text-white/60"
        >
          <span class="text-red-600">*</span>
          {{ $t('base.courses.sell.description') }}
        </div>
        <OrganizationHubCourseEditContentChapterDuration
          v-if="course.type === 'live' && chapterIndex !== 0"
          :chapter="chapter"
          :course="course"
          class="!mt-0"
          :chapter-index="chapterIndex"
          :is-update="true"
        />
      </div>
      <div
        v-if="hubCourse.contentEditable"
        class="flex items-center gap-4 pr-3"
      >
        <el-popover
          ref="more"
          :width="100"
          trigger="click"
          placement="bottom-end"
        >
          <template #reference>
            <div
              class="flex h-6 w-6 cursor-pointer items-center justify-center rounded hover:bg-white/5"
              data-cy="chapter-menu-icon"
            >
              <i class="fa-light fa-ellipsis" />
            </div>
          </template>
          <div>
            <div
              class="group/menu flex cursor-pointer items-center gap-2 rounded py-1.5 pl-2 text-white/50 hover:bg-white/10 hover:text-white"
              data-cy="a36fe6b3f42776ef"
              @click="onInfoClick"
            >
              <div class="flex h-3 w-3 items-center justify-center">
                <i class="fa-solid fa-circle-info" />
              </div>
              {{ $t('org.activity.chat.info') }}
            </div>
            <div
              class="group/menu flex cursor-pointer items-center gap-2 rounded py-1.5 pl-2 text-white/50 hover:bg-white/10 hover:text-white"
              data-cy="be1d6c3f04e1f3da"
              @click="onClearClick"
            >
              <div class="flex h-3 w-3 items-center justify-center">
                <i
                  v-if="clearing"
                  class="fa-solid fa-spinner animate-spin text-xs"
                />
                <i v-else class="fa-solid fa-broom-wide" />
              </div>
              {{ $t('base.dialog.clearAll') }}
            </div>
            <div
              v-if="chapterIndex !== 0"
              class="group/menu flex cursor-pointer items-center gap-2 rounded py-1.5 pl-2 text-white/50 hover:bg-[#110706] hover:text-white"
              data-cy="delete-chapter-icon"
              @click="onDeleteClick"
            >
              <div class="flex h-3 w-3 items-center justify-center">
                <i
                  v-if="deleting"
                  class="fa-solid fa-spinner animate-spin text-xs"
                />
                <i v-else class="fa-sharp fa-solid fa-trash" />
              </div>
              {{ $t('base.editor.delete') }}
            </div>
          </div>
        </el-popover>
        <OrganizationHubCourseEditContentCheckbox
          v-if="chapterIndex !== 0"
          :item="chapter"
        />
      </div>
    </div>
    <div
      class="overflow-hidden bg-[#0b0b0b] transition-all duration-300"
      :class="open ? 'max-h-[1024rem]' : 'max-h-0'"
    >
      <OrganizationHubCoursePreviewContentLectures
        :chapter="chapter"
        :chapter-index="chapterIndex"
        :class="hubCourse.contentEditable ? '' : 'pointer-events-none'"
      />
    </div>
    <div
      v-if="open"
      class="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded bg-[#A20F0F]/5 px-2 py-0.5 text-[#94231b] hover:bg-[#a20f0f26]"
      data-cy="cd93201497f9d78f"
      @click="open = false"
    >
      <div class="flex size-3 items-center justify-center">
        <i class="fa-solid fa-arrow-turn-left text-sm" />
      </div>
      {{ $t('base.dialog.close') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chapter: {
      type: Object,
      required: true,
    },
    chapterIndex: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      open: true,
      clearing: false,
      deleting: false,
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    chapters() {
      return this.course.chapters;
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
    async onInfoClick() {
      //
    },
    onChapterNameBlur() {
      if (this.chapter.name) {
        this.hubCourse.updateChapter({
          chapterId: this.chapter.id,
          name: this.chapter.name,
        });
      }
    },
    async onClearClick() {
      if (this.clearing) {
        return;
      }
      try {
        this.clearing = true;
        if (this.chapter.lectures.length) {
          await this.hubCourse.deleteLectures({
            chapterId: this.chapter.id,
          });
          this.chapter.lectures.length = 0;
        }
        this.$refs.more.hide();
        this.clearing = false;
      } catch (error) {
        this.clearing = false;
        throw error;
      }
    },
    async onDeleteClick() {
      if (this.deleting) {
        return;
      }
      try {
        this.deleting = true;
        await this.hubCourse.deleteChapter({
          chapterId: this.chapter.id,
        });
        this.chapters.splice(this.chapterIndex, 1);
        this.$refs.more.hide();
        this.deleting = false;
      } catch (error) {
        this.deleting = false;
        throw error;
      }
    },
  },
};
</script>
