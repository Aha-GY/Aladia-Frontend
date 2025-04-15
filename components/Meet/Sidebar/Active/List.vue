<template>
  <div class="flex flex-col gap-2 bg-[#0D0D0D] px-2">
    <div
      v-if="!allHmsPolls.length"
      class="mb-2 flex flex-col items-center justify-center gap-2.5"
    >
      <img src="~/assets/meet/no-activities.svg" alt="" />
      <div class="text-xs text-[#707070]">No activities yet</div>
    </div>
    <div v-if="hmsPolls.length" class="flex flex-col gap-2 pb-2">
      <div class="flex items-center gap-2 py-2">
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-regular fa-signal-stream text-xs text-[#00C9A7]" />
        </div>
        <div class="text-base text-[#FAFAFA]">{{ $t('meet.active') }}</div>
      </div>
      <div
        v-for="(item, index) in hmsPolls"
        :key="item.id"
        class="flex cursor-pointer items-center gap-2 rounded-5 p-1.5 hover:bg-white/5"
        data-cy="411eea6c63390000"
        @click="view(item)"
      >
        <div class="w-0 flex-1 truncate capitalize">
          {{ item.type }} {{ index + 1 }}
        </div>
        <div
          class="flex h-6 items-center justify-center rounded-5 px-1 text-xs font-medium"
          :class="stateClass(item.state)"
        >
          {{ $t(stateName(item.state)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    allHmsPolls() {
      return this.hmsStore.hmsPolls.filter(
        (item) => item.visibility || this.hmsLocalPeer.id === item.createdBy,
      );
    },
    hmsPolls() {
      return this.hmsStore.hmsPolls.filter(
        (item) =>
          (item.visibility || this.hmsLocalPeer.id === item.createdBy) &&
          item.state === 'started',
      );
    },
  },
  methods: {
    view(item) {
      this.hmsStore.pollId = item.id;
      this.hmsStore.openPopup = item.type;
    },
    stateName(state) {
      if (state === 'started') {
        return 'meet.live';
      } else if (state === 'stopped') {
        return 'meet.ended';
      } else {
        return 'meet.draft';
      }
    },
    stateClass(state) {
      if (state === 'started') {
        return 'bg-[#022C22] text-[#86EFAC]';
      } else if (state === 'stopped') {
        return 'bg-[#262626] text-[#D4D4D4]';
      } else {
        return 'bg-[#7373734D] text-[#D4D4D4]';
      }
    },
  },
};
</script>
