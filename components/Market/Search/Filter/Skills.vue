<template>
  <div class="mb-4 rounded bg-white/5 p-4">
    <div class="mb-4 text-center font-medium">Skills</div>
    <el-popover ref="skills" trigger="click" width="356" placement="bottom">
      <template #reference>
        <BaseInput
          v-model="name"
          fixed
          clear
          class="mb-4 text-sm"
          placeholder="Select skills"
          prefix-icon-class="fa-solid fa-rectangle-history-circle-plus"
        />
      </template>
      <div
        class="hide-scrollbar flex max-h-72 flex-col overflow-y-auto rounded text-sm"
      >
        <div
          v-for="item in skills"
          :key="item.id"
          class="flex cursor-pointer items-center justify-between rounded px-2 py-2 hover:bg-white/5"
          @click="onLanguageClick(item)"
        >
          <div class="flex items-center gap-1">
            <span v-html="item.highlight || item.name" />
            <span>({{ item.courses || 0 }})</span>
          </div>
          <BaseCheckboxStyle
            :state="isChecked(item.name) ? 'correctChecked' : 'unchecked'"
          />
        </div>
      </div>
    </el-popover>
    <div class="mb-2 flex flex-wrap items-center gap-2">
      <div
        v-for="item in preview"
        :key="item.id"
        class="inline-flex items-center justify-between gap-1 rounded-full bg-white/5 py-1.5 pl-2 pr-1 text-xs"
      >
        {{ item.name }}({{ item.courses || 0 }})
        <div
          class="flex size-4 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
          @click="onLanguageRemove(item)"
        >
          <i class="fa-light fa-xmark" />
        </div>
      </div>
    </div>
    <div v-if="selecteds.length > 8" class="mb-2 flex items-center text-xs">
      <div
        v-if="more"
        class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/5 px-2 py-1.5"
        @click="more = false"
      >
        <i class="fa-regular fa-rectangle-history" />
        {{ $t('personal.language.less') }}
        <i class="fa-regular fa-chevron-up" />
      </div>
      <div
        v-else
        class="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/5 px-2 py-1.5"
        @click="more = true"
      >
        <i class="fa-regular fa-rectangle-history" />
        {{ $t('personal.language.more') }}{{ rest }}
        <i class="fa-regular fa-chevron-down" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  data() {
    return {
      open: false,
      more: false,
      name: '',
    };
  },
  computed: {
    skills() {
      const result = [...this.searchStore.coursesSkills].sort((prev, curr) =>
        prev.name.localeCompare(curr.name),
      );

      if (this.name && result.every((item) => item.name !== this.name)) {
        return result
          .filter((item) =>
            item.name.toLowerCase().includes(this.name.toLowerCase()),
          )
          .map((item) => ({
            ...item,
            highlight: highlightKeywords(item.name, [this.name]),
          }));
      }

      return result;
    },
    selecteds() {
      return this.searchStore.coursesSkills.filter((item) =>
        this.query.skills.includes(item.name),
      );
    },
    preview() {
      if (this.selecteds.length <= 8) {
        return this.selecteds;
      }
      if (this.more) {
        return this.selecteds;
      } else {
        return this.selecteds.slice(0, 8);
      }
    },
    rest() {
      return this.selecteds.length - 8;
    },
  },
  mounted() {
    this.searchStore.searchCoursesSkills({
      subCategoryId: this.$route.query.subCategoryId || undefined,
    });
  },
  methods: {
    onLanguageClick(item) {
      if (this.query.skills.includes(item.name)) {
        const index = this.query.skills.indexOf(item.name);
        this.query.skills.splice(index, 1);
      } else {
        this.query.skills.push(item.name);
      }
    },
    onLanguageRemove(item) {
      const index = this.query.skills.indexOf(item.name);
      this.query.skills.splice(index, 1);
    },
    isChecked(name) {
      return this.query.skills.includes(name);
    },
  },
};
</script>
