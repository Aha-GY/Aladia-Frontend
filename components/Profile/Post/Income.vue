<template>
  <ProfileBox>
    <div class="mb-3 text-base font-medium text-[#B0B0B0]">
      {{ $t('org.hub.task.manage.event') }}
    </div>
    <BaseDatePicker v-model="date" />
    <div
      v-if="events.length === 0"
      class="mx-auto mb-4 mt-10 flex h-[10.75rem] w-[10.75rem] items-center justify-center rounded-full bg-white/5"
    >
      <i class="fa-solid fa-calendar text-[7.25rem] text-[#707070]" />
    </div>
    <div
      v-if="events.length === 0"
      class="mx-auto w-[10.75rem] text-center text-xs text-[#505050]"
    >
      {{ $t('org.events.incoming.empty') }}
    </div>

    <div
      v-if="events.length"
      class="mb-3 mt-1.5 text-sm font-medium text-[#E4B53D]"
    >
      {{ $t('org.events.count', { count: 6 }) }}
    </div>

    <div
      v-if="events.length"
      class="max-h-[18.75rem] overflow-y-auto transition-all"
    >
      <div
        v-for="event in events"
        :key="event.id"
        class="flex h-[3.125rem] items-center justify-between gap-2 border-t border-[#707070]"
      >
        <div class="text-xs">{{ event.time }}</div>
        <div class="text-xs text-[#707070]">{{ event.title }}</div>
        <div class="h-6 w-10 rounded-sm bg-white/80" />
      </div>
    </div>
  </ProfileBox>
</template>

<script>
export default {
  data() {
    return {
      events: [
        {
          id: 1,
          time: '1:30pm',
          title: 'Wooden Material for Buildings',
        },
        {
          id: 2,
          time: '2:00pm',
          title: 'Background culture in America',
        },
        {
          id: 3,
          time: '3:30pm',
          title: 'How is born the Photography',
        },
        {
          id: 4,
          time: '4:30pm',
          title: 'Tech Lectures in Milan',
        },
        {
          id: 5,
          time: '5:30pm',
          title: 'Random Course Name',
        },
        {
          id: 6,
          time: '6:30pm',
          title: 'Bootstrap Library 5.0',
        },
      ],
      date: null,
    };
  },
};
</script>
