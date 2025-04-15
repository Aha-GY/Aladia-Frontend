<template>
  <div
    class="relative rounded-5 border border-white/10 bg-[#0C0C0C] p-2 pl-3 transition-all"
    :class="{ 'mb-16': numberOfElements }"
  >
    <div class="group/requirement sticky top-11 !z-[100] bg-[#0C0C0C]">
      <div
        class="flex items-center justify-between gap-2"
        :class="{ 'pb-2': open && requirements.length }"
      >
        <div
          class="flex flex-1 cursor-pointer items-center gap-2"
          @click="open = !open"
        >
          <div
            class="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-sm"
          >
            <i
              class="fa-light fa-chevron-right text-white transition-all duration-300 hover:text-white/50"
              :class="
                open ? 'rotate-90' : '!hidden group-hover/requirement:!flex'
              "
            />
            <div
              v-if="!open"
              class="mt-0.5 text-sm text-white group-hover/requirement:hidden"
            >
              {{ requirements.length }}
            </div>
          </div>
          <div class="text-sm">Requirements</div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <div
            v-if="open && requirements.length"
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
      v-show="open && requirements.length"
      :key="renderKey"
      class="transition-all"
      :class="{
        'max-h-fit pt-2': open && requirements.length,
        'max-h-0 pt-0 opacity-0': !open,
      }"
    >
      <div
        v-for="(_, index) in requirements"
        :key="index"
        class="mb-1 flex flex-col"
      >
        <OrganizationHubCourseEditInfoGoalItem
          :goal="requirements[index]"
          :index="index"
          :type="'Requirement'"
          :list-view="listView"
          :place-holder="'Write Your Requirement'"
          :state="
            selectedRequirements.includes(index) ? 'checked' : 'unchecked'
          "
          @on-select="onSelect"
          @on-remove="onRemove"
        />
      </div>

      <div
        v-if="requirements.length"
        class="flex items-center justify-center text-sm"
      >
        <i class="fa-light fa-add cursor-pointer" @click="onAdd" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedRequirements: {
      type: Array,
      default: () => [],
    },
    numberOfElements: {
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
      open: false,
      listView: false,
      renderKey: 0,
    };
  },
  computed: {
    requirements() {
      const { requirements } = this.hubCourse.detail;
      return requirements;
    },
  },
  methods: {
    async onAdd() {
      this.requirements.push('');
      this.open = true;
    },
    onSelect(index) {
      this.$emit('on-select', index, 'requirement');
    },
    async onRemove(index) {
      this.$emit('on-remove', index, 'requirement');
    },
  },
};
</script>
