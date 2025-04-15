<template>
  <div class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2 text-white/50">
      <i class="fa-light fa-star" />
    </div>
    <el-popover
      ref="more"
      :width="390"
      trigger="click"
      placement="bottom"
      @show="show = true"
      @hide="show = false"
    >
      <template #reference>
        <div class="relative flex-1">
          <BaseInput
            ref="review"
            v-model="value"
            readonly
            title="Allow students to review this course after:"
            data-cy="edit-course-review"
            @click="focus = true"
            @blur="focus = false"
          >
            <template #tooltip>
              <el-tooltip placement="top" effect="light">
                <i
                  class="fa-regular fa-circle-info pointer-events-auto text-xs text-white/50"
                />
                <template #content>
                  Choose when the student will be eligible to leave a review
                  <br />
                  based on their course progress.
                </template>
              </el-tooltip>
            </template>
          </BaseInput>
        </div>
      </template>
      <div class="flex max-h-96 flex-col gap-1.5 overflow-y-auto p-1.5">
        <div
          v-for="(item, index) in list"
          :key="item.value"
          class="group/item flex cursor-pointer flex-col items-start justify-center rounded px-3 py-1.5 hover:bg-white/5"
          :data-cy="`edit-course-review-${item.value}`"
          @click="onClick(item.value)"
        >
          <h3 class="text-base text-[#F1F1F1]">
            {{ item.value }} {{ index !== 0 ? 'Completion' : '' }}
          </h3>
          <p class="text-xs font-medium text-[#707070]">
            {{ item.description }}
          </p>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  data() {
    return {
      show: false,
      focus: false,
      value: 'Always',
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    list() {
      return [
        {
          value: 'Always',
          description: 'Students can review the course at any time.',
        },
        {
          value: '25%',
          description:
            'Reviews will be available after 25% of the course is completed.',
        },
        {
          value: '50%',
          description:
            'Reviews will be available after half of the course is completed.',
        },
        {
          value: '75%',
          description:
            'Reviews will be unlocked when 75% of the course is completed.',
        },
        {
          value: '100%',
          description:
            'Students can only review the course after completing it.',
        },
      ];
    },
  },
  methods: {
    async onClick(value) {
      this.$refs.more.hide();
      this.$refs.review.$refs.input.focus();
      this.value = value;
    },
  },
};
</script>
