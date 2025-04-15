<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarHeader
      type="course"
      data-cy="assign-course"
      @close="onClose"
    />
    <div
      class="mb-4 flex cursor-pointer items-center gap-2 px-4"
      @click="onClose"
    >
      <i class="fa-solid fa-chevron-left" />
      {{ $t('course.license.assigned.users') }}
    </div>
    <div class="mb-4 px-4">
      <div class="rounded bg-white/10 p-2 pr-4 text-sm">
        <div class="mb-3 flex items-center justify-between">
          <div>
            {{ $t('course.license.available') }}
          </div>
          <div
            class="flex cursor-pointer items-center gap-5 text-xs"
            @click="onLicenseManage"
          >
            <div class="rounded bg-[#292311] p-1 text-xs text-[#E0B92C]">
              {{ licenses || 0 }}
              {{ $t('course.license.available') }}
            </div>
            <i class="fa-solid fa-arrow-right text-white" />
          </div>
        </div>
        <BaseInput
          v-model="username"
          fixed
          clear
          :placeholder="$t('post.users.search')"
          prefix-icon-class="fa-light fa-user-magnifying-glass"
        />
      </div>
    </div>
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || end"
      :infinite-scroll-distance="20"
      class="hide-scrollbar flex h-0 flex-1 flex-col overflow-y-auto px-4"
    >
      <OrganizationHubSidebarLicenseAssignItem
        v-for="member in members"
        :key="member.id"
        :member="member"
        :selected="selected"
        :query="username"
        @click="onChange(member)"
        @change="onChange(member)"
      />
      <BaseSkeleton v-show="loading" height="4rem" />
    </div>
    <div class="flex h-12 items-center justify-between bg-white/5 px-4">
      <div
        class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
        @click="onClose"
      >
        <i class="fa-light fa-reply" />
        <span class="text-sm">{{ $t('base.upload.cancel') }}</span>
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        @click="onInsert"
      >
        <i v-if="inserting" class="fa-solid fa-spinner animate-spin text-xs" />
        <i v-else class="fa-light fa-plus text-sm" />
        <span class="text-sm">
          {{ $t('course.insert') }}
        </span>
      </div>
    </div>
  </OrganizationHubSidebarWrap>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubSidebar = useHubSidebarStore();
    return { hubSpaces, hubSidebar };
  },
  data() {
    return {
      open: false,
      inserting: false,
      username: '',
      timer: null,
      loading: false,
      end: false,
      next: null,
      total: 0,
      members: [],
      selected: [],
      licenses: 0,
    };
  },
  computed: {
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    folder() {
      return this.hubSidebar.course.folder;
    },
    course() {
      const { data } = this.hubSidebar.course;
      return this.hubSpaces.find(data.id) || data;
    },
  },
  watch: {
    username() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
  },
  mounted() {
    this.licenses = this.course.availableLicenses || 0;
    this.init();
    setTimeout(() => {
      this.open = true;
    }, 100);
  },
  methods: {
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
        alreadyMember: true,
        username: this.username || undefined,
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
    async onClose() {
      this.open = false;
      await sleep(500);
      this.hubSidebar.license.assign = false;
    },
    async onInsert() {
      if (this.inserting) {
        return;
      }
      try {
        this.inserting = true;
        await this.hubSpaces.assignLicenseToMembers({
          spaceId: this.space.id,
          courseId: this.course.id,
          profileIds: this.selected.map((m) => m.id),
        });

        await this.hubSpaces.getCourses({
          spaceId: this.space.id,
          folderId: this.folder.id,
        });

        this.inserting = false;
        this.$toast.success(this.$t('base.license.success.assign'));
        this.hubSidebar.license.assign = false;
      } catch (error) {
        this.inserting = false;
        throw error;
      }
    },
    onChange(member) {
      if (member.assigned) {
        return;
      }

      const index = this.selected.findIndex((m) => m.id === member.id);

      if (index === -1) {
        if (this.licenses <= 0) {
          return;
        }

        this.selected.push(member);
        this.licenses -= 1;
      } else {
        this.selected.splice(index, 1);
        this.licenses += 1;
      }
    },
    onLicenseManage() {
      this.hubSidebar.license.manage = true;
    },
  },
};
</script>
