<template>
  <div ref="popup">
    <div
      ref="buttonRef"
      class="relative flex size-6 cursor-pointer items-center justify-center rounded text-lg text-white/50 hover:bg-white/10 hover:text-white"
      data-cy="38ada5263ef6934c"
      @click="open = !open"
    >
      <i class="fa-light fa-ellipsis" />
    </div>
    <BasePopup
      :open="open"
      :offset="0"
      :button-ref="buttonRef"
      placement="bottom-start"
      :width="160"
      @close="open = false"
    >
      <div ref="popup" class="text-13">
        <div
          class="mb-3 flex cursor-pointer items-center gap-2 text-white/50 hover:text-white"
        >
          <div class="flex h-4 w-4 items-center justify-center">
            <i class="fa-solid fa-gear" />
          </div>
          {{ $t('org.settings.label') }}
        </div>
        <div
          class="flex cursor-pointer items-center gap-2 text-[#b05752] hover:text-[#db645e]"
          data-cy="17772a2e83947cc7"
          @click="onRemove"
        >
          <div class="flex h-4 w-4 items-center justify-center">
            <i class="fa-sharp fa-solid fa-minus" />
          </div>
          {{ $t('org.hub.task.widget.remove') }}
        </div>
      </div>
    </BasePopup>
  </div>
</template>

<script>
export default {
  setup() {
    const open = ref(false);
    const popup = ref(null);
    const buttonRef = ref(null);

    onClickOutside(
      popup,
      () => {
        open.value = false;
      },
      {
        ignore: [buttonRef],
      },
    );

    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore, open, popup, buttonRef };
  },
  methods: {
    onRemove() {
      const type = this.$el.closest('[data-type]').dataset.type;
      this.analyticsStore.widgetActive =
        this.analyticsStore.widgetActive.filter((item) => item !== type);
      this.open = false;
    },
  },
};
</script>
