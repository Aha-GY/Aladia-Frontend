<template>
  <OrganizationHubSidebarWrap :open="open">
    <OrganizationHubSidebarInviteHeader :type="type" @close="onClose" />
    <div class="px-4">
      <BaseInput
        v-model="username"
        search
        clear
        fixed
        class="mb-3 text-sm"
        :placeholder="$t('base.search.user')"
        @enter="onEnter"
      />
      <BaseMemberInviteSelected :selecteds="selecteds" @remove="onRemove" />
    </div>
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || end"
      :infinite-scroll-distance="20"
      class="hide-scrollbar h-0 flex-1 overflow-y-auto px-4"
    >
      <OrganizationHubSidebarInviteItem
        v-for="member in membersSort"
        :key="member.id"
        :member="member"
        :type="type"
        :query="username"
      />
      <BaseSkeleton v-if="loading" height="3.5rem" />
      <OrganizationHubSidebarInviteEmpty
        v-if="!loading && members.length === 0"
        :type="type"
        :username="username"
      />
    </div>
    <div class="flex items-center justify-between bg-white/5 px-4 py-2">
      <div
        class="flex cursor-pointer items-center gap-2 rounded bg-[#190e0d] px-2 py-1 text-sm font-light transition-all duration-300 active:scale-95"
        data-cy="8c488cdb627084d2"
        @click="onClose"
      >
        <i v-if="deleting" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-xmark text-xs" />
        {{ $t('base.upload.cancel') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm font-light text-white/50 transition-all duration-300 hover:bg-[#181818] hover:text-white active:scale-95"
        data-cy="eb5a67ccb1306372"
        @click="onSave"
      >
        <i v-if="saving" class="fa-light fa-loader animate-spin text-base" />
        <i v-else class="fa-light fa-paper-plane-top text-sm" />
        {{ $t('base.member.invite.label') }}
      </div>
    </div>
  </OrganizationHubSidebarWrap>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubChat = useHubChatStore();
    const hubCalendar = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    const globalStore = useGlobalStore();
    const fluxesStore = useFluxesStore();
    return {
      hubSpaces,
      hubCourse,
      hubSidebar,
      hubChat,
      hubCalendar,
      globalStore,
      fluxesStore,
    };
  },
  data() {
    return {
      username: '',
      loading: false,
      timer: null,
      end: false,
      next: null,
      deleting: false,
      saving: false,
      open: false,
      members: [],
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
    room() {
      return this.hubChat.roomInfo;
    },
    calendar() {
      return this.hubSidebar.calendar.data;
    },
    selecteds() {
      return this.hubSidebar.invite.selecteds;
    },
    type() {
      return this.hubSidebar.invite.type;
    },
    isEmail() {
      return checkMail(this.username.trim());
    },
    membersWithId() {
      return this.selecteds.filter((member) => !member.isInput);
    },
    membersWithEmail() {
      return this.selecteds.filter(
        (member) => member.isInput && member.isEmail,
      );
    },
    membersSort() {
      const members = uniqBy(this.members, 'id');
      return [
        ...members.filter((member) => member.checked),
        ...members.filter((member) => !member.checked),
      ];
    },
  },
  watch: {
    username() {
      this.loading = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
  },
  mounted() {
    this.selecteds.length = 0;
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
      if (this.type === 'space') {
        await this.loadSpace();
      }

      if (this.type === 'course') {
        await this.loadCourse();
      }

      if (this.type === 'room') {
        await this.loadRoom();
      }

      if (this.type === 'calendar') {
        await this.loadCalendar();
      }
    },
    async loadSpace() {
      this.loading = true;

      const { data, cursor } = await this.hubSpaces.searchProfile({
        text: this.username.trim() || undefined,
        scope: 'space',
        scopeId: this.space.id,
        next: this.next || undefined,
        limit: 20,
      });

      this.next = cursor.next;
      this.end = !cursor.next;
      this.members = [...this.members, ...data];
      this.loading = false;
    },
    async loadCourse() {
      this.loading = true;

      const { data, cursor } = await this.hubSpaces.searchPotentialMembers({
        username: this.username.trim() || undefined,
        spaceId: this.space.id,
        courseId: this.course.id,
        next: this.next || undefined,
        limit: 20,
      });

      this.next = cursor.next;
      this.end = !cursor.next;
      this.members = [...this.members, ...data];
      this.loading = false;
    },
    async loadRoom() {
      this.loading = true;

      const { data, cursor } = await this.hubSpaces.searchProfile({
        text: this.username.trim() || undefined,
        scope: 'chat-room',
        scopeId: this.room.id,
        next: this.next || undefined,
        limit: 100,
      });

      this.next = cursor.next;
      this.end = !cursor.next;
      this.members = [...this.members, ...data];
      if (this.username) {
        const query = this.username.trim().toLowerCase();
        this.members = [
          ...this.members
            .filter((m) => m.fullName.toLowerCase().includes(query))
            .sort((a, b) => {
              const aMatches = a.fullName.toLowerCase().indexOf(query);
              const bMatches = b.fullName.toLowerCase().indexOf(query);
              if (aMatches < bMatches) {
                return -1;
              }
              if (aMatches > bMatches) {
                return 1;
              }
              return 0;
            }),
          ...this.members.filter((m) => m.email.toLowerCase().includes(query)),
        ];
      }
      this.loading = false;
    },
    async loadCalendar() {
      this.loading = true;

      const { data, cursor } = await this.hubSpaces.searchProfile({
        text: this.username.trim() || undefined,
        scope: 'calendar',
        scopeId: this.calendar.id,
        next: this.next || undefined,
        limit: 20,
      });

      this.next = cursor.next;
      this.end = !cursor.next;
      this.members = [...this.members, ...data];
      this.loading = false;
    },
    async onClose() {
      this.open = false;
      await sleep(500);
      this.selecteds.length = 0;
      this.hubSidebar.invite.state = false;
      this.members = [];
    },
    async onSave() {
      if (this.type === 'space') {
        await this.onSaveSpace();
      }

      if (this.type === 'course') {
        await this.onSaveCourse();
      }

      if (this.type === 'room') {
        await this.onSaveRoom();
      }
      if (this.type === 'calendar') {
        await this.onSaveCalendar();
      }
    },
    async onSaveSpace() {
      try {
        if (
          this.membersWithId.length === 0 &&
          this.membersWithEmail.length === 0
        ) {
          return this.$toast.error(this.$t('base.member.invite.empty.content'));
        }

        this.saving = true;
        await this.hubSpaces.inviteMembers({
          spaceId: this.space.id,
          membersWithId: this.membersWithId.map((m) => ({
            profileId: m.id,
            role: m.role || 'space-member',
          })),
          membersWithEmail: this.membersWithEmail.map((m) => ({
            email: m.email,
            role: m.role || 'space-member',
          })),
        });
        this.saving = false;
        this.onClose();
      } catch (error) {
        this.saving = false;
        throw error;
      }
    },
    async onSaveCourse() {
      try {
        if (
          this.membersWithId.length === 0 &&
          this.membersWithEmail.length === 0
        ) {
          return this.$toast.error(this.$t('base.member.invite.empty.content'));
        }

        this.saving = true;
        await this.hubCourse.inviteMembers({
          courseId: this.course.id,
          membersWithId: this.membersWithId.map((m) => ({
            profileId: m.id,
            role: m.role || 'course-attendant',
          })),
          membersWithEmail: this.membersWithEmail.map((m) => ({
            email: m.email,
            role: m.role || 'course-attendant',
          })),
        });
        this.saving = false;
        this.onClose();
      } catch (error) {
        this.saving = false;
        throw error;
      }
    },
    async onSaveRoom() {
      try {
        if (this.membersWithId.length === 0) {
          return this.$toast.error(this.$t('base.member.invite.empty.content'));
        }

        this.saving = true;
        await this.hubChat.addRoomMembers({
          roomId: this.room.id,
          members: this.membersWithId.map((m) => ({
            id: m.id,
            role: m.role,
          })),
        });
        this.saving = false;
        this.onClose();
      } catch (error) {
        this.saving = false;
        throw error;
      }
    },
    async onSaveCalendar() {
      try {
        if (
          this.membersWithId.length === 0 &&
          this.membersWithEmail.length === 0
        ) {
          return this.$toast.error(this.$t('base.member.invite.empty.content'));
        }

        this.saving = true;
        await this.hubCalendar.inviteMembers({
          calendarId: this.calendar.id,
          ids: this.membersWithId.map((m) => ({
            profileId: m.id,
            role: m.role || 'calendar-participant',
          })),
          emails: this.membersWithEmail.map((m) => ({
            email: m.email,
            role: m.role || 'calendar-participant',
          })),
        });
        this.saving = false;
        this.onClose();
      } catch (error) {
        this.saving = false;
        throw error;
      }
    },
    onEnter() {
      const input = this.username.trim();
      if (!this.selecteds.find((s) => s.email === input)) {
        this.selecteds.push({
          id: input,
          isInput: true,
          isEmail: this.isEmail,
          email: input,
        });
        this.username = '';
      }
    },
    onRemove(member) {
      member.checked = false;
      this.selecteds.splice(
        this.selecteds.findIndex((m) => m.id === member.id),
        1,
      );
    },
  },
};
</script>
