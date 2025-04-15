<template>
  <div class="group/item flex gap-2 rounded-5 p-1">
    <div class="flex h-6 w-6 items-center justify-center">
      <i
        v-if="!disableds.includes(course[isLive ? 'calendarId' : 'id'])"
        class="fa-solid fa-calendar text-xs"
        :style="{
          color: course.color,
        }"
      />
      <i
        v-else
        class="fa-solid fa-calendar-circle-exclamation text-xs text-[#707070]"
      />
    </div>
    <div class="flex w-0 flex-1 flex-col truncate">
      <div class="flex items-center justify-between">
        <div
          class="truncate text-base text-[#909090]"
          :class="{
            'group-hover/item:text-[#F1F1F1]': !disableds.includes(
              course[isLive ? 'calendarId' : 'id'],
            ),
            'line-through': disableds.includes(
              course[isLive ? 'calendarId' : 'id'],
            ),
            'cursor-pointer underline-offset-4 hover:underline': courseClick,
          }"
          @click="onEdit"
          v-html="name"
        />
        <span
          v-if="showLicenses && course.purchased"
          class="text-sm text-white/70"
        >
          <span>x{{ course.availableLicense }}</span>
          <!-- <span>
            x{{ course.availableLicense - orgLicensesAssigned.length }}
          </span> -->
        </span>
      </div>

      <BaseSpaceDates
        v-if="cycles.length > 2 && showDate && !isOneCycle"
        :cycles="cycles"
        :cycle-ids="cycleIds"
        @change-cycle="(e) => $emit('change-cycle', e, course)"
      />
      <div
        v-else-if="showDate"
        class="text-xs font-medium text-[#707070]"
        :class="
          !disableds.includes(course[isLive ? 'calendarId' : 'id'])
            ? ''
            : 'line-through'
        "
      >
        {{ formatDate(cucle?.dates?.startDate, 'MMM DD,YYYY') }} -
        {{ formatDate(cucle?.dates?.endDate, 'MMM DD,YYYY') }}
      </div>
      <template
        v-if="
          from === 'Attendant' && orgLicensesAssigned.length && course.purchased
        "
      >
        <div
          v-if="orgLicensesAssigned.length <= course.availableLicense"
          class="mt-2 flex max-w-max items-center rounded-5 bg-[#9fecb1] px-2 py-1 text-black"
        >
          <i class="fa-solid fa-check" />
          <span class="ml-2">
            {{ orgLicensesAssigned.length }} {{ $t('base.license.assigned') }}
          </span>
        </div>
        <div v-else class="mt-2 flex items-center">
          <div
            class="flex max-w-max items-center rounded-5 bg-[#3f0f0d] px-2 py-1 text-[#dd524b]"
          >
            <i class="fa-light fa-info-circle" />
            <span class="ml-2">{{ $t('base.license.notAssigned') }}</span>
          </div>
          <BaseButton
            size="small"
            class="ml-3"
            label="$t:base.license.buy"
            data-cy="efc83f24f9f0c56c"
            @click="buyMore"
          />
        </div>
      </template>
    </div>
    <div class="flex h-6 w-6 items-center justify-center">
      <BaseCheckboxStyle
        :disabled="disableds.includes(course[isLive ? 'calendarId' : 'id'])"
        :state="isChecked || active ? 'checked' : 'unchecked'"
        data-cy="cab299348a4cefb5"
        @click="onChange(course)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    course: Object,
    isChecked: Boolean,
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
      default: () => null,
    },
    courseClick: {
      type: Boolean,
      default: false,
    },
    searchValue: {
      type: String,
      default: '',
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
  computed: {
    active() {
      return this.actions.includes(
        this.course[this.isLive ? 'calendarId' : 'id'],
      );
    },
    cycles() {
      return this.course?.cycles || [];
    },
    cucle() {
      return this.course?.cycles[0];
    },
    name() {
      if (this.searchValue) {
        return highlightKeywords(this.course.title || '', [this.searchValue]);
      } else {
        return this.course.title;
      }
    },
  },
  watch: {
    disableds: {
      handler() {
        const coursesId = this.course[this.isLive ? 'calendarId' : 'id'];
        if (this.disableds.includes(coursesId) && this.active) {
          this.$emit('change', [this.course], 'remove');
        }
      },
      deep: true,
    },
  },
  methods: {
    async onChange(course) {
      if (this.disableds.includes(course[this.isLive ? 'calendarId' : 'id'])) {
        return;
      }
      if (this.active) {
        this.$emit('change', [course], 'remove');
      } else {
        this.$emit('change', [course], 'add');
      }
    },
    buyMore() {
      const coursesId = this.course[this.isLive ? 'calendarId' : 'id'];
      this.$router.push(`/courses/${coursesId}`);
    },
    async onEdit() {
      if (!this.courseClick) {
        return;
      }
      this.$emit('edit', [this.course], this.active ? '' : 'add');
      this.hubSidebar.course.state = false;
      this.hubSidebar.state = false;
      await this.$nextTick();
      this.hubSidebar.course.data = this.course;
      this.hubSidebar.course.state = true;
      this.hubSidebar.state = true;
    },
  },
};
</script>
