<template>
  <OrganizationHubSidebarWrap v-loading="loading" :open="open">
    <OrganizationHubSidebarHeader
      type="course"
      data-cy="course"
      @close="onClose"
    />
    <div class="mb-4 flex items-center gap-3 px-4 text-sm">
      <i class="fa-solid fa-clock-rotate-left" />
      {{ $t('index.version.history') }}
    </div>
    <div
      class="relative flex h-0 flex-1 flex-col overflow-y-auto overscroll-contain pb-8 pl-5 pr-4"
    >
      <OrganizationHubSidebarVersionItem
        v-for="item in history.data"
        :key="item.id"
        :item="item"
      />
      <div
        v-if="rest > 0"
        class="cursor-pointer pl-2 text-sm"
        @click="onLoadMore"
      >
        {{ $t('index.version.show.older') }}
      </div>
    </div>
    <div
      v-if="history.data.length"
      class="absolute left-6 top-[6.75rem] z-0 w-[1px] bg-white"
      :style="{
        bottom: '0',
      }"
    />
    <client-only>
      <el-dialog
        v-model="version.edit.state"
        :show-close="false"
        append-to-body
        destroy-on-close
        width="24rem"
      >
        <OrganizationHubSidebarVersionEdit />
      </el-dialog>
    </client-only>
  </OrganizationHubSidebarWrap>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    const fluxesStore = useFluxesStore();
    return { hubCourse, hubSidebar, fluxesStore };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    version() {
      return this.hubCourse.version;
    },
    loading() {
      return this.version.loading;
    },
    history() {
      return this.version.history;
    },
    rest() {
      return this.history.cursor.totalItems - this.history.data.length;
    },
  },
  mounted() {
    this.init();
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  beforeUnmount() {
    // this.hubCourse.resetVersion();
  },
  methods: {
    async init() {
      await this.hubCourse.searchVersions({
        courseId: this.course.id,
      });
    },
    async onClose() {
      this.open = false;
      await sleep(500);
      this.hubSidebar.version.state = false;
    },
    async onLoadMore() {
      await this.hubCourse.searchVersions({
        courseId: this.course.id,
        next: this.version.history.cursor.next,
      });
    },
  },
};
</script>
