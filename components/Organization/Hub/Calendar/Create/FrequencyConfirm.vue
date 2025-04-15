<template>
  <div class="bg-[#060606] p-2">
    <div
      class="relative flex items-center justify-between bg-[#0c0c0c] px-4 py-2"
    >
      <div class="text-xl text-[#B0B0B0]">
        {{ $t('org.edit.replicate.label') }}
      </div>
      <BaseIconClose data-cy="6a32e95d5f05f53e" @click="onClose" />
    </div>
    <div class="p-4">
      <div class="mb-2 text-xs text-[#707070]">
        {{ $t('org.edit.replicate.label') }}
      </div>
      <div class="overflow-hidden rounded-md">
        <div
          v-for="item in dataList"
          :key="item.type"
          class="flex items-center gap-2 border-b border-[#565656] px-3 py-2.5 transition-all last:border-b-0"
          :class="
            updateEventTarget === item.type ? 'bg-white/5' : 'hover:bg-white/5'
          "
        >
          <BaseCheckboxStyle
            class="mx-3"
            :state="updateEventTarget === item.type ? 'checked' : 'unchecked'"
            @click="onChange(item.type)"
          />
          <div class="text-xs">{{ $t(item.name) }}</div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-end gap-5 px-4 py-2">
      <BaseButton
        label="$t:base.upload.cancel"
        type="secondary"
        @click="onClose"
      />
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        @click="onSave"
      >
        <i v-if="loading" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-save text-base" />
        {{ $t('base.upload.save') }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubEventStore = useHubEventStore();
    const hubCalendarStore = useHubCalendarStore();
    return { hubEventStore, hubCalendarStore };
  },
  data() {
    return {
      loading: false,
      dataList: [
        {
          type: 'this',
          name: 'org.hub.analytics.event.this',
        },
        {
          type: 'cascade',
          name: 'org.hub.analytics.event.following',
        },
        {
          type: 'all',
          name: 'org.hub.analytics.event.all',
        },
      ],
    };
  },
  computed: {
    event() {
      return this.hubEventStore.event;
    },
    updateEventTarget() {
      return this.event.updateEventTarget;
    },
  },
  methods: {
    async onSave() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      const data = this.hubEventStore.getEvent(this.event);

      try {
        await this.hubCalendarStore.updateEvent({
          ...data,
        });

        // this.hubCalendarStore.createOpen = false;
      } catch (error) {
        this.$toast.error(error.message);
      } finally {
        this.loading = false;
        this.onClose();
      }
    },
    onClose() {
      this.hubCalendarStore.frequencyOpen = false;
    },
    onChange(type) {
      this.event.updateEventTarget = type;
    },
  },
};
</script>
