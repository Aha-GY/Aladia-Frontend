<template>
  <div class="relative flex h-full w-full flex-col gap-2">
    <BaseInput
      v-model="name"
      fixed
      search
      class="px-3 py-1"
      :class="isFooter ? '' : 'sticky top-14 z-10 bg-[#060606]'"
      :placeholder="$t('base.member.search')"
    >
      <template #suffix>
        <div
          class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          data-cy="9d84d0d4b7439723"
          @click="name = ''"
        >
          <i class="fa-light fa-close text-xs text-[#FAFAFA]" />
        </div>
        <div
          v-if="isAdd"
          class="flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
          data-cy="1c905f99be98ffeb"
          @click="$emit('add')"
        >
          <i class="fa-light fa-user-plus text-xs text-[#FAFAFA]" />
        </div>
      </template>
    </BaseInput>
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || !next"
      :infinite-scroll-distance="20"
      class="hide-scrollbar flex h-0 w-full flex-1 flex-col gap-1 overflow-y-auto"
    >
      <BaseMemberInvitePureItem
        v-for="member in filterMembers"
        :key="member.id"
        :member="member"
        :is-remove="isRemove"
        :search-value="name"
        @remove="onRemove"
      />
      <BaseSkeleton v-if="loading" :length="20" height="2.5rem" />
      <BaseNoData v-else-if="filterMembers.length === 0" />
    </div>
    <div
      v-if="isFooter"
      class="-mx-2 -mb-2 flex items-center justify-between bg-white/5 px-4 py-4 pt-2"
    >
      <BaseButton
        icon="fa-arrow-turn-left"
        label="$t:base.dialog.close"
        type="red-cancel"
        data-cy="b9832afe31c377e3"
        @click="$emit('close')"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    members: {
      type: Array,
      default: () => [],
    },
    isAdd: {
      type: Boolean,
      default: true,
    },
    isRemove: {
      type: Boolean,
      default: true,
    },
    isFooter: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const globalStore = useGlobalStore();
    const hubEvent = useHubEventStore();
    return { globalStore, hubSpaces, hubCourse, hubEvent };
  },
  data() {
    return {
      name: '',
      next: null,
      loading: false,
      memberList: [],
      timer: null,
      roles: [
        {
          label: 'Invited',
          value: 'invited',
          icon: 'fa-solid fa-envelope-dot text-[#E0B92C]',
        },
        {
          label: 'Accepted',
          value: 'accepted',
          icon: 'fa-solid fa-check text-[#296A35]',
        },
      ],
      filter: ['invited', 'accepted'],
    };
  },
  computed: {
    filterMembers() {
      return [...this.members, ...this.memberList].filter((member) => {
        const name = (member.fullName || member.email || '').toLowerCase();
        let isFilter = false;
        this.filter.forEach((filter) => {
          if (filter === 'invited' && member.invited) {
            isFilter = true;
          }
          if (
            filter === 'accepted' &&
            (member.invitationStatus === 'accepted' || !member.invitationStatus)
          ) {
            isFilter = true;
          }
        });
        return name.includes(this.name.toLowerCase()) && isFilter;
      });
    },
  },
  created() {
    if (this.type) {
      this.init();
    }
  },
  methods: {
    async init() {
      this.next = null;
      this.memberList = [];
      this.load();
    },
    async load() {
      try {
        this.loading = true;
        const api = {
          event: this.hubEvent.getMembers,
        }[this.type];

        const {
          data,
          cursor: { next },
        } = await api({
          limit: 20,
          next: this.next || undefined,
          ...this.params,
        });
        this.next = next;
        this.memberList = [...this.memberList, ...data].filter(
          (item) => !this.exclude.includes(item.id),
        );
      } finally {
        this.loading = false;
      }
    },
    onRemove(member) {
      this.$emit('remove', member);
      this.memberList = this.memberList.filter(
        (item) => (item.id || item.email) !== (member.id || member.email),
      );
    },
  },
};
</script>
