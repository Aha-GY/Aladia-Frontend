<template>
  <div
    class="mb-2 flex w-full flex-col gap-4 rounded-md border-[0.5px] border-[#FFFFFF0D] bg-[#0C0C0C] p-4 pb-6 text-sm"
  >
    <div class="flex items-center gap-2 pl-1.5 text-base">
      <i class="fa-regular fa-graduation-cap" />
      <span>{{ $t('course.label') }}</span>
    </div>
    <div class="flex w-full items-center justify-between pl-1.5">
      <div>Generate Thumbnail with AI?</div>
      <BaseSwitcher
        :active="ai.info.generateCourseThumbnail"
        @change="onThumbnailChange"
      />
    </div>
    <div class="flex w-full items-center justify-between pl-1.5">
      <div>Select Categories with AI?</div>
      <BaseSwitcher
        :active="ai.assignCategories"
        @change="onAssignCategoryChange"
      />
    </div>
    <div class="flex w-full items-center justify-between pl-1.5">
      <el-popover
        ref="levelPopover"
        trigger="click"
        width="460"
        placement="bottom"
      >
        <template #reference>
          <div
            ref="levelRef"
            class="flex flex-1 items-center"
            data-cy="ef520b253cbaa949"
            @click="levelOpen = true"
          >
            <BaseInput
              ref="level"
              v-model="levelTitle"
              readonly
              :title="$t('course.level.label')"
            />
          </div>
        </template>
        <div class="flex flex-col p-1">
          <div
            class="mb-1 cursor-pointer rounded px-2 py-1 hover:bg-white/10"
            data-cy="412d921849bab618"
            @click="onLevelChange('beginner')"
          >
            {{ $t('course.level.beginner') }}
          </div>
          <div
            class="mb-1 cursor-pointer rounded px-2 py-1 hover:bg-white/10"
            data-cy="781bca3df2b9ddfb"
            @click="onLevelChange('intermediate')"
          >
            {{ $t('course.level.intermediate') }}
          </div>
          <div
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10"
            data-cy="26104b3684b7c133"
            @click="onLevelChange('advanced')"
          >
            {{ $t('course.level.advanced') }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="flex w-full items-center justify-between pl-1.5">
      <div class="flex-1">
        <div class="pb-1">Describe Your Course</div>
        <textarea
          v-model="ai.info.description"
          class="h-24 w-full resize-none rounded border-none bg-white/5 p-2 outline-none placeholder:text-white/30"
          maxlength="500"
          :placeholder="$t('org.description.add')"
        />
        <div
          class="text-end text-xs"
          :class="length === 500 ? 'text-red-500' : 'text-gray-400'"
        >
          {{ length }}/500
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const levelRef = ref(null);
    const levelOpen = ref(false);
    const hubCourse = useHubCoursesStore();
    return { hubCourse, levelRef, levelOpen };
  },
  data() {
    return {
      levelTitle: 'Beginner',
    };
  },
  computed: {
    ai() {
      return this.hubCourse.ai;
    },
    length() {
      return this.ai.info.description.length;
    },
  },
  watch: {
    levelOpen(state) {
      if (state) {
        this.$refs.level.$refs.input.blur();
        this.$refs.level.focus = true;
      }
    },
  },
  mounted() {
    const level = this.ai.info.studentExperience;
    this.levelTitle = level.charAt(0).toUpperCase() + level.slice(1);
  },
  methods: {
    onLevelChange(level) {
      this.levelTitle = level.charAt(0).toUpperCase() + level.slice(1);
      this.levelOpen = false;
      this.$refs.level.focus = false;
      this.ai.info.studentExperience = level;
      this.$refs.levelPopover.hide();
    },
    onThumbnailChange(value) {
      this.ai.info.generateCourseThumbnail = value;
    },
    onAssignCategoryChange(value) {
      this.ai.assignCategories = value;
    },
  },
};
</script>
