<template>
  <div class="rounded-5" :class="open ? 'bg-white/5' : 'hover:bg-white/5'">
    <div
      class="flex cursor-pointer items-center gap-2 p-1"
      data-cy="94668040c94d943a"
      @click="open = !open"
      @mouseenter.stop="hover = true"
      @mouseleave.stop="hover = false"
    >
      <div
        class="relative flex h-6 w-6 items-center justify-center rounded-5 hover:bg-white/5"
      >
        <BaseIconFolder v-if="!hover" :open="open" class="size-3" />
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
          data-cy="2b4da478a078dc83"
          @click.stop="onChange"
        />
      </div>
    </div>
    <div
      class="hide-scrollbar overflow-y-auto transition-all duration-300"
      :class="open && courses.length ? 'max-h-screen pt-1' : 'max-h-0 pt-0'"
    >
      <BaseSpaceCourse
        v-for="course in courses"
        :key="course.id"
        :course="course"
        :actions="actions"
        :cycle-ids="cycleIds"
        :disableds="disableds"
        :is-live="isLive"
        :course-click="courseClick"
        :search-value="searchValue"
        :is-one-cycle="isOneCycle"
        @change="(e1, e2) => $emit('change', e1, e2)"
        @change-cycle="(e1, e2) => $emit('change-cycle', e1, e2)"
        @edit="(e1, e2) => $emit('edit', e1, e2)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    folder: Object,
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
  data() {
    return {
      open: true,
      hover: false,
    };
  },
  computed: {
    courses() {
      return (this.folder?.courses || []).filter(
        (r) =>
          r &&
          (this.isLive ? r.calendarId : true) &&
          r.title.toLowerCase().includes(this.searchValue.toLowerCase()),
      );
    },
    getState() {
      let checkNum = 0;
      const len = this.courses.length;

      for (let i = 0; i < len; i++) {
        if (
          this.actions.includes(
            this.courses[i][this.isLive ? 'calendarId' : 'id'],
          )
        ) {
          checkNum += 1;
        }
      }
      return checkNum > 0
        ? checkNum === len
          ? 'checked'
          : 'halfChecked'
        : 'unchecked';
    },
    name() {
      if (this.searchValue) {
        return highlightKeywords(this.folder.name || '', [this.searchValue]);
      } else {
        return this.folder.name;
      }
    },
  },
  methods: {
    async onChange() {
      const len = this.courses.length;
      const addItems = [];
      const removeItems = [];
      for (let i = 0; i < len; i++) {
        const item = this.courses[i];
        if (this.disableds.includes(item[this.isLive ? 'calendarId' : 'id'])) {
          continue;
        }
        if (this.getState === 'checked') {
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
  },
};
</script>
