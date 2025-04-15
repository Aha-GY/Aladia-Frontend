<template>
  <div class="flex items-center gap-2 text-13">
    <div
      v-if="published"
      class="flex h-6 items-center gap-1 rounded-full border border-dashed border-[#52C468] px-2 text-[#52C468]"
    >
      <i class="fa-light fa-check" />
      {{ $t('index.version.published') }}
    </div>
    <div
      v-else-if="verifying"
      class="flex h-6 items-center gap-1 rounded-full border border-dashed border-[#FFA500] px-2 text-[#FFA500]"
    >
      <i class="fa-light fa-clock" />
      Verifying
    </div>
    <div
      v-else-if="rejected"
      class="flex h-6 items-center gap-1 rounded-full border border-dashed border-[#d42b2b] px-2 text-[#d42b2b]"
    >
      <i class="fa-light fa-xmark" />
      Rejected
    </div>
    <div
      v-else-if="current"
      class="flex h-6 items-center gap-1 rounded-full border border-dashed border-[#E0B92C] px-2 text-[#E0B92C]"
    >
      <i class="fa-light fa-check" />
      {{ $t('index.version.current') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    published: Boolean,
    current: Boolean,
    verifying: Boolean,
    viewing: Boolean,
    rejected: Boolean,
  },
  setup(props) {
    console.log(props);
    const hubSidebar = useHubSidebarStore();
    return { hubSidebar };
  },
  computed: {
    course() {
      return this.hubSidebar.course.data;
    },
  },
};
</script>
