<template>
  <div class="mb-2 flex-1 bg-white/5 py-3">
    <OrganizationHubSidebarMemberHeader
      :filter="filter"
      :roles="roles"
      :type="type"
      :total="total"
      :permissions="permissions"
      @init="init"
    />
    <div class="mb-4 px-5">
      <BaseInput
        v-model="username"
        search
        clear
        fixed
        class="text-sm"
        :placeholder="$t('base.search.user')"
      />
    </div>
    <div
      v-infinite-scroll="load"
      :infinite-scroll-disabled="loading || end"
      :infinite-scroll-distance="20"
      class="hide-scrollbar overflow-y-auto px-3"
      :class="
        type === 'course'
          ? 'max-h-[calc(100vh-16rem)]'
          : 'h-[calc(100vh-13rem)]'
      "
    >
      <OrganizationHubSidebarMemberItem
        v-for="member in members"
        :key="member.id"
        :member="member"
        :created-by="createdBy"
        :type="type"
        :permissions="permissions"
        :query="username"
        @remove="total--"
      />
      <BaseSkeleton v-show="loading" height="3.5rem" />
      <div
        v-if="members.length === 0 && !loading"
        class="py-4 text-center text-sm"
      >
        No results found
      </div>
    </div>
  </div>
</template>

<script>
import { SPACE_ROLES, COURSE_ROLES, CALENDAR_ROLES } from '~/constant/roles';

export default {
  props: {
    type: {
      type: String,
      default: 'space',
    },
  },
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    const hubCourse = useHubCoursesStore();
    const hubCalendar = useHubCalendarStore();
    const hubSidebar = useHubSidebarStore();
    return {
      authStore,
      hubSpaces,
      hubSidebar,
      hubCourse,
      hubCalendar,
    };
  },
  data() {
    return {
      username: '',
      createdBy: '',
      loading: false,
      timer: null,
      end: false,
      next: null,
      total: 0,
      filter: [],
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
    calendar() {
      return this.hubSidebar.calendar.data;
    },
    invite() {
      return this.hubSidebar.invite;
    },
    roles() {
      if (this.type === 'course') {
        return COURSE_ROLES;
      }

      if (this.type === 'space') {
        return [
          {
            label: 'calendar.role.owner',
            value: 'space-owner',
            icon: 'fa-regular fa-user-shield',
            permissions: ['view', 'delete', 'edit', 'add'],
          },
          ...SPACE_ROLES,
        ];
      }

      if (this.type === 'calendar') {
        return [
          {
            label: 'calendar.role.owner',
            value: 'calendar-owner',
            icon: 'fa-regular fa-user-shield',
            permissions: ['view', 'delete', 'edit', 'add'],
          },
          ...CALENDAR_ROLES,
        ];
      }

      return [];
    },
    localMember() {
      return this.members.find(
        (member) => member.id === this.authStore.user.id,
      );
    },
    permissions() {
      return (
        this.roles.find((role) => role.value === this.localMember?.role)
          ?.permissions || []
      );
    },
  },
  watch: {
    // 从 Invite 组件跳转过来时，重新加载数据
    'invite.state'(state) {
      if (!state) {
        this.init();
      }
    },
    // 课程变化时，重新加载数据
    'course.id'() {
      this.init();
    },
    // 空间变化时，重新加载数据
    'space.id'() {
      this.init();
    },
    // 日历变化时，重新加载数据
    'calendar.id'() {
      this.init();
    },
    username() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 500);
    },
  },
  mounted() {
    this.filter = this.roles.map((role) => role.value);
  },
  methods: {
    async init() {
      if (this.loading) {
        return;
      }
      this.end = false;
      this.next = null;
      this.members = [];
      this.load();
    },
    load() {
      if (this.type === 'space') {
        this.loadSpace();
      }
      if (this.type === 'course') {
        this.loadCourse();
      }
      if (this.type === 'calendar') {
        this.loadCalendar();
      }
    },
    async loadSpace() {
      this.loading = true;

      const {
        data,
        cursor: { next, totalItems },
      } = await this.hubSpaces.getMembers({
        username: this.username || undefined,
        roles:
          this.filter.length && this.filter.length !== this.roles.length
            ? this.filter.join(',')
            : undefined,
        spaceId: this.space.id,
        next: this.next,
        limit: 20,
      });

      this.next = next;
      this.end = !next;
      this.total = totalItems;
      this.members = [...this.members, ...data];
      this.createdBy = this.space.createdBy;
      this.loading = false;
    },
    async loadCourse() {
      this.loading = true;

      const {
        data,
        cursor: { next, totalItems },
      } = await this.hubCourse.getMembers({
        username: this.username || undefined,
        roles:
          this.filter.length && this.filter.length !== 3
            ? this.filter.join(',')
            : undefined,
        courseId: this.course.id,
        next: this.next,
        limit: 20,
      });

      this.next = next;
      this.end = !next;
      this.total = totalItems;
      this.members = [...this.members, ...data];
      this.createdBy = this.course.createdBy;
      this.loading = false;
    },
    async loadCalendar() {
      if (!this.calendar.id) {
        return;
      }
      this.loading = true;

      const {
        data,
        cursor: { next, totalItems },
      } = await this.hubCalendar.getMembers({
        roles: this.filter.length ? this.filter.join(',') : undefined,
        calendarId: this.calendar.id,
        next: this.next,
        limit: 20,
        text: this.username || undefined,
      });

      this.next = next;
      this.end = !next;
      this.total = totalItems;
      this.members = [...this.members, ...data];
      this.createdBy = this.calendar.createdBy;
      this.loading = false;
    },
  },
};
</script>
