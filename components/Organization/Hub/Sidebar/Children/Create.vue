<template>
  <div v-loading="loading">
    <div
      class="cursor-pointer rounded p-1.5 hover:bg-white/5"
      data-cy="on-demand-button"
      @click="onCreateCourse('on-demand')"
    >
      <div class="mb-1 flex items-center gap-2 text-sm text-white">
        <i class="fa-light fa-play-circle" />
        {{ $t('base.courses.type.onDemand') }}
      </div>
      <div class="text-xs text-white/50">
        {{ $t('course.upload.video.description') }}
      </div>
    </div>
    <div
      class="cursor-pointer rounded p-1.5 hover:bg-white/5"
      data-cy="create-live-course-button"
      @click="onCreateCourse('live')"
    >
      <div
        class="mb-1 flex items-center justify-between gap-16 text-sm text-white"
      >
        <div class="flex items-center gap-2">
          <BaseLive />
          {{ $t('course.stream.live') }}
        </div>
        <el-popover
          :visible="open"
          :width="width"
          placement="bottom-end"
          :popper-options="{
            modifiers: modifiers,
          }"
          data-cy="open-live-course-el-popover-datepicker"
        >
          <template #reference>
            <div
              class="flex flex-1 items-center gap-2 rounded border px-2 py-1 text-xs"
              :class="warning ? 'border-red-600' : 'border-white/50'"
              data-cy="open-live-course-datepicker"
              @click.stop="open = !open"
            >
              <i v-if="warning" class="fa-solid fa-circle-info text-red-600" />
              <i v-else class="fa-solid fa-calendars" />
              <div
                v-if="hasDate"
                class="w-0 flex-1 truncate"
                data-cy="open-live-course-datepicker-date-range"
              >
                {{ formatDate(range.start, 'DD MMM YYYY') }} -
                {{ formatDate(range.end, 'DD MMM YYYY') }}
              </div>
              <div
                v-else
                class="flex-1"
                data-cy="open-live-course-datepicker-mobile"
              >
                {{
                  $device.isMobile
                    ? $t('course.select.duration')
                    : $t('course.select.startEnd')
                }}
              </div>
              <div
                class="flex size-5 items-center justify-center rounded"
                :class="open ? 'bg-white/20' : ''"
                data-cy="open-live-course-datepicker-icon"
              >
                <i
                  class="fa-solid fa-chevron-down"
                  data-cy="open-live-course-datepicker-icon-chevron-down"
                />
              </div>
            </div>
          </template>
          <div ref="coursePopup" class="daterange p-2">
            <BaseDatePicker
              v-model="range"
              mode="daterange"
              :disabled-dates="disabledDates"
              class="!w-full"
              data-cy="open-live-course-from-folder"
              @change="onChange"
            />
            <div
              class="flex w-full items-center justify-between border-t border-white/10 pt-2"
            >
              <BaseButton
                type="red-cancel"
                data-cy="d39e163cd1512d0d"
                size="small"
                @click.stop="open = false"
              >
                <div class="flex size-3 items-center justify-center">
                  <i class="fa-solid fa-arrow-turn-left text-sm" />
                </div>
                <div class="text-sm">
                  {{ $t('base.dialog.close') }}
                </div>
              </BaseButton>
              <BaseButton
                type="tertiary"
                data-cy="d39e163cd1512d0e"
                size="small"
                @click.stop="onCreateCourse('live')"
              >
                <i class="fa-light fa-save text-sm" />
                <span class="text-sm">Create</span>
              </BaseButton>
            </div>
          </div>
        </el-popover>
      </div>
      <div class="text-xs text-white/50">
        {{ $t('course.select.content') }}
      </div>
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    width: {
      type: Number,
      default: 420,
    },
    folder: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const open = ref(false);
    const coursePopup = ref(null);
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();

    onClickOutside(coursePopup, () => {
      open.value = false;
    });

    return { hubSpaces, open, hubSidebar, coursePopup };
  },
  data() {
    return {
      loading: false,
      warning: false,
      range: {
        start: '',
        end: '',
      },
    };
  },
  computed: {
    hasDate() {
      return this.range.start && this.range.end;
    },
    spaceId() {
      return this.hubSidebar.space.data.id;
    },
    modifiers() {
      return [
        {
          name: 'offset',
          options: {
            offset: [15, 10],
          },
        },
      ];
    },
    disabledDates() {
      return [{ start: null, end: dayjs().subtract(1, 'day') }];
    },
  },
  watch: {
    hasDate(val) {
      if (val) {
        this.warning = false;
      }
    },
  },
  methods: {
    async onCreateCourse(type) {
      if (type === 'live') {
        if (!this.range.start || !this.range.end) {
          this.warning = true;
          return;
        }
      }

      this.open = false;
      this.loading = true;
      const course = await this.hubSpaces.createCourse({
        type,
        spaceId: this.spaceId,
        folderId: this.folder.id,
        visibility: 'public',
        autoGenerated: true,
        dates:
          type === 'live'
            ? {
                startDate: this.range.start,
                endDate: this.range.end,
              }
            : undefined,
      });

      // 添加到列表
      this.hubSpaces.addVirtualCourse(course, this.folder.id);

      this.loading = false;
      this.hubSidebar.course.folder = this.folder;
      this.hubSidebar.course.data = cloneDeep(course);
      this.hubSidebar.course.state = true;
      this.hubSidebar.course.created = true;
      this.open = false;
      this.$emit('open');
    },
    onChange(range) {
      if (!range.start || !range.end) {
        return;
      }
      this.range.start = getZeroTimeZone(range.start);
      this.range.end = getZeroTimeZone(range.end);
    },
  },
};
</script>
