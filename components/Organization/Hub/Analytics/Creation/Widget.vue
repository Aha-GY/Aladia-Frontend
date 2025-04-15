<template>
  <div
    class="relative flex h-44 flex-1 cursor-pointer flex-col items-center rounded p-4"
    :class="selected ? '' : 'bg-white/10 hover:bg-white/20'"
    data-cy="2c84bd9a5929e584"
    @click="onPreview"
  >
    <div
      class="flex size-12 items-center justify-center text-3xl"
      :class="selected ? 'text-[#ddb754]' : 'text-white/50'"
    >
      <i class="fa-light" :class="icon" />
    </div>
    <div class="mb-2 text-center font-semibold">{{ $t(name) }}</div>
    <div class="px-2 text-center text-sm font-light">
      {{ desc || $t('org.dashboard.usage') }}
    </div>
    <div
      v-if="selected"
      class="absolute bottom-2 right-2 text-xl text-[#ddb754]"
    >
      <i class="fa-sharp fa-solid fa-circle-check" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    desc: String,
    icon: String,
  },
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  computed: {
    selected() {
      return this.analyticsStore.widgetSelected.includes(this.type);
    },
    name() {
      return this.analyticsStore.widgets[this.type];
    },
  },
  methods: {
    onPreview() {
      if (this.selected) {
        this.analyticsStore.widgetSelected =
          this.analyticsStore.widgetSelected.filter(
            (item) => item !== this.type,
          );
      } else {
        this.analyticsStore.widgetPersonalized = false;
        this.analyticsStore.widgetPreview = this.type;
      }
    },
  },
};
</script>
