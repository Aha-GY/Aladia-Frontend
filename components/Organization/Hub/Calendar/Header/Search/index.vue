<template>
  <div
    ref="inputRef"
    class="group/input relative flex h-full w-[15.5rem] items-center gap-2 rounded border border-transparent p-2 transition-all"
  >
    <BaseInput v-model="searchValue" search fixed />
  </div>
  <el-popover
    :virtual-ref="inputRef"
    :visible="open"
    placement="bottom-start"
    :width="248"
    :show-arrow="false"
    virtual-triggering
  >
    <OrganizationHubCalendarHeaderSearchPopover
      :search-value="searchValue"
      :on-change="onChange"
      :class="
        hubCalendarStore.sidebarRightShow ? '' : 'pointer-events-none opacity-0'
      "
      @mouseleave="hubCalendarStore.sidebarRightShow = false"
    />
  </el-popover>
</template>
<script>
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const open = ref(false);
    const inputRef = ref(null);

    return { hubCalendarStore, open, inputRef };
  },
  data() {
    return {
      focus: false,
      searchValue: '',
    };
  },
  watch: {
    searchValue() {
      this.$nextTick(() => {
        if (this.searchValue) {
          this.open = true;
          this.hubCalendarStore.sidebarRightShow = true;
          this.hubCalendarStore.sidebarRightOpen = true;
        } else {
          this.open = false;
          this.hubCalendarStore.sidebarRightShow = false;
          this.hubCalendarStore.sidebarRightOpen = false;
          this.hubCalendarStore.searchObj = {};
        }
      });
    },
  },
  beforeMount() {
    this.hubCalendarStore.sidebarRightOpen = false;
    this.hubCalendarStore.sidebarRightShow = false;
  },
  methods: {
    onChange(item) {
      this.searchValue = item.name;
      this.hubCalendarStore.searchObj = item;
    },
  },
};
</script>
