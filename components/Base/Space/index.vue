<template>
  <div
    class="rounded-5 border-x border-transparent py-1 pl-[0.4375rem] pr-1.5"
    :class="open ? 'bg-white/5 pb-1.5' : 'hover:bg-white/5'"
    :style="{
      borderLeftColor: open || spaceHover ? space.color : 'transparent',
    }"
    @mouseenter="spaceHover = true"
    @mouseleave="spaceHover = false"
  >
    <div
      class="flex cursor-pointer items-center gap-2 px-1"
      data-cy="176c084704325bd7"
      @click="open = !open"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <div
        class="relative flex h-6 w-6 items-center justify-center rounded-5 hover:bg-white/5"
      >
        <BaseSpaceLogo v-if="!hover" :space="space" />
        <i
          v-else
          class="fa-light fa-chevron-right text-xs transition-all duration-300"
          :class="open ? 'rotate-90' : ''"
        />
      </div>
      <div class="w-0 flex-1 truncate text-base text-[#D9D9D9]" v-html="name" />
      <div class="flex h-6 w-6 items-center justify-center">
        <BaseCheckboxStyle
          :state="getState"
          data-cy="f372c08617f563b9"
          @click.stop="onChange"
        />
      </div>
    </div>
    <div
      class="hide-scrollbar flex flex-col gap-1 overflow-y-auto transition-all duration-300"
      :class="open && length ? 'max-h-screen pt-1' : 'max-h-0 pt-0'"
    >
      <BaseSpaceFolder
        v-for="folder in folders"
        :key="folder.id"
        :folder="folder"
        :actions="actions"
        :cycle-ids="cycleIds"
        :disableds="disableds"
        :search-value="searchValue"
        :is-live="isLive"
        :course-click="courseClick"
        :is-one-cycle="isOneCycle"
        @change="(e1, e2) => $emit('change', e1, e2)"
        @change-cycle="(e1, e2) => $emit('change-cycle', e1, e2)"
      />
      <BaseSpaceCourse
        v-for="course in courses"
        :key="course.id"
        :course="course"
        :actions="actions"
        :cycle-ids="cycleIds"
        :disableds="disableds"
        :is-live="isLive"
        :show-date="showDate"
        :show-licenses="showLicenses"
        :from="from"
        :course-click="courseClick"
        :org-licenses-assigned="orgLicensesAssigned"
        :search-value="searchValue"
        :is-one-cycle="isOneCycle"
        @change="(e1, e2) => $emit('change', e1, e2)"
        @change-cycle="(e1, e2) => $emit('change-cycle', e1, e2)"
        @edit="getSpaceData"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    space: Object,
    actions: {
      type: Array,
      default: () => [],
    },
    cycleIds: {
      type: Array,
      default: () => [],
    },
    isLive: {
      type: Boolean,
      default: () => false,
    },
    disableds: {
      type: Array,
      default: () => [],
    },
    showDate: {
      type: Boolean,
      default: () => true,
    },
    showLicenses: {
      type: Boolean,
      default: () => false,
    },
    from: {
      type: String,
      default: () => '',
    },
    orgLicensesAssigned: {
      type: Array,
      default: () => [],
    },
    searchValue: {
      type: String,
      default: '',
    },
    courseClick: {
      type: Boolean,
      default: false,
    },
    isOneCycle: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar };
  },
  data() {
    return {
      open: true,
      spaceHover: false,
      hover: false,
    };
  },
  computed: {
    length() {
      return this.folders.length + this.courses.length;
    },
    folders() {
      return (
        this.space?.rootFolder?.subFolders.filter((r) => {
          const courses = r?.courses.filter(
            (r) =>
              r &&
              r.calendarId &&
              r.title.toLowerCase().includes(this.searchValue.toLowerCase()),
          );

          return (
            courses.length ||
            r.name.toLowerCase().includes(this.searchValue.toLowerCase())
          );
        }) || []
      );
    },
    courses() {
      return (this.space?.rootFolder?.courses || []).filter(
        (r) =>
          r &&
          (this.isLive ? r.calendarId : true) &&
          r.title.toLowerCase().includes(this.searchValue.toLowerCase()),
      );
    },
    allCourses() {
      const allCourses = [...this.courses];
      this.folders.map((folder) => {
        allCourses.push(
          ...folder.courses.filter((r) =>
            r && this.isLive ? r.calendarId : true,
          ),
        );
      });
      return allCourses;
    },
    getState() {
      let checkNum = 0;
      const allLen = this.allCourses.length;

      for (let i = 0; i < allLen; i++) {
        if (
          this.actions.includes(
            this.allCourses[i][this.isLive ? 'calendarId' : 'id'],
          )
        ) {
          checkNum += 1;
        }
      }

      return checkNum > 0
        ? checkNum === allLen
          ? 'checked'
          : 'halfChecked'
        : 'unchecked';
    },
    name() {
      if (this.searchValue) {
        return highlightKeywords(this.space.name || '', [this.searchValue]);
      } else {
        return this.space.name;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (!this.length) {
        this.open = false;
      }
    },
    async onChange() {
      const len = this.allCourses.length;
      const isChecked = this.getState === 'checked';
      const addItems = [];
      const removeItems = [];
      for (let i = 0; i < len; i++) {
        const item = this.allCourses[i];
        if (this.disableds.includes(item[this.isLive ? 'calendarId' : 'id'])) {
          continue;
        }
        if (isChecked) {
          removeItems.push(item);
        } else if (
          !this.actions.includes(item[this.isLive ? 'calendarId' : 'id'])
        ) {
          addItems.push(item);
        }
      }
      if (removeItems.length) {
        this.$emit('change', removeItems, 'remove');
      }
      if (addItems.length) {
        this.$emit('change', addItems, 'add');
      }
    },
    getSpaceData(e1, e2) {
      this.hubSidebar.space.data = this.space;
      this.$emit('edit', e1, e2);
    },
  },
};
</script>
