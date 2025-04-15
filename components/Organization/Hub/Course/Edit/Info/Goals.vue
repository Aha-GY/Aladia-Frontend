<template>
  <div
    ref="scrollToElement"
    class="relative mb-4 rounded-5 border border-white/10 bg-[#0C0C0C] p-2 pl-3 transition-all"
  >
    <div class="group/goal sticky top-11 z-[80] bg-[#0C0C0C]">
      <div
        class="flex items-center justify-between gap-2"
        :class="{ 'pb-2': open }"
      >
        <div
          class="flex flex-1 cursor-pointer items-center gap-2"
          :class="{
            'text-red-500': showError,
          }"
          @click="open = !open"
        >
          <div
            class="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-sm"
          >
            <i
              class="fa-light fa-chevron-right text-white transition-all duration-300 hover:text-white/50"
              :class="open ? 'rotate-90' : '!hidden group-hover/goal:!flex'"
            />
            <div v-if="!open" class="mt-0.5 text-sm group-hover/goal:hidden">
              {{ numberOfGoals }}
            </div>
          </div>
          <div class="text-sm">
            Goals
            <span class="text-red-500">*</span>
            <div v-if="showError" class="text-xs text-[#ED3C28]">
              At least 5 golas required
            </div>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <div
            v-if="open"
            class="flex h-7 cursor-pointer items-center justify-center gap-2 rounded bg-white/10 px-1.5 text-xs text-[#FAFAFA]"
          >
            <i
              class="fa-light fa-list-tree hover:bg-white/10 hover:text-white/50"
              @click="
                listView = true;
                renderKey++;
              "
            />
            <i
              class="fa-light fa-list hover:bg-white/10 hover:text-white/50"
              @click="
                listView = false;
                renderKey++;
              "
            />
          </div>
          <div
            class="flex h-7 cursor-pointer items-center justify-center rounded bg-white/10 px-1.5 text-xs text-[#FAFAFA] hover:bg-white/20"
            @click="onAdd"
          >
            <i
              v-if="false"
              class="fa-light fa-loader mr-1.5 animate-spin text-xs"
            />
            <i v-else class="fa-light fa-add mr-1.5" />
            {{ $t('event.add') }}
          </div>
        </div>
      </div>
    </div>

    <div
      v-show="open"
      :key="renderKey"
      class="transition-all"
      :class="{
        'max-h-fit pt-2': open,
        'max-h-0 pt-0 opacity-0': !open,
      }"
    >
      <div v-for="(_, index) in goals" :key="index" class="mb-1 flex flex-col">
        <OrganizationHubCourseEditInfoGoalItem
          :goal="goals[index]"
          :index="index"
          :list-view="listView"
          :type="'Goal'"
          :place-holder="'Write your goal.'"
          :state="selectedGoals.includes(index) ? 'checked' : 'unchecked'"
          @on-select="onSelect"
          @on-remove="onRemove"
        />
      </div>

      <div v-if="goals.length" class="flex items-center justify-center text-sm">
        <i class="fa-light fa-add cursor-pointer" @click="onAdd" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedGoals: {
      type: Array,
      default: () => [],
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    const { $eventBus: eventBus } = useNuxtApp();
    return { hubCourse, eventBus };
  },
  data() {
    return {
      open: true,
      listView: false,
      renderKey: 0,
      showError: false,
    };
  },
  computed: {
    goals() {
      return this.hubCourse.detail.objectives;
    },
    numberOfGoals() {
      return this.goals.length;
    },
  },
  watch: {
    'hubCourse.detail.objectives': {
      handler(newVal) {
        if (!newVal || newVal.length === 0) {
          this.hubCourse.detail.objectives = Array(5).fill('');
        }
        const objectives = this.goals.filter(Boolean);
        if (objectives.length >= 5) {
          this.showError = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.eventBus.on('SAVE-INFO', this.validate);
  },
  beforeUnmount() {
    this.eventBus.off('SAVE-INFO', this.validate);
  },
  methods: {
    async onAdd() {
      this.goals.push('');
      this.open = true;
    },
    onSelect(index) {
      this.$emit('on-select', index, 'goal');
    },
    onRemove(index) {
      this.$emit('on-remove', index, 'goal');
    },
    validate() {
      const objectives = this.goals.filter(Boolean);
      if (objectives.length < 5) {
        this.showError = true;
        if (
          this.hubCourse.detail.title &&
          this.hubCourse.detail.languageId &&
          this.hubCourse.detail.skills.length >= 3
        ) {
          this.scrollToError();
        }
      }
    },
    scrollToError() {
      const element = this.$refs.scrollToElement;
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
  },
};
</script>
