<template>
  <div class="flex gap-4">
    <div class="flex w-5 justify-center">
      <i class="fa-light fa-align-left text-base text-white/20" />
    </div>
    <div class="relative flex-1">
      <LazyBaseEditor
        v-model="target.description"
        name="description-editor"
        type="textarea"
        :options="{
          placeholder: $t('calendar.description'),
        }"
        area-height="12rem"
        limit-character
        :characters-limit="500"
        :auto-focus="false"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    return { hubEvent };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    lecture() {
      return this.hubEvent.lecture;
    },
    target() {
      const isCalendar = this.$route.name.endsWith('hub-name-calendar');
      return isCalendar ? this.event : this.lecture;
    },
  },
};
</script>
