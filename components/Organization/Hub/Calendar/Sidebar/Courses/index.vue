<template>
  <div class="flex flex-col gap-2">
    <OrganizationHubCalendarSidebarTitle
      :title="$t('index.sidebar.item.spaces')"
      :open="open"
      @on-open="onOpen"
      @on-change="onSearch"
    >
      <!-- <BaseSvgSpace class="text-[#505050]" /> -->
      <i class="fa-regular fa-solar-system text-[#707070]" />
    </OrganizationHubCalendarSidebarTitle>
    <div v-if="open" class="flex w-full flex-col gap-2">
      <!-- <OrganizationHubCalendarSidebarCoursesSpace
        v-for="space in spaceList"
        :key="space.id"
        :space="space"
      /> -->
      <BaseSpace
        v-for="space in spaceList"
        :key="space.id"
        :space="space"
        :is-live="true"
        :search-value="searchValue"
        :actions="actions"
        :cycle-ids="cycleIds"
        :course-click="true"
        :query="searchValue"
        @change="onChange"
        @change-cycle="onChangeCycle"
        @edit="onEdit"
      />
    </div>
  </div>
</template>

<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCalendarStore = useHubCalendarStore();
    const hubCourse = useHubCoursesStore();
    return { hubCalendarStore, hubSpaces, hubCourse };
  },
  data() {
    return {
      searchValue: '',
      open: true,
    };
  },
  computed: {
    spaces() {
      return this.hubCalendarStore.spaces || [];
    },
    spaceList() {
      return this.spaces.filter((space) => {
        const folders =
          space?.rootFolder?.subFolders.filter((r) => {
            const courses = r?.courses.filter(
              (r) =>
                r &&
                r.calendarId &&
                r.title.toLowerCase().includes(this.searchValue.toLowerCase()),
            );

            return (
              courses.length ||
              r.name.toLowerCase().includes(this.searchValue.toLowerCase())
            );
          }) || [];
        const courses = space?.rootFolder?.courses.filter(
          (r) =>
            r &&
            r.calendarId &&
            r.title.toLowerCase().includes(this.searchValue.toLowerCase()),
        );
        return (
          folders.length ||
          courses.length ||
          space.name.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      });
    },
    actions() {
      return this.hubCalendarStore.selectedCalendars.map((r) => r.id);
    },
    cycleIds() {
      return this.hubCalendarStore.selectedCalendars
        .filter((r) => r.cycleId)
        .map((r) => r.cycleId);
    },
  },
  methods: {
    onSearch(value) {
      this.searchValue = value;
    },
    onOpen(open) {
      this.open = open;
    },
    async onEdit(items, type) {
      if (type === 'add') {
        await this.onChange(items, 'add');
      }

      const cycleId = this.hubCalendarStore.selectedCalendars.find(
        (r) => r.id === items[0].calendarId,
      ).cycleId;
      const cycle = items[0].cycles.find((r) => r.id === cycleId);
      this.hubCalendarStore.initDate = dayjs(cycle?.dates?.startDate).toDate();
    },
    async onChange(items, type) {
      if (type === 'add') {
        this.hubCalendarStore.selectedCalendars.push(
          ...items.map((r) => ({
            ...r,
            id: r.calendarId,
          })),
        );
        return await this.hubCalendarStore.selectedCalendar(
          {
            calendarIds: items.map((r) => r.calendarId),
          },
          items.map((r) => r.color),
        );
      } else {
        const ids = items.map((r) => r.calendarId);
        this.hubCalendarStore.selectedCalendars =
          this.hubCalendarStore.selectedCalendars.filter(
            (r) => !ids.includes(r.id),
          );
        return await this.hubCalendarStore.deleteSelectedCalendar({
          calendarIds: ids,
        });
      }
    },
    async onChangeCycle(cycle, course) {
      if (
        !this.hubCalendarStore.selectedCalendars.find(
          (r) => r.id === course.calendarId,
        )
      ) {
        await this.onChange([course], 'add');
      }

      this.hubCourse.cycleId = cycle.id;
      this.hubCalendarStore.handleChangeCycle(cycle, course);
    },
  },
};
</script>
