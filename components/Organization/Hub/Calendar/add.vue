<template>
  <div
    id="calendar-add"
    class="absolute bottom-24 right-[14%] flex h-9 w-9 translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-[#E0B92C] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] transition-all hover:rotate-180 hover:scale-125 md:bottom-4"
    data-cy="b3ad24d2c48e2f87"
    @click.stop="onCreate"
  >
    <i class="fa-regular fa-plus text-xl text-[#060606]" />
  </div>
</template>
<script>
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  methods: {
    onCreate() {
      this.hubCalendarStore.createDate = new Date(
        this.hubCalendarStore.initDate,
      );
      this.hubCalendarStore.create();
    },
  },
};
</script>
