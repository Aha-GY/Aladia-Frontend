<template>
  <div class="flex flex-col gap-2">
    <OrganizationHubCalendarSidebarTitle
      :title="$t('index.sidebar.item.organizations')"
      :open="open"
      @on-open="onOpen"
      @on-change="onSearch"
    >
      <i class="fa-regular fa-building-user text-[#707070]" />
    </OrganizationHubCalendarSidebarTitle>
    <div v-if="open" class="w-full flex-col gap-2 px-2">
      <OrganizationHubCalendarSidebarCalendarsItem
        v-for="item in dataList"
        :key="item.id"
        :item="item"
        :query="name"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  data() {
    return {
      open: true,
      name: '',
    };
  },
  computed: {
    dataList() {
      return this.hubCalendarStore.calendarList.filter(
        (r) =>
          r.owner.type === 'organization' &&
          r.name.toLowerCase().includes(this.name.toLowerCase()),
      );
    },
  },
  methods: {
    onSearch(name) {
      this.name = name;
    },
    onOpen(open) {
      this.open = open;
    },
  },
};
</script>
