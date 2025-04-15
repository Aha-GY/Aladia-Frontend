<template>
  <div class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-3 text-white/50">
      <i class="fa-light fa-window-restore" />
    </div>
    <el-popover :visible="focus" :width="390" placement="bottom">
      <template #reference>
        <OrganizationHubCourseEditItem
          :value="course.visibility"
          :focus="focus"
          :title="$t('course.visibility.label')"
        >
          <div
            ref="visibilityRef"
            class="relative z-0 h-7 w-0 flex-1 cursor-pointer"
            :class="focus || course.visibility ? 'opacity-100' : 'opacity-0'"
            data-cy="2042538f0eecc370"
            @click="focus = !focus"
          >
            <BaseCourseVisibility
              v-if="course.visibility"
              class="h-full"
              :use-icon="false"
              :visibility="course.visibility"
            />
            <div v-else class="flex h-full items-center text-white/50">
              {{ $t('course.payment.select') }}
            </div>
          </div>
        </OrganizationHubCourseEditItem>
      </template>
      <div class="flex flex-col text-sm">
        <div
          class="cursor-pointer rounded p-1.5 hover:bg-white/5"
          data-cy="eace791c27303131"
          @click="onVisibilityClick('public')"
        >
          <div class="mb-2 flex items-center gap-2">
            <i class="fa-light fa-globe" />
            {{ $t('course.visibility.public.title') }}
          </div>
          <div class="break-normal text-left text-xs text-[#505050]">
            {{ $t('course.visibility.public.description') }}
          </div>
        </div>
        <div
          class="cursor-pointer rounded p-1.5 hover:bg-white/5"
          data-cy="66da227b5b1b0530"
          @click="onVisibilityClick('private')"
        >
          <div class="mb-2 flex items-center gap-2">
            <i class="fa-light fa-ban" />
            {{ $t('course.visibility.private.title') }}
          </div>
          <div class="break-normal text-left text-xs text-[#505050]">
            {{ $t('course.visibility.private.description') }}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  setup() {
    const focus = ref(false);
    const visibilityRef = ref(null);
    const hubCourse = useHubCoursesStore();

    onClickOutside(
      visibilityRef,
      () => {
        focus.value = false;
      },
      {
        ignore: [visibilityRef],
      },
    );

    return { hubCourse, focus, visibilityRef };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
  },
  methods: {
    onVisibilityClick(visibility) {
      this.course.visibility = visibility;
      this.focus = false;
    },
  },
};
</script>
