<template>
  <div ref="scrollToElement" class="relative mb-5 flex items-end gap-3">
    <div class="flex size-4 items-center justify-center pb-2 text-white/50">
      <i class="fa-light fa-language" />
    </div>
    <el-popover :visible="focus" :width="390" placement="bottom">
      <template #reference>
        <div class="relative flex-1">
          <BaseInput
            v-model="language"
            required
            :title="$t('course.language')"
            :show-validate-error="showError"
            data-cy="edit-course-language"
            @click="focus = true"
            @blur="focus = false"
          />
          <div
            v-if="showError"
            class="absolute -bottom-4 left-0 text-xs text-[#ED3C28]"
          >
            Language is required
          </div>
        </div>
      </template>
      <div class="flex max-h-72 flex-col overflow-y-auto p-1">
        <div
          v-for="language in languages"
          :key="language.id"
          class="group/item flex cursor-pointer items-center rounded px-2 py-1 hover:bg-white/5"
          :data-cy="`edit-course-language-${language.name}`"
          @click="onLanguageClick(language)"
          v-html="language.highlight || language.name"
        />
        <div v-if="languages.length === 0" class="px-2 py-1 text-sm">
          No results found
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const globalStore = useGlobalStore();
    const { $eventBus: eventBus } = useNuxtApp();
    return { hubCourse, globalStore, eventBus };
  },
  data() {
    return {
      searching: false,
      showError: false,
      focus: false,
      language: '',
    };
  },
  computed: {
    course() {
      return this.hubCourse.detail;
    },
    languages() {
      const result = [...this.globalStore.languages].sort((prev, curr) =>
        prev.name.localeCompare(curr.name),
      );

      if (this.searching) {
        return result
          .filter((item) =>
            item.name.toLowerCase().includes(this.language.toLowerCase()),
          )
          .map((item) => ({
            ...item,
            highlight: highlightKeywords(item.name, [this.language]),
          }));
      }

      return result;
    },
  },
  watch: {
    'globalStore.languages': {
      immediate: true,
      handler(languages) {
        if (languages.length && this.course.languageId) {
          this.language = languages.find(
            (language) => language.id === this.course.languageId,
          )?.name;
        }
      },
    },
    'course.languageId'(languageId) {
      if (languageId) {
        this.showError = false;
      }
    },
    language(newVal) {
      const active = this.globalStore.languages.every(
        (item) => item.id === this.course.languageId,
      );
      this.searching = active?.name !== newVal && newVal.length > 0;
    },
  },
  mounted() {
    this.eventBus.on('SAVE-INFO', this.validate);
    if (this.globalStore.languages.length === 0) {
      this.globalStore.getLanguages();
    }
  },
  beforeUnmount() {
    this.eventBus.off('SAVE-INFO', this.validate);
  },
  methods: {
    async onLanguageClick(language) {
      this.language = language.name;
      this.course.languageId = language.id;
      await this.$nextTick();
      this.searching = false;
    },
    validate() {
      if (!this.course.languageId) {
        this.showError = true;
        if (this.course.title) {
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
