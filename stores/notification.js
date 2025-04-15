import {
  getList,
  search,
  read,
  readAll,
  deleteNotification,
  getSettings,
  updateSettings,
  acceptInvite,
  declineInvite,
  acceptCourseInvite,
  declineCourseInvite,
  getProfileViewers,
  acceptEventInvite,
  declineEventInvite,
  acceptCalendarInvite,
  declineCalendarInvite,
} from '~/api/v2/notification';
import {
  acceptOrganizationInvitations,
  declineOrganizationInvitations,
  acceptBranchInvitation,
  declineBranchInvitation,
} from '~/api/v2/org';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    alert: true,
    totalUnread: 0,
    language: null,
    lastSeenNotificationDate: null,
    list: [],
    theme: 'light',
    params: {
      next: null,
      limit: 30,
    },
    listLoading: false,
    notification: {},
    show: false,
    showVisitors: false,
    initialized: false,
  }),
  actions: {
    toggleAlert() {
      this.updateSettings({ alert: !this.alert });
      this.alert = !this.alert;
    },
    async getList(isNext = false) {
      this.listLoading = true;
      const {
        data,
        cursor: { next },
      } = await getList(this.params);
      if (isNext) {
        this.list = [...this.list, ...data];
      } else {
        this.list = data;
      }
      this.params.next = next;
      this.listLoading = false;
    },
    async search(params) {
      return await search(params);
    },
    async read(id) {
      await read(id);
      const item = this.list.find((item) => item.id === id);
      item.isRead = true;
      if (this.totalUnread > 0) {
        this.totalUnread -= 1;
      }
    },
    async readAll() {
      await readAll();
      this.list = this.list.map((item) => ({ ...item, isRead: true }));
      this.totalUnread = 0;
    },
    async delete(id, isRead) {
      await deleteNotification(id);
      this.list = this.list.filter((item) => item.id !== id);
      if (!isRead) {
        if (this.totalUnread > 0) {
          this.totalUnread -= 1;
        }
      }
    },
    removeByType(type) {
      this.list = this.list.filter((item) => item.type !== type);
    },
    async open(type, params) {
      const router = useRouter();
      const { id, userId } = params;
      switch (type) {
        case 'friendship-request':
          router.push(`/defined path/${userId}/${id}`);
          break;
        case 'like':
          break;
        case 'follow':
          break;
        case 'unfollow':
          break;
        case 'comment':
          break;
        case 'post-mention':
          break;
        case 'share':
          break;
        case 'course-create':
          break;
        case 'course-update':
          break;
        case 'new-assignment':
          break;
        case 'quiz-reminder':
          break;
        case 'comment-mention':
          break;
        default:
          break;
      }
    },

    async getSettings() {
      const {
        alert,
        lastSeenNotificationDate,
        language,
        calendars,
        payments,
        qas,
        socials,
        systems,
        reviews,
        spaces,
        courses,
        theme,
      } = await getSettings();
      this.notification = {
        socials,
        calendars,
        courses,
        spaces,
        payments,
        reviews,
        qas,
        systems,
      };
      this.lastSeenNotificationDate = lastSeenNotificationDate;
      this.alert = alert;
      this.language = language;
      this.theme = theme;
    },

    async updateSettings(data) {
      return await updateSettings(data);
    },

    async handleInvite(params) {
      if (params.spaceId) {
        return this.handleSpaceInvite(params);
      } else if (params.courseId) {
        return this.handleCourseInvite(params);
      } else if (params.eventId) {
        return this.handleEventInvite(params);
      } else if (params.calendarId) {
        return this.handleCalendarInvite(params);
      } else if (params.organizationId) {
        return this.handleOrganizationInvite(params);
      } else if (params.branchId) {
        return this.handleBranchInvite(params);
      }
    },
    async handleSpaceInvite({ type, ...params }) {
      if (type) {
        return await acceptInvite(params);
      } else {
        return await declineInvite(params);
      }
    },
    async handleCourseInvite({ type, ...params }) {
      if (type) {
        return await acceptCourseInvite(params);
      } else {
        return await declineCourseInvite(params);
      }
    },
    async handleEventInvite({ type, ...params }) {
      if (type) {
        const data = await acceptEventInvite(params);
        const calendarStore = useHubCalendarStore();
        calendarStore.searchAllEvents();
        return data;
      } else {
        return await declineEventInvite(params);
      }
    },
    async handleCalendarInvite({ type, ...params }) {
      if (type) {
        const data = await acceptCalendarInvite(params);
        const calendarStore = useHubCalendarStore();
        calendarStore.getCalendarList();
        return data;
      } else {
        return await declineCalendarInvite(params);
      }
    },
    async handleOrganizationInvite({ type, ...params }) {
      if (type) {
        return await acceptOrganizationInvitations(params);
      } else {
        return await declineOrganizationInvitations(params);
      }
    },
    async handleBranchInvite({ type, branchId }) {
      if (type) {
        return await acceptBranchInvitation({ organizationId: branchId });
      } else {
        return await declineBranchInvitation({ organizationId: branchId });
      }
    },
    async getProfileViewers(params) {
      return await getProfileViewers(params);
    },
    async resetSettings() {
      Object.keys(this.notification).forEach((key) => {
        Object.keys(this.notification[key]).forEach((subKey) => {
          if (
            this.notification[key][subKey] &&
            typeof this.notification[key][subKey] === 'object'
          ) {
            Object.keys(this.notification[key][subKey]).forEach((subSubKey) => {
              this.notification[key][subKey][subSubKey] = true;
            });
          } else {
            this.notification[key][subKey] = true;
          }
        });
      });
      return await updateSettings({ ...this.notification });
    },
  },
});
