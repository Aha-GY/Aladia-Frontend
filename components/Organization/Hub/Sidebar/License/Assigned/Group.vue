<template>
  <div
    class="flex cursor-pointer items-center gap-4 rounded p-1.5 hover:bg-white/10"
    @click="onClick"
  >
    <div class="flex size-12 items-center justify-center rounded bg-white/10">
      <i class="fa-solid fa-people-group" />
    </div>
    <div>
      <div class="mb-0.5 w-40 truncate text-sm text-white">
        Typography Mastery
      </div>
      <div class="flex items-center text-xs text-white/50">5 Member</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      type: Object,
    },
  },
  setup() {
    const hubSidebar = useHubSidebarStore();
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces, hubSidebar };
  },
  methods: {
    onClick() {
      this.hubSidebar.license.groups = true;
      this.hubSidebar.license.group = this.group;
    },
  },
};
</script>
