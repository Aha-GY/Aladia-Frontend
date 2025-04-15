<template>
  <div
    class="mb-6 flex h-12 items-center justify-between rounded bg-white/5 px-3 font-light"
  >
    <div class="flex items-center gap-4 text-xs leading-none">
      <el-select
        v-model="hubQaStore.domain"
        style="width: 12rem"
        :placeholder="$t('filter.select')"
      >
        <template #label="{ label }">
          <i class="fa-solid fa-comments-question-check mr-1" />
          {{ label }}
        </template>
        <el-option
          v-for="item in domains"
          :key="item.value"
          :label="$t(item.label)"
          :value="item.value"
        >
          <i class="fa-solid fa-comments-question-check mr-1" />
          {{ $t(item.label) }}
        </el-option>
      </el-select>
      <div
        v-for="item in filters"
        :key="item.value"
        class="flex cursor-pointer items-center justify-center gap-3 border-b px-4 py-4 text-center"
        :class="
          hubQaStore.filter === item.value
            ? 'border-white/50'
            : 'border-transparent hover:border-white/20'
        "
        data-cy="4c07e49c29082fa1"
        @click="hubQaStore.filter = item.value"
      >
        {{ $t(item.label) }}
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div
        class="flex cursor-pointer items-center gap-2 rounded border border-white/50 px-2 py-1 text-xs font-semibold text-white transition-all hover:border-transparent hover:bg-white/10 hover:text-white/80"
        data-cy="7ae07b73044a2d6d"
        @click="onCreate"
      >
        <i class="fa-regular fa-comment-dots" />
        {{ $t('course.question.ask') }}
      </div>
      <div class="flex items-center gap-2">
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="{
            'bg-white/10': hubQaStore.view === 'grid',
          }"
          data-cy="b747cecf1d48f6e7"
          @click="hubQaStore.view = 'grid'"
        >
          <i class="fa-solid fa-grid-2" />
        </div>
        <div
          class="flex size-7 cursor-pointer items-center justify-center rounded"
          :class="{
            'bg-white/10': hubQaStore.view === 'list',
          }"
          data-cy="d043412f9d811e5d"
          @click="hubQaStore.view = 'list'"
        >
          <i class="fa-solid fa-list" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const hubQaStore = useHubQaStore();
    const socialStore = useSocialStore();
    return { authStore, hubQaStore, socialStore };
  },
  computed: {
    filters() {
      const result = [
        {
          value: 'all',
          label: 'filter.question.all',
        },
        {
          value: 'my-question',
          label: 'filter.question.my',
        },
        {
          value: 'answered-by-me',
          label: 'filter.question.answered',
        },
      ];

      if (this.hubQaStore.domain === 'my-courses') {
        result.push({
          value: 'community-question',
          label: 'filter.question.community',
        });
      }

      return result;
    },
    domains() {
      if (this.authStore.isStudent) {
        return [
          {
            value: 'feed',
            label: 'filter.feed',
          },
          {
            value: 'bought-courses',
            label: 'filter.courses.bought',
          },
        ];
      } else {
        return [
          {
            value: 'my-courses',
            label: 'filter.courses.my',
          },
          {
            value: 'feed',
            label: 'filter.feed',
          },
          {
            value: 'bought-courses',
            label: 'filter.courses.bought',
          },
        ];
      }
    },
  },
  watch: {
    'hubQaStore.domain'() {
      this.hubQaStore.getPosts();
    },
    'hubQaStore.filter'() {
      this.hubQaStore.getPosts();
    },
  },
  mounted() {
    this.hubQaStore.domain = this.domains[0].value;
    this.hubQaStore.getPosts();
  },
  methods: {
    onCreate() {
      this.socialStore.creatorVisible = true;
    },
  },
};
</script>
