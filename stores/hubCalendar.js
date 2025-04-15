import dayJS from 'dayjs';

import {
  createCalendar,
  getCalendarList,
  deleteCalendar,
  updateCalendar,
  retriveCalendar,
  retrivePrivateCalendar,
  selectedCalendar,
  getSelectedCalendar,
  deleteSelectedCalendar,
  commonEvents,
  addMember,
  removeMember,
  updateMember,
  getMembers,
  searchMembers,
  inviteMembers,
  acceptInvite,
  declineInvite,
  getInviteLink,
  cancelInvite,
  leaveCalendar,
  checkMemberExists,
} from '~/api/v2/calendar';
import {
  createEvent,
  searchEvents,
  deleteEvent,
  updateEvent,
  retriveEvent,
  getEventMembers,
  acceptEventInvite,
  declineEventInvite,
} from '~/api/v2/event';
import { previewSpace } from '~/api/v2/space';

const dayjs = dayJS.tz;

export const useHubCalendarStore = defineStore('hubCalendar', {
  state: () => ({
    courseId: null,
    dateTypeIndex: 2,

    sidebarOpen: true,
    sidebarRightOpen: false,
    sidebarRightShow: false,

    delete: {
      state: false,
      data: {},
    },

    initDate: dayjs().toDate(),
    startDateTime: '',
    endDateTime: '',
    dateTimeRange: {
      startDateTime: '',
      endDateTime: '',
      calendarIds: [],
      num: 0,
    },
    filterDates: {
      startDate: '',
      endDate: '',
    },
    entryId: null,
    entryOld: null,

    createOpen: false,
    createDate: dayjs().toDate(),
    createStyle: {
      top: null,
      left: null,
      width: null,
      clientX: null,
      index: null,
    },

    shareOpen: false,
    frequencyOpen: false,

    searchObj: {},

    beforeEntryData: {},
    entryDataList: [],

    isDarg: false,
    dargItems: {
      title: '',
      attr: '',
      color: '',
      startTime: '',
      endTime: '',
      clientX: '',
      clientY: '',
      width: '',
      millisecond: '',
    },
    isMove: false,
    dargWeekEntry: {},

    notifyShow: false,
    notifyTitle: 'Event saved',
    isUndo: false,

    members: [],
    filterEvents: [],
    userActives: [],
    personalEvents: [],

    calendarList: [],
    // filteredSchedule: {},

    selectedCalendars: [],

    courseActives: [],

    courses: [],
    spaces: [],
    cycleIds: [],
  }),
  getters: {
    filterEntryDataList() {
      const calendarIds = this.selectedCalendars.map((r) => r.id);

      //  根据已选日历过滤
      const events = this.entryDataList.filter((r) =>
        calendarIds.includes(r.filterCalendarId),
      );

      // 根据选中课程过滤
      const courseEvents = this.entryDataList.filter((r) =>
        this.courseActives.find(
          (item) => item.calendarId === r.filterCalendarId,
        ),
      );

      // 创建中的课程过滤
      const newEvents = this.entryDataList.filter((r) => r.creating);

      if (this.filterDates.startDate && this.filterDates.endDate) {
        const list = uniqBy(
          [...events, ...courseEvents, ...newEvents, ...this.personalEvents],
          'uniqId',
        );
        return list.filter(
          (r) =>
            dayjs(r.startDate) >= dayjs(this.filterDates.startDate) &&
            dayjs(r.endDate) <= dayjs(this.filterDates.endDate),
        );
      } else {
        return uniqBy(
          [...events, ...courseEvents, ...newEvents, ...this.personalEvents],
          'uniqId',
        );
      }
    },
    dateRange() {
      return {
        startDateTime: this.startDateTime,
        endDateTime: this.endDateTime,
      };
    },
  },
  actions: {
    async create(item, isAll) {
      this.entryDataList = this.entryDataList.filter((r) => r.id !== 'create');
      const hubEvent = useHubEventStore();
      if (this.courseId && !item?.id) {
        return;
      }
      if (item && item.id) {
        if (
          this.entryOld &&
          this.entryOld.id === item.id &&
          isEqual(this.entryOld, hubEvent.getEvent(hubEvent.event))
        ) {
          this.createOpen = true;
          return;
        }
        // await this.getEventMembers({ calendarId: item.calendarId, eventId: item.id });
        this.retriveEvent({ calendarId: item.calendarId, id: item.id }).then(
          (data) => {
            data.color = item.color;
            hubEvent.setEvent(cloneDeep(data));
            this.entryOld = cloneDeep(hubEvent.getEvent(hubEvent.event));
            this.entryId = data.id;
            this.createOpen = true;
          },
        );
      } else {
        this.entryOld = null;
        this.entryId = 'create';
        // 设置时间
        const date = this.createDate || dayjs().toDate();

        let { startDate, endDate } = getCreateDateRange(date, isAll);

        if (isAll) {
          startDate = getZeroTimeZone(date);
          endDate = getZeroTimeZone(date);
        }

        hubEvent.setEvent({
          ...cloneDeep(hubEvent.EVENT),
          dates: { startDate, endDate },
        });
        const profileStore = useProfileStore();
        const Detail = {
          ...cloneDeep(hubEvent.event),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          id: 'create',
          creating: true,
          color: '#565656',
          ownerProfilePicture: profileStore.myProfileDetail?.picture,
        };
        this.entryDataList.push(Detail);
        this.createOpen = true;
      }
    },
    async createCalendar(params) {
      const data = await createCalendar(params);
      this.calendarList.push(data);
      this.selectedCalendars.push(data);
      return data;
    },
    async deleteCalendar(params) {
      const data = await deleteCalendar(params);
      this.calendarList = this.calendarList.filter((r) => r.id !== params.id);
      this.selectedCalendars = this.selectedCalendars.filter(
        (r) => r.id !== params.id,
      );
      this.entryDataList = this.entryDataList.filter(
        (r) => r.calendarId !== params.id,
      );
      return data;
    },
    async updateCalendar(params) {
      const data = await updateCalendar(params);
      this.calendarList = this.calendarList.map((r) => {
        if (r.id === params.id) {
          return data;
        }
        return r;
      });

      this.selectedCalendars = this.selectedCalendars.map((r) => {
        if (r.id === params.id) {
          return data;
        }
        return r;
      });

      this.updateSelectedCalendars();
      return data;
    },
    async retriveCalendar(params) {
      const data = await retriveCalendar(params);
      return data;
    },
    async getCalendarList(params) {
      const { data } = await getCalendarList({
        limit: 0,
        ...params,
      });
      const authStore = useAuthStore();
      const userId = authStore.context;
      this.calendarList = (data || []).sort((a, b) => {
        if (a.owner.id === userId && b.owner.id !== userId) {
          return -1;
        }
        if (a.owner.id !== userId && b.owner.id === userId) {
          return 1;
        }
        return 0;
      });
      return data;
    },
    async selectedCalendar(params, colors) {
      const data = await selectedCalendar(params);
      this.updateSelectedCalendars();
      if (colors.length) {
        const calendarIds = uniqBy(this.entryDataList, 'calendarId').map(
          (r) => r.calendarId,
        );
        params.calendarIds.forEach((r, index) => {
          const color = colors[index];
          const course =
            this.courses.find((item) => item.calendarId === r) || {};
          const cycleId = course?.cycles ? course?.cycles[0].id : undefined;
          if (!calendarIds.includes(r)) {
            this.searchEvents(
              { calendarId: r, cycleId: cycleId ? cycleId : undefined },
              color,
            ).then((r) => {
              this.entryDataList.push(...r);
            });
          }
        });
      }
      return data;
    },
    async deleteSelectedCalendar(params) {
      const data = await deleteSelectedCalendar(params);
      return data;
    },
    async getSelectedCalendar(params) {
      const { data } = await getSelectedCalendar({
        limit: 0,
        ...params,
      });
      this.selectedCalendars = data || [];
      // this.searchAllEvents();

      return data;
    },
    async previewSpace(params) {
      const { data } = await previewSpace(params);
      this.spaces = data;
      this.courses = [];
      this.spaces.forEach((space) => {
        this.courses.push(
          ...(space?.rootFolder?.courses || []).filter(
            (r) => r && r.calendarId,
          ),
        );
        (space?.rootFolder?.subFolders || []).map((folder) => {
          this.courses.push(
            ...(folder.courses || []).filter((r) => r && r.calendarId),
          );
        });
      });
      return data;
    },
    async handleSelectCalendar() {
      this.cycleIds = [];
      this.dateTimeRange.calendarIds = [];
      await Promise.all([
        this.getCalendarList(),
        this.previewSpace(),
        this.getSelectedCalendar(),
      ]);

      this.updateSelectedCalendars();
      this.searchAllEvents();
    },
    updateSelectedCalendars() {
      this.selectedCalendars = this.selectedCalendars.map((r) => {
        const course = this.courses.find((item) => item.calendarId === r.id);
        if (course && course?.cycles) {
          r.cycleId = course?.cycles[0].id;
        }
        return r;
      });
    },
    async handleChangeCycle(cycle, course) {
      if (!this.selectedCalendars.find((r) => r.id === course.calendarId)) {
        this.selectedCalendars.push({
          ...course,
          id: course.calendarId,
        });
        await this.selectedCalendar(
          {
            calendarIds: [course.calendarId],
          },
          [course.color],
        );
      }

      this.selectedCalendars = this.selectedCalendars.map((r) => {
        if (r.id === course.calendarId) {
          const cycleIds = course.cycles.map((r) => r.id) || [];
          this.cycleIds = this.cycleIds.filter((id) => !cycleIds.includes(id));
          r.cycleId = cycle.id;

          this.dateTimeRange.calendarIds =
            this.dateTimeRange.calendarIds.filter((id) => id !== r.id);
          this.searchEvents(
            {
              calendarId: r.id,
              cycleId: r.cycleId ? r.cycleId : undefined,
            },
            r.color,
          ).then((r) => {
            this.entryDataList.push(...r);
            this.initDate = dayjs(cycle?.dates?.startDate).toDate();
          });
        }
        return r;
      });
    },
    async createEvent(params, color) {
      const data = await createEvent(params);
      this.entryDataList = this.entryDataList.filter((r) => r.id !== 'create');
      // const calendarIds = this.selectedCalendars.map((r) => r.id);
      // const unSelectedIds = [
      //   params.calendarId,
      //   ...params.sharedCalendars,
      // ].filter((id) => !calendarIds.includes(id));
      // if (unSelectedIds.length) {
      //   await this.selectedCalendar({ calendarIds: unSelectedIds }, []);
      //   this.getSelectedCalendar().then(() => {
      //     this.updateSelectedCalendars();
      //     this.searchAllEvents();
      //   });
      // }
      this.unSelectedCalendar(params, data, color);
      // if (
      //   params.frequency?.type === 'does-not-repeat' &&
      //   !params.sharedCalendars.length
      // ) {
      //   this.entryDataList.push({
      //     ...data,
      //     startDate: new Date(data.dates.startDate),
      //     endDate: new Date(data.dates.endDate),
      //     color,
      //     uniqId: data.id + data.calendarId,
      //     filterCalendarId: data.calendarId,
      //     ownerProfilePicture: data?.hostMembers[0]?.picture,
      //     // membersIds: data.members.map((r) => r.profileId),
      //   });
      // } else {
      //   this.dateTimeRange.calendarIds = this.dateTimeRange.calendarIds.filter(
      //     (id) => id !== params.calendarId,
      //   );
      //   await this.searchAllEvents();
      // }
      this.commonEvents();
      return data;
    },
    async unSelectedCalendar(params, data, color) {
      const calendarIds = this.selectedCalendars.map((r) => r.id);
      const unSelectedIds = [
        params.calendarId,
        ...params.sharedCalendars,
      ].filter((id) => !calendarIds.includes(id) && id);
      if (unSelectedIds.length) {
        await this.selectedCalendar({ calendarIds: unSelectedIds }, []);
        this.getSelectedCalendar().then(() => {
          this.updateSelectedCalendars();
          this.searchAllEvents();
        });
      } else {
        if (
          params.frequency?.type === 'does-not-repeat' &&
          !params.sharedCalendars.length
        ) {
          this.entryDataList.push({
            ...data,
            startDate: new Date(data.dates.startDate),
            endDate: new Date(data.dates.endDate),
            color,
            uniqId: data.id + data.calendarId,
            filterCalendarId: data.calendarId,
            ownerProfilePicture:
              data?.hostMembers[0]?.picture ||
              data?.courseObserverMembers[0]?.picture,
            // membersIds: data.members.map((r) => r.profileId),
          });
        } else {
          this.dateTimeRange.calendarIds =
            this.dateTimeRange.calendarIds.filter(
              (id) =>
                ![params.calendarId, ...params.sharedCalendars].includes(id),
            );
          await this.searchAllEvents();
        }
      }
    },
    async retriveEvent(params) {
      const data = await retriveEvent(params);

      return data;
    },
    async updateEvent(params, isShared, noRepeat) {
      const data = await updateEvent({
        ...params,
      });
      // this.entryId = null;
      if (
        params.calendarsUpdateStrategy === 'this' &&
        params.updateEventTarget === 'this' &&
        ((isShared && !params.sharedCalendars.length) || !isShared) &&
        ((noRepeat && params.frequency !== 'does-not-repeat') || !noRepeat)
      ) {
        this.entryDataList = this.entryDataList.map((r) => {
          if (r.id === params.id) {
            r.name = data.name;
            r.dates = data.dates;
            r.startDate = new Date(r.dates.startDate);
            r.endDate = new Date(r.dates.endDate);
            r.roomStatus = data.roomStatus;
            r.ownerProfilePicture = data.hostMembers[0]?.picture;
            // r.membersIds = data.members.map((r) => r.profileId);
          }
          return r;
        });
      } else {
        this.dateTimeRange.calendarIds = this.dateTimeRange.calendarIds.filter(
          (id) => id !== params.calendarId,
        );
        this.entryDataList = this.entryDataList.filter(
          (r) =>
            ![...(params.sharedCalendars || []), params.calendarId].includes(
              r.calendarId,
            ),
        );
        await this.searchAllEvents();
      }
      this.commonEvents();
      return data;
    },
    async deleteEvent(params) {
      const data = await deleteEvent(params);
      if (params.deleteTarget === 'this') {
        this.entryDataList = this.entryDataList.filter(
          (r) => r.id !== params.id,
        );
      } else {
        // this.dateTimeRange.calendarIds = this.dateTimeRange.calendarIds.filter(
        //   (id) => id !== params.calendarId,
        // );
        this.entryDataList = this.entryDataList.filter(
          (r) => !(data.deletedEventIds || []).includes(r.id),
        );
        // this.entryDataList = [];
        // this.searchAllEvents();
      }
      return data;
    },
    async searchAllEvents() {
      const datas = [];
      const results = await Promise.allSettled([
        ...this.courseActives.map((r) =>
          this.searchEvents(
            {
              calendarId: r.calendarId,
              cycleId: r.cycleId ? r.cycleId : undefined,
            },
            r.color,
          ),
        ),
        ...this.selectedCalendars.map((r) =>
          this.searchEvents(
            { calendarId: r.id, cycleId: r.cycleId ? r.cycleId : undefined },
            r.color,
          ),
        ),
      ]);
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          datas.push(result.value);
        }
      });
      for (let i = 0; i < datas.length; i++) {
        this.entryDataList.unshift(...datas[i]);
      }
    },
    async searchEvents(params, color) {
      const { calendarIds, startDateTime, endDateTime, num } =
        this.dateTimeRange;
      if (params.cycleId) {
        if (this.cycleIds.includes(params.cycleId)) {
          if (calendarIds.includes(params.calendarId)) {
            return [];
          }
        } else {
          this.cycleIds.push(params.cycleId);
        }
      }
      if (!this.dateRange.startDateTime || !this.dateRange.endDateTime) {
        return [];
      }
      let startDate = this.dateRange.startDateTime;
      let endDate = this.dateRange.endDateTime;

      if (calendarIds.includes(params.calendarId)) {
        if (
          startDateTime <= this.dateRange.startDateTime &&
          endDateTime >= this.dateRange.endDateTime &&
          num === calendarIds.length &&
          !params.cycleId
        ) {
          return [];
        }
        if (
          startDateTime < this.dateRange.startDateTime &&
          endDateTime < this.dateRange.endDateTime
        ) {
          startDate = endDateTime;
        }
        if (
          startDateTime > this.dateRange.startDateTime &&
          endDateTime > this.dateRange.endDateTime
        ) {
          endDate = startDateTime;
        }
        if (num === calendarIds.length) {
          this.dateTimeRange.num = 0;
        }
        this.dateTimeRange.num++;
      } else {
        this.dateTimeRange.calendarIds.push(params.calendarId);
        if (startDateTime && endDateTime) {
          startDate = startDateTime;
          endDate = endDateTime;
          this.dateTimeRange.num = 0;
        }
        // this.dateTimeRange.num++;
      }
      if (!startDateTime || this.dateRange.startDateTime < startDateTime) {
        this.dateTimeRange.startDateTime = this.dateRange.startDateTime;
      }
      if (!endDateTime || this.dateRange.endDateTime > endDateTime) {
        this.dateTimeRange.endDateTime = this.dateRange.endDateTime;
      }

      const { data } = await searchEvents({
        startDate: params.cycleId ? undefined : startDate,
        endDate: params.cycleId ? undefined : endDate,
        limit: 0,
        ...params,
      });

      if (params.cycleId) {
        this.entryDataList = this.entryDataList.filter(
          (r) => r.calendarId !== params.calendarId,
        );
      }

      return data.map((r) => {
        r.filterCalendarId = params.calendarId;
        r.startDate = new Date(r.dates.startDate);
        r.endDate = new Date(r.dates.endDate);
        r.color = color || '#1F6A57';
        r.uniqId = r.id + r.calendarId;
        return r;
      });
    },
    async commonEvents(params) {
      const calendars = [
        ...this.selectedCalendars,
        ...this.courseActives.map((r) => ({
          id: r.calendarId,
          color: r.color,
        })),
      ];
      const profileIds = this.members.map((r) => r.id);
      if (!profileIds.length) {
        this.filterEvents = [];
        return [];
      }
      const { data } = await commonEvents({
        ...params,
        limit: 0,
        profileIds,
        calendarIds: calendars.map((r) => r.id),
      });

      this.filterEvents = data;
      return data;
    },
    async retrivePrivateCalendar(params, picture) {
      const calendarIds = this.selectedCalendars.map((r) => r.id);
      const { data } = await retrivePrivateCalendar({
        limit: 0,
        data: { calendarIds },
        ...params,
      });
      this.personalEvents.push(
        ...data.map((r, index) => ({
          startDate: new Date(r.dates.startDate),
          endDate: new Date(r.dates.endDate),
          memberId: params.profileId,
          isPersonal: true,
          color: '#4A4A4A',
          id: params.profileId + index,
          uniqId: `personal${params.profileId}${index}`,
          // membersIds: [params.profileId],
          ownerProfilePicture: picture,
          ...r,
        })),
      );
      return data;
    },
    async addMember(params) {
      const data = await addMember(params);
      return data;
    },
    async removeMember(params) {
      const data = await removeMember(params);
      return data;
    },
    async updateMember(params) {
      const data = await updateMember(params);
      return data;
    },
    async getMembers(params) {
      if (params.roles || params.text) {
        const data = await searchMembers(params);
        return data;
      } else {
        const data = await getMembers(params);
        return data;
      }
    },
    async searchMembers(params) {
      const data = await searchMembers(params);
      return data;
    },
    async inviteMembers(params) {
      const data = await inviteMembers(params);
      return data;
    },
    async acceptInvite(params) {
      const data = await acceptInvite(params);
      return data;
    },
    async declineInvite(params) {
      const data = await declineInvite(params);
      return data;
    },
    async cancelInvite(params) {
      const data = await cancelInvite(params);
      return data;
    },
    async getInviteLink(params) {
      const data = await getInviteLink(params);
      return data;
    },
    async getEventMembers(params) {
      const data = await getEventMembers(params);
      return data;
    },
    async acceptEventInvite(params) {
      const data = await acceptEventInvite(params);
      return data;
    },
    async declineEventInvite(params) {
      const data = await declineEventInvite(params);
      return data;
    },
    async leaveCalendar(params) {
      const data = await leaveCalendar(params);
      return data;
    },
    async checkMemberExists(params) {
      const data = await checkMemberExists(params);
      return data;
    },
  },
});
