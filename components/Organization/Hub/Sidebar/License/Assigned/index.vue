<template>
  <div class="bg-white/5 px-5 pt-4">
    <div
      class="mb-4 flex cursor-pointer items-center justify-between rounded p-3 hover:bg-white/10"
      @click="onLicenseManage"
    >
      <div class="flex items-center gap-4">
        <div class="flex size-4 items-center justify-center">
          <i class="fa-solid fa-file-certificate text-white" />
        </div>
        <div class="text-sm">
          {{ course.assignedLicenses || 0 }} {{ $t('course.license.label') }}
        </div>
      </div>
      <div class="flex items-center gap-5 text-xs">
        <div class="rounded bg-[#292311] p-1 text-xs text-[#E0B92C]">
          {{ course.availableLicenses || 0 }}
          {{ $t('course.license.available') }}
        </div>
        <i class="fa-solid fa-arrow-right text-white" />
      </div>
    </div>
    <div class="mb-4 flex items-center gap-4 text-sm">
      <BaseInput
        v-model="username"
        fixed
        clear
        :placeholder="$t('base.member.invite.placeholder')"
        prefix-icon-class="fa-light fa-search"
      />
      <el-popover
        placement="bottom-end"
        :width="120"
        trigger="click"
        :popper-options="{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [20, 10],
              },
            },
          ],
        }"
      >
        <template #reference>
          <div class="flex size-5 cursor-pointer items-center justify-center">
            <i class="fa-light fa-filter-list" />
          </div>
        </template>
        <div class="p-1">
          <div
            class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-white/10"
            @click="onFilterClick('groups')"
          >
            <BaseCheckbox :active="filters.includes('groups')" />
            {{ $t('org.tab.groups') }}
          </div>
          <div
            class="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-white/10"
            @click="onFilterClick('users')"
          >
            <BaseCheckbox :active="filters.includes('users')" />
            {{ $t('org.tab.users') }}
          </div>
        </div>
      </el-popover>
      <div
        class="flex size-5 cursor-pointer items-center justify-center"
        @click="onAssignClick"
      >
        <i class="fa-light fa-user-plus" />
      </div>
    </div>
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || end"
      :infinite-scroll-distance="20"
      class="hide-scrollbar flex h-96 flex-col gap-2 overflow-y-auto"
    >
      <OrganizationHubSidebarLicenseAssignedGroup />
      <OrganizationHubSidebarLicenseAssignedMember
        v-for="member in members"
        :key="member.id"
        :member="member"
        :members="members"
        :username="username"
      />
      <BaseSkeleton v-show="loading" height="3.5rem" />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubSidebar = useHubSidebarStore();
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      username: '',
      timer: null,
      loading: false,
      end: false,
      next: null,
      total: 0,
      members: [],
      selected: [],
      filters: ['groups', 'users'],
    };
  },
  computed: {
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    course() {
      const { data } = this.hubSidebar.course;
      return this.hubSpaces.find(data.id) || data;
    },
  },
  watch: {
    'hubSidebar.license.assign'(state) {
      if (!state) {
        this.init();
      }
    },
    'hubSidebar.license.manage'(state) {
      if (!state) {
        this.init();
      }
    },
    username() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
  },
  mounted() {
    this.init();
    console.log(this.course);
  },
  methods: {
    onAssignClick() {
      this.hubSidebar.license.assign = true;
    },
    onFilterClick(type) {
      if (this.filters.includes(type)) {
        this.filters = this.filters.filter((f) => f !== type);
      } else {
        this.filters = [...this.filters, type];
      }
    },
    async init() {
      this.end = false;
      this.next = null;
      this.members = [];
      this.load();
    },
    async load() {
      this.loading = true;
      const {
        data,
        cursor: { next, totalItems },
      } = await this.hubSpaces.searchMembers({
        courseId: this.course.id,
        username: this.username || undefined,
        licensed: true,
        spaceId: this.space.id,
        next: this.next,
        limit: 20,
      });
      this.next = next;
      this.end = data.length < 20;
      this.total = totalItems;
      this.members = [...this.members, ...data];
      this.loading = false;
    },
    onLicenseManage() {
      this.hubSidebar.license.manage = true;
    },
  },
};
</script>
