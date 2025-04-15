<template>
  <div class="relative z-10 mb-4 ml-4 flex">
    <div
      class="w-full rounded border"
      :class="{
        'group border-[#52C468]/[0.02] bg-[#0C110E] hover:bg-[#18231C]':
          published && !current && !viewing, // old published
        'border-[#86EFAC] bg-[#18231C]': published && current, // current published
        'border-[#9D50ED] bg-[#382050]': viewing, // viewing
        'border-[#FFA500] bg-[#241B0B]': verifying && !viewing && !published, // verifying
        'border-[#AE2B26] bg-[#1C0F0F]': rejected && !viewing && !published, // rejected
        'border-[#E0B92C] bg-[#211D0F]': current && !published && !viewing, // current
        'group border-transparent bg-[#0C0C0C] hover:bg-[#171717]':
          !published && !current && !viewing && !verifying, // old
      }"
      data-cy="babe57b53f992edb"
      @click="current ? onViewCourse() : onViewOpen()"
    >
      <div
        class="sticky top-0 isolate z-[100] border-t"
        :class="{
          'border-[#52C468]/[0.02] bg-[#0C110E] group-hover:bg-[#18231C]':
            published && !current && !viewing, // old published
          'border-[#86EFAC] bg-[#18231C]': published && current, // current published
          'border-[#9D50ED] bg-[#382050]': viewing, // viewing
          'border-[#FFA500] bg-[#241B0B]': verifying && !viewing && !published, // verifying
          'border-[#AE2B26] bg-[#1C0F0F]': rejected && !viewing && !published, // rejected
          'border-[#E0B92C] bg-[#211D0F]': current && !published && !viewing, // current
          'border-transparent bg-[#0C0C0C] group-hover:bg-[#171717]':
            !published && !current && !viewing && !verifying, // old
        }"
      >
        <div>
          <div
            class="absolute -left-[1rem] top-[0.875rem] size-2 rounded-full"
            :class="current ? 'bg-white' : 'border border-white bg-black'"
          />
          <div class="p-2">
            <OrganizationHubSidebarVersionItemHeader
              :item="item"
              :current="current"
              :restored="restored"
              :published="published"
              :viewing="viewing"
              :verifying="verifying"
              :rejected="rejected"
              @view-open="onViewOpen"
              @view-exit="onViewExit"
              @edit="onEdit"
              @restore="onRestore"
            />

            <OrganizationHubSidebarVersionItemProfile
              :profile="item.profile"
              :online="online"
              :created-at="item.createdAt"
              :description="item.description"
            />

            <div
              v-if="!current || !restored || item.activity.action === 'update'"
              class="mt-1 flex items-center justify-end gap-2 px-2 py-1"
            >
              <div
                class="cursor-pointer pl-2 text-xs text-white"
                @click.stop="toggleShowLogs"
              >
                {{ showLogs ? $t('post.show.less') : $t('post.show.logs') }}
              </div>
            </div>

            <div
              v-if="showLogs && hasLogData"
              class="mx-2 h-[1px] w-auto rounded-sm bg-[#4E4E4E]"
            />
          </div>
        </div>
      </div>

      <div>
        <OrganizationHubSidebarVersionItemLog
          :course-id="course.id"
          :parent-id="item.id"
          :current="current"
          :restored="restored"
          :viewing="viewing"
          :item="item"
          :show-logs="showLogs"
          @view-open-log="onViewOpenLog"
          @view-exit="onViewExit"
          @update:has-logs="hasLogData = $event"
        />
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
  },
  emits: ['view-exit', 'view-open', 'edit', 'restore'],
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSidebar };
  },
  data() {
    return {
      showLogs: false,
      hasLogData: false,
    };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
    version() {
      return this.hubCourse.version;
    },
    current() {
      return this.item.current;
    },
    restored() {
      return this.item.restored;
    },
    published() {
      return this.item.status === 'published';
    },
    verifying() {
      return (
        this.item.status === 'verifying' ||
        this.item.status === 'published-verifying'
      );
    },
    rejected() {
      return this.course.status === 'rejected';
    },
    viewing() {
      return this.version.preview?.id === this.item.id;
    },
    online() {
      return this.item.profile.online;
    },
    log() {
      return this.hubCourse.log;
    },
    viewLog() {
      return this.log.preview?.id === this.log.id && !this.current;
    },
  },
  watch: {
    showLogs: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          this.hasLogData = false;
          try {
            const logs = await this.hubCourse.searchLogs({
              courseId: this.course.id,
              parentId: this.item.id,
            });
            this.hasLogData = logs && logs.length > 0;
          } catch (error) {
            this.hasLogData = false;
          }
        } else {
          this.hasLogData = false;
        }
      },
    },
  },
  methods: {
    async onViewOpen() {
      this.version.preview = {
        ...this.item,
        title: this.restored ? `Restored ${this.item.title}` : this.item.title,
      };
      this.hubSidebar.version.state = false;
      const course = await this.hubCourse.getCourse({
        courseId: this.course.id,
      });
      this.hubSidebar.course.data = course;
    },
    async onViewOpenLog(log) {
      this.log.preview = log;
      this.hubSidebar.version.state = false;
      const course = await this.hubCourse.getCourse({
        courseId: this.course.id,
      });
      this.hubSidebar.course.data = course;
    },
    async onViewCourse() {
      this.hubSidebar.version.state = false;
    },
    onViewExit() {
      this.version.exit = true;
    },
    onEdit() {
      this.version.edit.state = true;
      this.version.edit.data = this.item;
    },
    onRestore() {
      this.version.restore.state = true;
      this.version.restore.data = this.item;
    },
    toggleShowLogs() {
      this.showLogs = !this.showLogs;
    },
  },
};
</script>
