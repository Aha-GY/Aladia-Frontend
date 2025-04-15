<template>
  <div
    class="absolute right-0 top-0 flex h-full w-[15.5rem] flex-col gap-6 overflow-hidden rounded-md bg-[#0C0C0C] shadow-[-5px_2px_5px_rgba(0,0,0,0.3)]"
    :class="[
      hubCalendarStore.sidebarRightOpen
        ? 'translate-x-0'
        : 'translate-x-[15.875rem]',
      hubCalendarStore.sidebarRightShow ? 'opacity-40' : '',
    ]"
  >
    <div
      class="flex items-center border-b border-[#f1f1f1]/80 bg-white/10 px-5 py-3"
    >
      <span class="text-sm font-bold text-[#9E7B00]">
        {{
          $t('org.hub.analytics.filter.user', {
            filter: filterDateList.length,
          })
        }}
      </span>
    </div>
    <div
      class="hide-scrollbar flex max-h-[34.375rem] flex-col gap-6 overflow-y-auto pb-2"
    >
      <OrganizationHubCalendarHeaderSearchEventItem
        v-for="item in filterDateList"
        :key="item.id"
        :item="item"
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
      dataList: [
        {
          id: 1,
          title: 'Astronomia',
          date: '2022-8-12',
          startTime: '12:00',
          endTime: '13:30',
          color: '#1F6A57',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 2,
          title: 'Astronomia',
          date: '2022-9-1',
          startTime: '12:00',
          endTime: '13:30',
          color: '#0478ED',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 3,
          title: 'Astronomia',
          date: '2022-10-17',
          startTime: '12:00',
          endTime: '13:30',
          color: '#9747FF',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 4,
          title: 'Astronomia',
          date: '2023-11-5',
          startTime: '12:00',
          endTime: '13:30',
          color: '#9747FF',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 5,
          title: 'Astronomia',
          date: '2023-11-22',
          startTime: '12:00',
          endTime: '13:30',
          color: '#1F6A57',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 6,
          title: 'Astronomia',
          date: '2023-11-25',
          startTime: '12:00',
          endTime: '13:30',
          color: '#1F6A57',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
        {
          id: 7,
          title: 'Astronomia',
          date: '2023-11-30',
          startTime: '12:00',
          endTime: '13:30',
          color: '#E63030',
          src: 'https://storage.googleapis.com/testing_uploads/Harvey.jpeg',
        },
      ],
    };
  },
  computed: {
    filterDateList() {
      const item = this.hubCalendarStore.searchObj || {};
      return item.color
        ? this.dataList.filter((r) => r.color === item.color)
        : this.dataList;
    },
  },
};
</script>
