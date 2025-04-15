import { createRoom } from '~/api/v2/100ms';
import {
  retriveCalendar,
  getCalendarList,
  availableCalendar,
} from '~/api/v2/calendar';
import {
  getEventAuthToken,
  getEventMembers,
  searchMembers,
  updateEvent,
  checkMemberExists,
  eventInvite,
} from '~/api/v2/event';

const EVENT = {
  name: '',
  description: undefined,
  attachments: [],
  dates: {
    startDate: null,
    endDate: null,
  },
  frequency: {
    type: 'does-not-repeat', // daily, weekly, monthly, custom, does-not-repeat
    periodicity: 'week', // day, week, month
    monthlySelection: 'specific-day-of-month', // specific-day-of-month, specific-weekday-of-month
    days: [], // 0 ~ 6
    counter: 1,
    endDate: null,
  },
  onPremise: {
    address: null,
  },
  live: {
    roomId: null,
  },
  members: [],
  addedMembers: [],
  removedMembers: [],
  // host: {},
  guests: [],
  coHosts: [],
  calendarId: null,
  calendars: [],
  calendarIds: [], // 初始日历ids
  sharedCalendars: [],
  resetFields: [],
  calendarsUpdateStrategy: 'this', // this, all

  updateEventTarget: 'this', // this, cascade, all

  // Lecture
  observers: [],
  teachers: [],
  attendants: [],
  endDateReference: {
    reference: null, // course, chapter, custom
    referenceId: null,
  },
  roomStatus: 'pending',
};

export const useHubEventStore = defineStore('hubEvent', {
  state: () => ({
    // 在日历中更新事件时需要默认event
    type: 'event', // lecture, event
    event: cloneDeep(EVENT),
    meetLoading: false,
    course: {},
    chapter: {},
    lecture: {},
    calendarList: [],
    availableList: [],
    availableLoading: false,
    spaces: [],
    eventId: null, // 用于可用性日历是否调用（记录最后次调用ID，如果发生变化，初始将会调用）
  }),
  getters: {
    EVENT() {
      return cloneDeep(EVENT);
    },
  },
  actions: {
    setEvent(event, isBase = true) {
      const BASE = cloneDeep(EVENT);
      if (!event.dates || !event.dates.startDate || !event.dates.endDate) {
        const { startDate, endDate } = getCreateDateRange(new Date());
        event.dates = {
          startDate,
          endDate,
        };
      }

      if (isBase) {
        if (event.frequency) {
          event.frequency = {
            ...BASE.frequency,
            ...event.frequency,
          };
        } else {
          event.frequency = BASE.frequency;
        }
      }

      event.isRepeat = event.frequency?.type !== 'does-not-repeat';

      if (!event.onPremise && isBase) {
        event.onPremise = BASE.onPremise;
      }

      if (!event.live && isBase) {
        event.live = BASE.live;
      }

      if (!event.attachments && isBase) {
        event.attachments = BASE.attachments;
      }

      if (!event.hostMembers) {
        const profileStore = useProfileStore();
        event.hostMembers = [
          {
            fullName: profileStore.myProfileDetail.fullName,
            picture: profileStore.myProfileDetail.picture,
            role: 'host',
            id: profileStore.myProfileDetail.id,
          },
        ];
      }

      // if (!event.members || !event.members.length) {
      //   const profileStore = useProfileStore();
      //   event.members = [
      //     {
      //       fullName: profileStore.myProfileDetail.fullName,
      //       picture: profileStore.myProfileDetail.picture,
      //       role: 'host',
      //       profileId: profileStore.myProfileDetail.id,
      //     },
      //     ...BASE.members,
      //   ];
      // }
      // if (!event.addedMembers) {
      event.addedMembers = BASE.addedMembers;
      // }
      // if (!event.removedMembers) {
      event.removedMembers = BASE.removedMembers;
      // }

      if (!event.updateEventTarget) {
        event.updateEventTarget = BASE.updateEventTarget;
      }

      if (!event.resetFields && isBase) {
        event.resetFields = BASE.resetFields;
      }

      if (!event.calendarsUpdateStrategy) {
        event.calendarsUpdateStrategy = BASE.calendarsUpdateStrategy;
      }

      if (!event.observers) {
        event.observers = event.courseObserverMembers || BASE.observers;
      }

      if (!event.teachers) {
        event.teachers = event.courseTeacherMembers || BASE.teachers;
      }

      if (!event.attendants) {
        event.attendants = event.courseAttendantMembers || BASE.attendants;
      }

      if (isBase) {
        if (event.endDateReference) {
          event.endDateReference = {
            ...BASE.endDateReference,
            ...event.endDateReference,
          };
        } else {
          event.endDateReference = BASE.endDateReference;
        }
      }

      if (!event.calendars || !event.calendars.length) {
        event.calendars = [
          { id: event.calendarId },
          ...(event.sharedCalendars || []).map((r) => ({ id: r })),
        ];
      }

      if (!event.calendarIds || !event.calendarIds.length) {
        event.calendarIds = [
          event.calendarId,
          ...(event.sharedCalendars || []),
        ];
      }

      if (event.sharedCalendars?.length && isBase) {
        event.isShared = true;
      }

      if (!event.roomStatus && isBase) {
        event.roomStatus = BASE.roomStatus;
      }

      // for (let index = 0; index < event.members.length; index++) {
      //   const r = event.members[index];

      //   // if (r.role === 'host') {
      //   //   BASE.host = { ...r, id: r.profileId };
      //   // }

      //   if (r.role === 'guest') {
      //     BASE.guests.push({ ...r, id: r.profileId });
      //   }

      //   if (r.role === 'co-host') {
      //     BASE.coHosts.push({ ...r, id: r.profileId });
      //   }

      //   if (r.role === 'course-observer') {
      //     BASE.observers.push({ ...r, id: r.profileId });
      //   }

      //   if (r.role === 'course-teacher') {
      //     BASE.teachers.push({ ...r, id: r.profileId });
      //   }

      //   if (r.role === 'course-attendant') {
      //     BASE.attendants.push({ ...r, id: r.profileId });
      //   }
      // }

      // event.guests = BASE.guests;
      // event.coHosts = BASE.coHosts;
      // event.observers = BASE.observers;
      // event.teachers = BASE.teachers;
      // event.attendants = BASE.attendants;
      this.event = event;
      return event;
    },
    getEvent(event) {
      const BASE = cloneDeep(event);

      const keys = [
        'dates',
        'frequency',
        'onPremise',
        'live',
        'sharedCalendars',
        'resetFields',
        'updateEventTarget',
        'roomStatus',
      ];

      if (this.type === 'lecture') {
        keys.push(
          // 'observers',
          // 'teachers',
          // 'attendants',
          'endDateReference',
        );
      }

      if (this.type === 'event') {
        keys.push(
          'id',
          'name',
          'description',
          // 'guests',
          // 'coHosts',
          'members',
          'removedMembers',
          'addedMembers',
          'calendarId',
          'attachments',
          'calendarsUpdateStrategy',
          // 'chapterId',
        );
      }

      // if (BASE.observers.length === 0) {
      //   BASE.observers = undefined;
      // }

      // if (BASE.teachers.length === 0) {
      //   BASE.teachers = undefined;
      // }

      // if (BASE.attendants.length === 0) {
      //   BASE.attendants = undefined;
      // }

      if (BASE?.onPremise?.address) {
        BASE.onPremise = {
          address: BASE.onPremise.address,
        };
      } else {
        BASE.onPremise = undefined;
      }

      if (BASE?.live?.roomId) {
        BASE.live = {
          roomId: BASE.live.roomId,
        };
      } else {
        BASE.live = undefined;
      }

      if (BASE.frequency) {
        if (BASE.frequency.type === 'does-not-repeat') {
          BASE.frequency = {
            type: 'does-not-repeat',
          };
        } else if (
          ['daily', 'weekly', 'monthly'].includes(BASE.frequency.type)
        ) {
          BASE.frequency = {
            type: BASE.frequency.type,
            endDate: BASE.frequency.endDate,
          };
        } else if (BASE.frequency.type === 'custom') {
          const Frequency = {
            type: 'custom',
            endDate: BASE.frequency.endDate,
            counter: parseInt(BASE.frequency.counter),
            periodicity: BASE.frequency.periodicity,
          };
          if (BASE.frequency.periodicity === 'week') {
            Frequency.days = BASE.frequency.days;
          }
          if (BASE.frequency.periodicity === 'month') {
            Frequency.monthlySelection = BASE.frequency.monthlySelection;
          }
          BASE.frequency = Frequency;
        }
      }

      if (BASE.attachments) {
        BASE.attachments = BASE.attachments.map((r) => {
          delete r.url;
          r.metadata = {
            mimetype: r.metadata.mimetype,
            name: r.metadata.name,
            size: r.metadata.size,
          };
          return r;
        });
      }

      // BASE.guests = BASE.guests.map((r) => r.id);
      // BASE.coHosts = BASE.coHosts.map((r) => r.id);
      if (!BASE.id) {
        const ids = BASE.addedMembers
          .filter((r) => r.profileId && r.role !== 'host')
          .map((r) => ({
            profileId: r.profileId,
            role: r.role,
          }));
        const emails = BASE.addedMembers
          .filter((r) => !r.profileId)
          .map((r) => ({
            email: r.email,
            role: r.role,
          }));
        BASE.members = {
          ids,
          emails,
        };
        BASE.addedMembers = undefined;
      } else {
        BASE.members = undefined;
        const ids = BASE.addedMembers
          .filter((r) => r.profileId)
          .map((r) => ({
            profileId: r.profileId,
            role: r.role,
          }));
        const emails = BASE.addedMembers
          .filter((r) => !r.profileId)
          .map((r) => ({
            email: r.email,
            role: r.role,
          }));
        BASE.addedMembers = {
          ids,
          emails,
        };
      }

      if (BASE.removedMembers.length) {
        const ids = BASE.removedMembers
          .filter((r) => r.id)
          .map((r) => ({
            profileId: r.id,
            role: r.role,
          }));
        const emails = BASE.removedMembers
          .filter((r) => !r.id)
          .map((r) => ({
            email: r.email,
            role: r.role,
          }));
        BASE.removedMembers = {
          ids,
          emails,
        };
      } else {
        BASE.removedMembers = undefined;
      }

      return Object.keys(BASE)
        .filter((key) => keys.includes(key))
        .reduce((result, key) => {
          result[key] = BASE[key];
          return result;
        }, {});
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
    async availableCalendar({ dates, frequency }) {
      if (this.availableLoading) {
        return;
      }
      this.availableLoading = true;
      let paramFrequency = {};
      if (frequency.type === 'does-not-repeat') {
        paramFrequency = {
          type: 'does-not-repeat',
        };
      } else if (['daily', 'weekly', 'monthly'].includes(frequency.type)) {
        paramFrequency = {
          type: frequency.type,
          endDate: frequency.endDate,
        };
      } else if (frequency.type === 'custom') {
        const Frequency = {
          type: 'custom',
          endDate: frequency.endDate,
          counter: parseInt(frequency.counter),
          periodicity: frequency.periodicity,
        };
        if (frequency.periodicity === 'week') {
          Frequency.days = frequency.days;
        }
        if (frequency.periodicity === 'month') {
          Frequency.monthlySelection = frequency.monthlySelection;
        }
        paramFrequency = Frequency;
      }
      const { data } = await availableCalendar({
        limit: 0,
        data: {
          dates,
          frequency: paramFrequency,
        },
      });
      this.eventId = this.event.id;
      this.availableList = data;
      const calendarIds = this.event.calendars.map((r) => r.id);

      this.event.calendars = data.filter(
        (r) =>
          calendarIds.includes(r.id) &&
          (r.available || this.event.calendarIds.includes(r.id)),
      );

      if (this.type === 'event' && !this.event.id) {
        if (this.event.calendars.length) {
          this.event.calendarId = this.event.calendars[0].id;
          this.event.color = this.event.calendars[0].color;
          if (this.event.calendars[0]?.entity?.id) {
            this.event.entity = {
              id: this.event.calendars[0]?.entity?.id,
              type: 'course',
            };
          }

          this.event.sharedCalendars = this.event.calendars
            .slice(1)
            .map((r) => r.id);
        } else {
          this.event.calendarId = null;
          this.event.color = '';
          this.event.entity = null;
          this.event.sharedCalendars = [];
        }
      } else {
        this.event.sharedCalendars = this.event.calendars
          .filter((r) => this.event.calendarId !== r.id)
          .map((r) => r.id);
      }

      this.availableLoading = false;
      return data;
    },
    async createRoom(params) {
      const data = await createRoom(params);
      return data;
    },
    async getEventAuthToken(params) {
      const data = await getEventAuthToken(params);
      return data;
    },
    async getMembers(params) {
      if (params.roles) {
        const data = await searchMembers(params);
        return data;
      } else {
        const data = await getEventMembers(params);
        return data;
      }
    },
    async searchMembers(params) {
      const data = await searchMembers(params);
      return data;
    },
    async updateEvent(params) {
      const data = await updateEvent({
        ...params,
      });
      return data;
    },
    async checkMemberExists(params) {
      const data = await checkMemberExists(params);
      return data;
    },
    async eventInvite(params) {
      const data = await eventInvite(params);
      return data;
    },
  },
});
