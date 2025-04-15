<template>
  <div class="flex flex-col gap-1.5">
    <div
      v-if="!action && list.length"
      class="hide-scrollbar flex max-h-32 flex-col gap-1.5 overflow-y-auto"
    >
      <div
        v-for="item in list"
        :key="item.id"
        class="flex h-8 shrink-0 cursor-pointer items-center gap-3 truncate rounded-md px-3 text-sm transition-all hover:bg-white/5"
        data-cy="f89eee13999b56bb"
        @click="action = item.name"
      >
        {{ item.name }}
      </div>
    </div>
    <div v-if="!action && list.length" class="h-[1px] bg-white/15" />
    <div
      v-if="!action"
      class="mb-1 border-b border-white/15 py-3 text-xs text-[#D9D9D966]"
    >
      {{ $t('personal.language.popular') }}
    </div>
    <div v-if="!action" class="flex flex-col gap-1.5">
      <div
        v-for="language in languages"
        :key="language"
        class="flex h-8 cursor-pointer items-center gap-3 rounded-md px-3 text-sm transition-all hover:bg-white/5"
        data-cy="d8b181b66b823870"
        @click="action = language"
      >
        {{ language }}
      </div>
    </div>

    <div
      v-if="action"
      class="flex h-8 items-center justify-between rounded-md bg-white/5 px-3"
    >
      <div class="text-sm text-[#D9D9D9B2]">{{ action }}</div>
      <i
        class="fa-light fa-xmark cursor-pointer text-sm text-[#CFA200] transition-all active:scale-95"
        data-cy="0d7d2adb75f068f4"
        @click="action = ''"
      />
    </div>
    <div v-if="action" class="text-sm">
      {{ $t('personal.language.level.title') }}
    </div>
    <div v-if="action" class="flex flex-wrap gap-1.5">
      <div
        v-for="item in levels"
        :key="item"
        class="flex h-8 cursor-pointer items-center rounded-md px-2 text-sm text-[#D9D9D9B2] transition-all hover:bg-white/5"
        :class="level === item ? 'bg-white/5' : 'bg-black/60'"
        data-cy="f7321924a9d476a5"
        @click="onChange(item)"
      >
        {{ $t(levelsMap[item]) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      languages: ['English', 'Spanish', 'Chinese'],
      levels: ['Beginner', 'Intermediate', 'Advanced', 'Native'],
      levelsMap: {
        Beginner: 'personal.language.level.beginner',
        Intermediate: 'personal.language.level.intermediate',
        Advanced: 'personal.language.level.advanced',
        Native: 'personal.language.level.native',
      },
      level: '',
      action: '',
    };
  },
  mounted() {
    if (this.item.language) {
      this.action = this.item.language;
    }
    if (this.item.level) {
      this.level = this.item.level;
    }
  },
  methods: {
    onChange(level) {
      this.$emit('change', {
        language: this.action,
        level,
      });
      this.$emit('close');
    },
  },
};
</script>
