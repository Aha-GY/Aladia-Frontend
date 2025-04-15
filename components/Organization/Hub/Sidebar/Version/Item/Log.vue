<template>
  <div v-if="showLogs" class="w-full rounded" @click.stop>
    <div v-if="hasLogs" class="p-2">
      <div class="flex flex-col">
        <div class="relative pr-1">
          <div class="relative">
            <div
              v-for="(log, index) in logData"
              :key="index"
              class="relative mb-5 grid grid-cols-[auto,1fr] gap-x-2"
            >
              <BaseAvatarNext
                :picture="log.profile.picture"
                :has-story="log.profile.hasActiveStory"
                :user-id="log.profile.id"
                :story="log.profile.story"
                :size="'md'"
                :show-online="false"
                class="row-span-2"
              />
              <div
                class="absolute bottom-[1.75rem] left-[1.875rem] top-[3.75rem] z-0"
              >
                <OrganizationHubSidebarVersionItemActivityTimeline
                  :height="getTimelineHeight(log)"
                  :is-expanded="isLogExpanded(log.id)"
                  :fields-length="log.activity.fields.length"
                  :is-last-item="index === logData.length - 1"
                />
              </div>

              <div class="flow-root">
                <div class="float-left">
                  <div class="mb-2 flex items-center gap-2 text-xs">
                    <div
                      :class="[
                        (viewlog.preview === log.id && viewing) ||
                        (index >= activeLog && activeLog !== -1)
                          ? 'text-[#FFFFFF]'
                          : viewing
                            ? 'text-[#CC99FF]'
                            : 'text-[#E2E2E2]',
                      ]"
                    >
                      <template v-if="log.profile.name.length > 24">
                        <el-tooltip
                          :content="log.profile.name"
                          effect="light"
                          placement="top"
                          popper-class="w-auto max-w-64"
                          :offset="5"
                        >
                          <span
                            class="cursor-pointer text-[#f1f1f1] hover:underline"
                            @click="onProfileClick(log.profile.id)"
                          >
                            {{ truncateString(log.profile.name, 24) }}
                          </span>
                        </el-tooltip>
                      </template>
                      <template v-else>
                        <span
                          class="cursor-pointer text-[#f1f1f1] hover:underline"
                          @click="onProfileClick(log.profile.id)"
                        >
                          {{ log.profile.name }}
                        </span>
                      </template>
                    </div>
                    <div
                      :class="[
                        (viewlog.preview === log.id && viewing) ||
                        (index >= activeLog && activeLog !== -1)
                          ? 'text-white/50'
                          : viewing
                            ? 'text-[#CC99FF]'
                            : 'text-[#707070]',
                      ]"
                    >
                      {{ formatDate(log.createdAt, 'DD-MM-YYYY HH:mm') }}
                    </div>
                  </div>
                </div>
                <div class="float-right">
                  <el-popover
                    v-if="!isLatestLog(log)"
                    ref="more"
                    :width="200"
                    trigger="click"
                    placement="bottom-end"
                  >
                    <template #reference>
                      <div
                        class="flex size-5 cursor-pointer items-center justify-center rounded text-xs hover:bg-white/10"
                        data-cy="log-menu-icon"
                        @click.stop
                      >
                        <i class="fa-solid fa-ellipsis" />
                      </div>
                    </template>
                    <div class="flex flex-col gap-1 p-1 text-13 text-white">
                      <div
                        v-if="viewlog.preview === log.id && viewing"
                        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                        data-cy="exit-log-button"
                        @click="onViewExit"
                      >
                        <div class="flex size-4 items-center justify-center">
                          <i class="fa-solid fa-eye" />
                        </div>
                        {{ $t('index.version.exit.label') }}
                      </div>
                      <div
                        v-else
                        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                        data-cy="view-log-button"
                        v-bind="viewLogProps(log)"
                      >
                        <div class="flex size-4 items-center justify-center">
                          <i class="fa-solid fa-eye" />
                        </div>
                        {{ $t('index.version.view') }}
                      </div>

                      <div
                        v-if="currentLogId !== log.id"
                        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-white/10"
                        data-cy="restore-log-button"
                        @click="onRestore(log.id)"
                      >
                        <div class="flex size-4 items-center justify-center">
                          <i class="fa-solid fa-clock-rotate-left" />
                        </div>
                        {{ $t('index.version.restore.label') }}
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
              <div class="relative">
                <ul class="list-inside list-disc">
                  <!-- update action logs -->
                  <template v-if="log.activity.action === 'update'">
                    <li
                      v-for="(field, idx) in displayedFields(log)"
                      :key="field.field"
                      class="flex flex-col items-start pb-1 pt-1 text-xs"
                      :class="{
                        'border-b border-[#4E4E4E00]':
                          idx < displayedFields(log).length - 1,
                      }"
                    >
                      <div class="flex items-start gap-1">
                        <span
                          :class="[
                            (viewlog.preview === log.id && viewing) ||
                            (index >= activeLog && activeLog !== -1)
                              ? 'text-[#FFFFFF]'
                              : viewing
                                ? 'text-[#CC99FF]'
                                : 'text-[#707070]',
                          ]"
                          class="flex-shrink-0"
                        >
                          <i :class="[field.icon, 'fa-fw']" />
                        </span>
                        <span
                          :class="[
                            (viewlog.preview === log.id && viewing) ||
                            (index >= activeLog && activeLog !== -1)
                              ? 'text-[#FFFFFF]'
                              : viewing
                                ? 'text-[#CC99FF]'
                                : 'text-[#707070]',
                          ]"
                          class="break-all"
                        >
                          <template v-if="isEmpty(field.current)">
                            <span class="line-clamp-1">
                              Removed
                              {{ field.displayName }}
                              <span
                                :class="[
                                  (viewlog.preview === log.id && viewing) ||
                                  (index >= activeLog && activeLog !== -1)
                                    ? 'text-[#FFFFFF]'
                                    : viewing
                                      ? 'text-[#CC99FF]'
                                      : 'text-[#E2E2E2]',
                                ]"
                              >
                                <template v-if="field.previous.length > 24">
                                  <el-tooltip
                                    :content="field.previous"
                                    effect="light"
                                    placement="top-end"
                                    popper-class="w-auto max-w-64"
                                    :offset="5"
                                  >
                                    <span class="max-w-[32rem] font-normal">
                                      "{{ field.previous }}"
                                    </span>
                                  </el-tooltip>
                                </template>
                                <template v-else>
                                  <span class="break-all font-normal">
                                    "{{ field.previous }}"
                                  </span>
                                </template>
                              </span>
                            </span>
                          </template>

                          <template v-else>
                            <span class="line-clamp-1">
                              Updated
                              <span
                                v-if="log.activity.entity.type === 'course'"
                              >
                                {{ field.displayName }}
                              </span>
                              <span v-else>
                                {{ log.activity.entity.type }}
                                {{ field.displayName }}
                              </span>
                              {{ $t('course.select.to').toLowerCase() }}
                              <span
                                :class="[
                                  (viewlog.preview === log.id && viewing) ||
                                  (index >= activeLog && activeLog !== -1)
                                    ? 'text-[#FFFFFF]'
                                    : viewing
                                      ? 'text-[#CC99FF]'
                                      : 'text-[#E2E2E2]',
                                ]"
                              >
                                <template
                                  v-if="
                                    exceedsMaxLength(
                                      field.current,
                                      log.activity.entity.type,
                                      field.field,
                                    )
                                  "
                                >
                                  <el-tooltip
                                    :content="field.current"
                                    effect="light"
                                    placement="top-end"
                                    popper-class="w-auto max-w-64"
                                    :offset="5"
                                  >
                                    <span class="max-w-[32rem] font-normal">
                                      "{{ field.current }}"
                                    </span>
                                  </el-tooltip>
                                </template>
                                <template v-else>
                                  <span class="break-all font-normal">
                                    "{{ field.current }}"
                                  </span>
                                </template>
                              </span>
                            </span>
                          </template>
                        </span>
                      </div>
                    </li>
                    <div
                      v-if="log.activity.fields.length > 3"
                      class="mt-2 flex cursor-pointer items-center justify-start pr-2 text-xs font-medium text-white"
                      @click.stop="toggleExpandedLog(log.id)"
                    >
                      <i
                        v-if="isLogExpanded(log.id)"
                        class="fa-regular fa-circle-chevron-up pr-2"
                      />
                      <span v-if="isLogExpanded(log.id) === false">
                        <i class="fa-regular fa-circle-chevron-down pr-2" />
                      </span>
                      {{
                        isLogExpanded(log.id)
                          ? $t('post.show.less')
                          : $t('post.show.moreActivity') +
                            ` ${log.activity.fields.length - 3}` +
                            ' more activities'
                      }}
                    </div>
                  </template>

                  <!-- create/delete/ai-generate action logs -->
                  <template v-else>
                    <li
                      :class="[
                        (viewlog.preview === log.id && viewing) ||
                        (index >= activeLog && activeLog !== -1)
                          ? 'text-[#FFFFFF]'
                          : viewing
                            ? 'text-[#CC99FF]'
                            : 'text-[#707070]',
                      ]"
                      class="flex flex-col items-start pb-1 pt-1 text-xs"
                    >
                      <div class="flex items-start gap-1">
                        <span
                          v-if="getLogIcon(log, course).type === 'dot'"
                          class="flex-shrink-0"
                          :class="[getLogIcon(log, course).class, 'mt-0.5']"
                        />
                        <span v-else class="flex-shrink-0">
                          <i
                            :class="[getLogIcon(log, course).class, 'fa-fw']"
                          />
                        </span>
                        <span class="break-all">
                          <template
                            v-if="log.activity.action === 'ai-generate'"
                          >
                            {{ getActionText(log.activity.action) }}
                            <span
                              :class="[
                                (viewlog.preview === log.id && viewing) ||
                                (index >= activeLog && activeLog !== -1)
                                  ? 'text-[#FFFFFF]'
                                  : viewing
                                    ? 'text-[#CC99FF]'
                                    : 'text-[#E2E2E2]',
                              ]"
                              class="break-all font-normal"
                            >
                              "{{ log.activity.numberOf.chapter }} Chapters
                              {{ log.activity.numberOf.lecture }} Lectures"
                            </span>
                          </template>

                          <template v-else>
                            <div class="line-clamp-1">
                              <span>
                                {{ getActionText(log.activity.action) }}
                                {{ log.activity.entity.type }}
                              </span>

                              <span
                                :class="[
                                  (viewlog.preview === log.id && viewing) ||
                                  (index >= activeLog && activeLog !== -1)
                                    ? 'text-[#FFFFFF]'
                                    : viewing
                                      ? 'text-[#CC99FF]'
                                      : 'text-[#E2E2E2]',
                                ]"
                              >
                                <template
                                  v-if="log.activity.entity.name.length > 24"
                                >
                                  <el-tooltip
                                    :content="log.activity.entity.name"
                                    effect="light"
                                    placement="top-start"
                                    popper-class="w-auto max-w-64"
                                    :offset="5"
                                  >
                                    <span class="break-all font-normal">
                                      "{{ log.activity.entity.name }}"
                                    </span>
                                  </el-tooltip>
                                </template>
                                <template v-else>
                                  <span class="break-all font-normal">
                                    "{{ log.activity.entity.name }}"
                                  </span>
                                </template>
                              </span>

                              <span v-if="log.activity.parent">
                                {{ $t('index.in') }}
                                <span
                                  :class="[
                                    (viewlog.preview === log.id && viewing) ||
                                    (index >= activeLog && activeLog !== -1)
                                      ? 'text-[#FFFFFF]'
                                      : viewing
                                        ? 'text-[#CC99FF]'
                                        : 'text-[#E2E2E2]',
                                  ]"
                                >
                                  <template
                                    v-if="log.activity.parent.name.length > 18"
                                  >
                                    <el-tooltip
                                      :content="log.activity.parent.name"
                                      effect="light"
                                      placement="top-end"
                                      popper-class="w-auto max-w-64"
                                      :offset="5"
                                    >
                                      <span class="break-all font-normal">
                                        "{{ log.activity.parent.name }}"
                                      </span>
                                    </el-tooltip>
                                  </template>
                                  <template v-else>
                                    <span class="break-all font-normal">
                                      "{{ log.activity.parent.name }}"
                                    </span>
                                  </template>
                                </span>
                              </span>
                            </div>
                          </template>
                        </span>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    courseId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    current: {
      type: Boolean,
      default: false,
    },
    restored: {
      type: Boolean,
      default: false,
    },
    viewing: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: () => ({}),
    },
    showLogs: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCourse, hubSidebar };
  },
  data() {
    return {
      logData: [],
      expandedLogs: new Set(),
      currentLogId: null,
      viewingLogId: String,
      activeLog: null,
    };
  },
  computed: {
    logs() {
      return this.hubCourse.log.data;
    },
    hasLogs() {
      return this.logData.length > 0;
    },
    viewlog() {
      return this.hubCourse.log;
    },
    course() {
      return this.hubSidebar.course.data;
    },
  },
  watch: {
    showLogs: {
      immediate: true,
      async handler(newVal) {
        if (newVal) {
          try {
            const logs = await this.hubCourse.searchLogs({
              courseId: this.courseId,
              parentId: this.parentId,
            });

            // Transform the log data before setting it
            this.logData = logs.map((log) => {
              if (log.activity?.fields) {
                return {
                  ...log,
                  activity: {
                    ...log.activity,
                    icon: getIcon(
                      log.activity.action,
                      [],
                      log.activity.entity?.type,
                    ),
                    fields: log.activity.fields.map((field) => ({
                      ...field,
                      icon: getIcon(
                        log.activity.action,
                        field,
                        log.activity.entity?.type,
                      ),
                      current: transformDisplayValue(
                        field.field,
                        stripHtml(field.current),
                      ),
                      previous: transformDisplayValue(
                        field.field,
                        stripHtml(field.previous),
                      ),
                    })),
                  },
                };
              }
              return log;
            });
            this.getcourse();
            const tempLog = this.logData.find(
              (log) => log.id === this.viewlog.preview,
            );
            this.activeLog = this.logData.indexOf(tempLog);
          } catch (error) {
            this.logData = [];
          }
        }
      },
    },
    hasLogs: {
      immediate: true,
      handler(newVal) {
        this.$emit('update:has-logs', newVal);
      },
    },
  },
  methods: {
    onProfileClick(profileId) {
      this.$router.push(`/profile/${profileId}`);
    },
    onRestore(logId) {
      this.hubCourse.log.restore.data = {
        logId,
        courseId: this.courseId,
      };
      this.hubCourse.log.restore.state = true;
      this.onViewExit();
    },
    viewLogProps(log) {
      return {
        onClick: () => {
          this.viewingLogId = log.id;
          this.$emit('view-open-log', log);
        },
      };
    },
    onViewExit() {
      this.viewingLogId = null;
      this.activeLog = -1;
      this.$emit('view-exit');
    },
    async getcourse() {
      const course = await this.hubCourse.getCourse({
        courseId: this.courseId,
      });
      this.course.type = course.type;
    },
    isEmpty(value) {
      const strippedValue = stripHtml(value);
      return (
        !strippedValue || strippedValue.trim() === '' || strippedValue === '""'
      );
    },
    toggleExpandedLog(logId) {
      if (this.expandedLogs.has(logId)) {
        this.expandedLogs.delete(logId);
      } else {
        this.expandedLogs.add(logId);
      }
    },
    isLogExpanded(logId) {
      return this.expandedLogs.has(logId);
    },
    displayedFields(log) {
      if (!log.activity?.fields) {
        return [];
      }
      const transformedLog = transformActivityLog(log.activity);
      return this.isLogExpanded(log.id)
        ? transformedLog.fields
        : transformedLog.fields.slice(0, 3);
    },
    getActionText(action) {
      switch (action) {
        case 'create':
          return this.$t('index.action.created');
        case 'delete':
          return this.$t('index.action.deleted');
        case 'ai-generate':
          return this.$t('index.action.aigenerated');
        case 'assign':
          return this.$t('index.action.assigned');
        case 'unassign':
          return this.$t('index.action.unassigned');
        default:
          return '';
      }
    },
    isLatestLog(log) {
      return this.current && this.logData.indexOf(log) === 0;
    },
    getTimelineHeight(log) {
      const FIELD_HEIGHT = 16; // Height for each field item
      const FIELD_PADDING = 8; // Padding between fields
      const CONTAINER_PADDING = 20; // Additional padding for the container

      const logLength = log.activity.fields.length;
      // if action is create/delete/ai-generate/assign, treat as 1 field
      if (
        ['create', 'delete', 'ai-generate', 'assign'].includes(
          log.activity.action,
        )
      ) {
        return 25;
      }

      if (logLength === 1) {
        return 25;
      } else if (logLength === 2) {
        return 36;
      } else if (logLength === 3) {
        return 60;
      }

      // Calculate number of visible fields
      const visibleFields = this.isLogExpanded(log.id)
        ? logLength
        : Math.min(logLength, 3);

      // Calculate total height needed
      const totalHeight =
        visibleFields * FIELD_HEIGHT +
        (visibleFields - 1) * FIELD_PADDING +
        CONTAINER_PADDING;

      return totalHeight;
    },
    exceedsMaxLength(value, entityType, field) {
      if (!value) {
        return false;
      }

      const maxLengths = {
        course: 24,
        chapter: 18,
        lecture: 18,
        default: 24,
      };

      // if field is a cycle date field, use the max length for the cycle date field
      if (
        entityType === 'chapter' &&
        field.match(/^cycles\.\d+\.(startDate|endDate)$/)
      ) {
        return 8;
      }

      const maxLength = maxLengths[entityType] || maxLengths.default;
      return value.length >= maxLength;
    },
  },
};
</script>
