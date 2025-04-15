<template>
  <div class="relative flex flex-col gap-1">
    <OrganizationHubCalendarSidebarTitle
      :title="$t('index.sidebar.item.users')"
      :is-filter="true"
      :open="open"
      @on-open="onOpen"
      @on-change="onSearch"
    >
      <i class="fa-regular fa-user-group text-[#707070]" />
      <template #after>
        <el-popover
          v-model:visible="filterShow"
          trigger="click"
          :width="334"
          :show-arrow="false"
          placement="top-end"
          :offset="16"
          popper-class="translate-x-4"
          :persistent="false"
        >
          <template #reference>
            <div
              class="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-5 text-[#f1f1f1] transition-all hover:bg-white/5 active:scale-95"
              :class="filterShow ? 'bg-white/5' : ''"
            >
              <i class="fa-light fa-user-plus text-xs" />
            </div>
          </template>
          <div class="h-96 p-2">
            <BaseMemberInvite
              :actives="members"
              :is-enter="false"
              from="personal"
              not-save-when-remove-user
              @close="filterShow = false"
              @save="onSave"
            />
          </div>
        </el-popover>
      </template>
    </OrganizationHubCalendarSidebarTitle>
    <OrganizationHubCalendarSidebarUsersMembers
      v-if="open"
      :search-value="searchValue"
    />
  </div>
</template>
<script>
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    return { hubCalendarStore };
  },
  data() {
    return {
      searchValue: '',
      open: true,
      filterShow: false,
    };
  },
  computed: {
    members() {
      return this.hubCalendarStore.members;
    },
  },
  methods: {
    onSearch(value) {
      this.searchValue = value;
    },
    onOpen(open) {
      this.open = open;
    },
    async onSave(selecteds) {
      this.hubCalendarStore.members = selecteds.filter((r) => !r.isInput);
      await this.hubCalendarStore.commonEvents();
      this.filterShow = false;
    },
  },
};
</script>
