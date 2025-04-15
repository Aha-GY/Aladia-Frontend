<template>
  <div>
    <div
      class="group/lecture mb-2 rounded p-3 font-light transition-all"
      :class="open ? 'bg-white/5' : 'hover:bg-white/5'"
    >
      <div class="flex cursor-pointer items-center gap-3" @click="open = !open">
        <div
          class="flex size-5 shrink-0 items-center justify-center rounded hover:bg-white/10 group-hover/lecture:bg-white/10"
        >
          <div :class="open ? '' : 'hidden group-hover:flex'">
            <i
              class="fa-solid fa-angle-right transition-all"
              :class="{ 'rotate-90': open }"
            />
          </div>
          <div :class="open ? 'hidden' : 'group-hover:hidden'">
            <i class="fa-solid fa-angle-right transition-all" />
          </div>
        </div>
        {{ `Lecture ${lecture.lectureIndex + 1}` }}: {{ lecture.title }}
      </div>
      <div
        class="hide-scrollbar overflow-hidden overflow-y-scroll pl-8 transition-all duration-300"
        :class="{ 'max-h-[36rem] py-4': open, 'max-h-0 py-0': !open }"
      >
        <CoursePopupDescriptionNoData
          v-if="!lecture.description && lecture.attachments.length <= 0"
        />

        <div v-else class="mb-4">
          <div
            v-if="lecture.description"
            class="[&>ul]:ml-6 [&>ul]:list-disc"
            v-html="lecture.description"
          />
          <div v-else class="flex items-center gap-2">
            <div class="flex size-12 items-center justify-center text-white/60">
              <i class="fa-light fa-file text-lg" />
            </div>
            <div>No Description Available</div>
          </div>
          <div v-if="lecture.attachments.length > 0">
            <div class="mb-1 mt-4">Links shown in class:</div>
            <div
              v-for="(attachment, attachmentIndex) in lecture.attachments"
              :key="attachmentIndex"
              class="flex items-center gap-2"
            >
              <i class="fa-regular fa-paperclip" />
              <a class="underline" :href="attachment.url" target="_blank">
                {{ attachment.metadata.name }}
              </a>
            </div>
          </div>
        </div>

        <div
          v-if="lecture.description || lecture.attachments.length"
          class="mt-4 flex h-6 w-24 cursor-pointer items-center justify-center text-xs hover:bg-white/5"
          @click="open = false"
        >
          {{ $t('course.material.read.less') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lecture: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      open: false,
    };
  },
};
</script>
