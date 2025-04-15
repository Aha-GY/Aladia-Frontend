<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarHeader
      type="course"
      data-cy="group-course"
      @close="onClose"
    />
    <div
      class="mb-4 flex cursor-pointer items-center gap-2 px-4"
      @click="onClose"
    >
      <i class="fa-solid fa-chevron-left" />
      {{ $t('org.tab.groups') }}
    </div>
    <div class="flex h-0 flex-1 flex-col overflow-hidden px-4">
      <div
        class="mb-4 flex cursor-pointer items-center justify-between rounded bg-white/10 p-1.5 pr-3"
      >
        <div class="flex items-center gap-4">
          <div
            class="flex size-12 items-center justify-center rounded bg-white/10"
          >
            <i class="fa-solid fa-people-group" />
          </div>
          <div>
            <div class="mb-0.5 w-40 truncate text-sm text-white">
              Typography Mastery
            </div>
            <div class="flex items-center text-xs text-white/50">
              {{ $t('category.member.label', { count: 5 }) }}
            </div>
          </div>
        </div>
        <i class="fa-solid fa-arrow-right text-white" />
      </div>
      <div class="mb-4 flex items-center gap-4 text-sm">
        <BaseInput
          v-model="username"
          fixed
          clear
          :placeholder="$t('base.member.invite.placeholder')"
          prefix-icon-class="fa-light fa-search"
        />
        <div class="flex size-5 cursor-pointer items-center justify-center">
          <i class="fa-light fa-user-plus" />
        </div>
      </div>
      <div class="hide-scrollbar h-0 flex-1 overflow-y-auto">
        <BaseSkeleton height="4rem" />
      </div>
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
        @click="onApply"
      >
        <i v-if="applying" class="fa-solid fa-spinner animate-spin text-xs" />
        <i v-else class="fa-light fa-plus text-sm" />
        <span class="text-sm">
          {{ $t('base.upload.apply') }}
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
      username: '',
      timer: null,
      loading: false,
      end: false,
      next: null,
      total: 0,
      members: [],
      applying: false,
    };
  },
  computed: {
    space() {
      const { data } = this.hubSidebar.space;
      return this.hubSpaces.find(data.id) || data;
    },
    course() {
      return this.hubSidebar.course.data;
    },
  },
  mounted() {
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
      // this.load();
    },
    async load() {
      this.loading = true;

      const {
        data,
        cursor: { next, totalItems },
      } = await this.hubSpaces.getMembers({
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
      this.hubSidebar.license.groups = false;
    },
    async onApply() {
      this.applying = true;
      await sleep(1000);
      this.applying = false;
    },
  },
};
</script>
