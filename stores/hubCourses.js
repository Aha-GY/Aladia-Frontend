import dayJS from 'dayjs';
import { useToast } from 'vue-toastification';

import { createAiContentsCourse, suggestSubCategories } from '~/api/v2/ai';
import {
  getCategories,
  getCategory,
  searchCategories,
} from '~/api/v2/category';
import {
  createChapter,
  updateChapter,
  getChapter,
  getChapters,
  deleteChapter,
  reorderChapter,
  deleteChaptersMany,
} from '~/api/v2/chapter';
import {
  getCourse,
  getCompletion,
  updateCourse,
  reviewCourse,
  publishCourse,
  getMembers,
  searchMembers,
  addMember,
  removeMember,
  updateMember,
  searchPoetntialMembers,
  retrieveBillingInfo,
  inviteCourseMembers,
  getInviteLink,
  acceptInvite,
  getCompletions,
  createCycles,
  updateCycles,
  deleteCycle,
} from '~/api/v2/course';
import {
  getLectures,
  createLecture,
  updateLecture,
  deleteLecture,
  deleteLectures,
  reorderLecture,
  deleteLecturesMany,
} from '~/api/v2/lecture';
import {
  createVersion,
  getVersion,
  searchVersions,
  restoreVersion,
  updateVersion,
} from '~/api/v2/versions';
import { PAYMENT_MODEL } from '~/constant/payment';
import { nullPayloads } from '~/utils/nullPayload';

const dayjs = dayJS.tz;

export const useHubCoursesStore = defineStore('hubCourses', {
  state: () => ({
    step: 1,
    isEdit: false,
    isPreview: false,
    popupId: '',
    focusField: '',
    floating: false,
    cardPlaying: false,

    chapterOpen: true,
    subjectOpen: false,
    chapterActive: 0,
    calendarView: false,
    popupOpen: false,
    chapterPopup: null,
    lecturePopup: null,
    popupFrom: null,
    deleting: false,
    assigning: false,
    listView: true,

    lectureThumbnailUploading: false,
    lectureVideoUploading: false,

    ai: {
      open: false,
      backgroundAILoad: false,
      done: false,
      loading: false,
      assigning: false,
      switch: false,
      assignCategories: false,
      suggestSubCategoriesDialog: false,

      info: {
        studentExperience: 'beginner', // advanced, intermediate, beginner
        description: '',
        generateCourseThumbnail: false,
        chapterTitleLength: 'mediumTitle', // mediumTitle, descriptiveTitle, shortTitle
        numberOfChapters: 5,
        generateLectureThumbnail: false,
        lectureDuration: 45,
        lectureTitleLength: 'mediumTitle', // mediumTitle, descriptiveTitle, shortTitle
        lecturesPerChapter: 5,
      },
    },

    cycleId: '',
    loading: false,
    saving: false,
    chaptersLoading: false,
    mainCycleChanged: false,
    lastCourseObject: null,
    lastCourseJson: '',
    courseSaveDisabled: false,
    detail: {
      id: '',
      spaceId: null,
      title: '',
      description: '',
      thumbnail: {
        fileId: '',
        metadata: {
          size: 0,
          mimetype: '',
          name: '',
        },
      },
      trailer: {
        fileId: '',
        metadata: {
          size: 0,
          mimetype: '',
          name: '',
        },
      },
      trailerImage: {
        fileId: '',
        metadata: {
          size: 0,
          mimetype: '',
          name: '',
        },
      },
      duration: 0,
      requirements: [],
      objectives: [],
      earnings: 0,
      type: 'on-demand', // on-demand, live
      visibility: 'public', // public, private
      status: '', // constant/course.ts
      dates: {
        startDate: '',
        endDate: '',
      },
      languageId: '',
      categories: [],
      subCategories: [],
      review: {
        ratings: [], // { star, count, percentage }
        totalReviews: 0,
        globalRating: 0,
      },
      roomId: '',
      calendarId: '',
      productId: '',
      seatCount: -1, // -1 for unlimited
      _state: 'unchecked',
      chapters: [],
      billing: {
        paymentModel: null, // one-time, recurring, free
        totalPrice: null,
        subscriptionFee: null,
        frequency: null, // month, week, day
        installments: [],
        installmentNumber: null,
        remainingAmount: null,
        installmentsAmount: null,
        lastInstallmentAmount: null,
      },
      certificateTemplate: {
        name: 'template1',
        logo: {
          fileId: '',
          url: '',
          metadata: {
            size: 0,
            mimetype: '',
            name: '',
          },
        },
        useProfilePicture: true,
        brandColor: '#707070',
        accentColor: '#FCCC5A',
        signatureName: '',
        signatoryRole: '',
        signatureFont: 'Dancing Script',
      },
    },

    spaces: [],

    categories: [],
    categoriesLoading: false,
    categoryActive: -1,
    categoryId: '',
    categorySearch: '',
    categorySearching: false,

    subCategories: [],
    subCategoriesLoading: false,

    versions: [],

    log: {
      loading: false,
      preview: null,
      exit: false,
      // previous: null,
      data: [],
      restore: {
        state: false,
        data: {},
      },
    },

    version: {
      loading: false,
      preview: null,
      exit: false,
      history: {
        cursor: {},
        data: [],
      },
      edit: {
        state: false,
        data: {},
      },
      restore: {
        state: false,
        data: {},
      },
    },

    certificate: {
      issuedPopup: false,
    },
  }),
  getters: {
    event() {
      const hubEvent = useHubEventStore();
      const event = cloneDeep(hubEvent.EVENT);
      return event;
    },
    versionViewing() {
      return this.version.preview || this.log.preview;
    },
    logViewing() {
      return this.log.preview;
    },
    inReview() {
      const route = useRoute();
      return route.name.endsWith('name-management');
    },
    versionId() {
      // 预览非最新版本的id
      // logid
      if (this.log.preview) {
        return this.log.preview.id;
      }
      return this.version.preview && !this.version.preview.current
        ? this.version.preview.id
        : 'latest';
    },
    contentEditable() {
      if (this.detail.type === 'live') {
        // 只有第一个周期可以编辑
        if (!this.detail.cycles?.length || !this.cycleId) {
          return true;
        }

        // 假如当前cycleId不在cycles里，可以编辑
        if (this.detail.cycles.every((cycle) => cycle.id !== this.cycleId)) {
          return true;
        }

        return this.detail.cycles[0].id === this.cycleId;
      }
      return true;
    },
    deleteCheck() {
      const result = [];
      this.traverseTree(this.detail, (node) => {
        if (node._state === 'checked' && node._type !== 'course') {
          result.push(node);
        }
      });
      return result;
    },
    infoSaveDisabled() {
      // 课程信息，假如是第一步，那么只要没有选择语言和技能就不能保存
      if (this.step === 1) {
        return (
          !this.detail.title ||
          this.detail.skills?.length < 3 ||
          !this.detail.languageId ||
          this.detail.objectives.filter(Boolean).length < 5
        );
      } else {
        return false;
      }
    },
  },
  actions: {
    formatCourse(course) {
      course._type = 'course';

      course.skills = course.skills || [];
      course.description = course.description || '';
      course.chapters = [];

      course.originalCategories = course.categories || [];
      if (course.categories) {
        course.categories = course.categories.map((item) => item.id);
      }

      course.originalSubCategories = course.subCategories || [];
      if (course.subCategories) {
        course.subCategories = course.subCategories.map((item) => item.id);
      }

      if (course.languageId?.id) {
        course.originalLanguageId = course.languageId;
        course.languageId = course.languageId.id;
      }

      if (!course.billing) {
        course.billing = {
          paymentModel: null,
          totalPrice: null,
          subscriptionFee: null,
          frequency: null,
          installments: [],
          installmentNumber: null,
          remainingAmount: null,
          installmentsAmount: null,
          lastInstallmentAmount: null,
        };
      }

      if (!course.certificateTemplate) {
        course.certificateTemplate = {
          name: 'template1',
          logo: {
            fileId: '',
            url: '',
            metadata: {
              size: 0,
              mimetype: '',
              name: '',
            },
          },
          useProfilePicture: true,
          brandColor: '#707070',
          accentColor: '#FCCC5A',
          signatureName: '',
          signatoryRole: '',
          signatureFont: 'Dancing Script',
        };
      }

      if (!course.certificateTemplate.logo) {
        course.certificateTemplate.logo = {
          fileId: '',
          url: '',
          metadata: {
            size: 0,
            mimetype: '',
            name: '',
          },
        };
      }

      const { myProfileDetail } = useProfileStore();
      if (!course.certificateTemplate.signatureName) {
        course.certificateTemplate.signatureName =
          myProfileDetail?.fullName || '';
      }
      if (!course.certificateTemplate.signatoryRole) {
        course.certificateTemplate.signatoryRole =
          myProfileDetail?.mainExperience?.name || '';
      }

      const { thumbnail, trailer } = course;

      course.thumbnail = {
        fileId: '',
        url: thumbnail?.url || '',
        metadata: thumbnail?.metadata || {
          size: 0,
          mimetype: '',
          name: '',
        },
      };

      course.trailer = {
        fileId: '',
        url: trailer?.url || '',
        metadata: trailer?.metadata || {
          size: 0,
          mimetype: '',
          name: '',
        },
      };

      if (course.type === 'live') {
        const startTime = course.cycles[0].dates.startDate;
        const endTime = course.cycles[0].dates.endDate;
        const diff = dayjs(new Date(endTime)).diff(dayjs(new Date(startTime)));
        for (let index = 1; index < course.cycles.length; index++) {
          const { dates } = course.cycles[index] || {};
          if (dates?.startDate && !dates?.endDate) {
            dates.endDate = dayjs(new Date(dates.startDate))
              .add(diff, 'ms')
              .toISOString();
          }
        }
      }

      if (!course._state) {
        course._state = 'unchecked';
      }

      return course;
    },
    formatLecture(lecture, chapter) {
      lecture._type = 'lecture';
      lecture._parent = lecture._parent || chapter;

      const hubEvent = useHubEventStore();
      // 保存原始事件数据
      lecture.originalEvent = cloneDeep(lecture.event);
      const newEvent = lecture.event || this.event;

      // 只有在原始事件为空时，且没设置过时间的，才设置默认时间
      if (chapter && !lecture.originalEvent && !lecture.event?.dates) {
        newEvent.dates = this.getEventDefaultDates(chapter);
      }

      lecture.event = hubEvent.setEvent(newEvent);
      lecture.observers = lecture.event.observers || [];
      lecture.teachers = lecture.event.teachers || [];
      lecture.attendants = lecture.event.attendants || [];
      lecture.attachments = lecture.attachments || [];

      lecture.thumbnail = {
        fileId: '',
        url: lecture.thumbnail?.url || '',
        metadata: lecture.thumbnail?.metadata || {
          size: 0,
          mimetype: '',
          name: '',
        },
      };

      lecture.videos = lecture.videos?.length
        ? lecture.videos.map((video) => ({
            fileId: video.fileId || '',
            url: video.url,
            metadata: video.metadata || {
              size: 0,
              mimetype: '',
              name: '',
            },
          }))
        : [
            {
              fileId: '',
              metadata: {
                size: 0,
                mimetype: '',
                name: '',
              },
            },
          ];

      if (!lecture._state) {
        lecture._state = 'unchecked';
      }

      return lecture;
    },
    formatChapter(chapter) {
      chapter._type = 'chapter';
      chapter._parent = this.detail;

      if (!chapter.cycles || !chapter.cycles.length) {
        chapter.cycles = [
          {
            dates: {
              startDate: '',
              endDate: '',
            },
          },
        ];
      }

      if (!chapter._state) {
        chapter._state = 'unchecked';
      }

      return chapter;
    },
    findChapter(id) {
      for (let i = 0; i < this.detail.chapters.length; i++) {
        const chapter = this.detail.chapters[i];
        if (chapter.id === id) {
          return chapter;
        }
      }
      return null;
    },
    findLecture(id) {
      for (let i = 0; i < this.detail.chapters.length; i++) {
        const chapter = this.detail.chapters[i];
        for (let j = 0; j < chapter.lectures.length; j++) {
          const lecture = chapter.lectures[j];
          if (lecture.id === id) {
            return lecture;
          }
        }
      }
      return null;
    },
    traverseTree(node, callback) {
      callback(node);
      if (node._type === 'course') {
        node.chapters.forEach((chapter) =>
          this.traverseTree(chapter, callback),
        );
      } else if (node._type === 'chapter') {
        node.lectures.forEach((lecture) =>
          this.traverseTree(lecture, callback),
        );
      }
    },
    clearSelected() {
      this.traverseTree(this.detail, (node) => {
        node._state = 'unchecked';
      });
    },
    getEventDefaultDates(chapter) {
      // 假如事件的没有开始时间，默认使用上一个事件的结束时间/章节的开始/课程的开始时间
      const lastEvent =
        chapter.lectures[chapter.lectures.length - 1]?.originalEvent;
      const defaultStartDate =
        lastEvent?.dates.endDate ||
        chapter?.cycles[0]?.dates.startDate ||
        this.detail.cycles?.[0]?.dates.startDate;
      if (!defaultStartDate) {
        return null;
      }
      return getCreateDateRange(defaultStartDate);
    },
    getCourseJson() {
      return JSON.stringify({
        ...this.detail,
        billing: {
          ...this.detail.billing,
          remainingAmount: null,
          installmentsAmount: null,
          installmentNumber: null,
          installments: [],
        },
        chapters: undefined,
      });
    },
    async getCourse(params) {
      try {
        this.loading = true;

        const data = await getCourse({
          version: this.versionId,
          courseId: this.detail.id,
          ...params,
        });

        const course = this.formatCourse(data);
        course.chapters = this.detail.chapters || [];
        this.clearSelected();
        this.detail = course;

        // 用于判断是否有变化
        this.lastCourseJson = this.getCourseJson();

        // 用于还原上次的状态
        this.lastCourseObject = cloneDeep(course);

        for (let i = 0; i < course.chapters.length; i++) {
          const chapter = course.chapters[i];
          chapter._parent = this.detail;
        }

        this.loading = false;
        return course;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
    async getCompletion(params) {
      const data = await getCompletion(params);
      return data;
    },
    async getCompletions(params) {
      const data = await getCompletions(params);
      return data;
    },
    async updateCourse(params) {
      params = nullPayloads(params);
      const course = await updateCourse(params);
      return course;
    },
    async getSpaces(params = {}) {
      const hubSpaces = useHubSpacesStore();
      const spaces = await hubSpaces.getSpaces(params);
      this.spaces = spaces;
      return spaces;
    },
    async getCategories(params = {}) {
      if (this.categories.length) {
        return;
      }

      this.categoriesLoading = true;
      const { data: categories } = await getCategories({
        limit: 100,
        ...params,
      });

      for (let index = 0; index < categories.length; index++) {
        categories[index].subCategories = [];
      }

      this.categories = categories;
      this.categoriesLoading = false;
      return categories;
    },
    async getSubCategories({ parentId }) {
      const category = this.categories.find((item) => item.id === parentId);

      if (category?.subCategories.length) {
        return category.subCategories;
      }

      const { data: subCategories } = await getCategories({
        parentId,
        limit: 100,
      });

      if (category) {
        category.subCategories = [...subCategories];
        category.originalSubCategories = [...subCategories];
      }

      return subCategories;
    },
    async searchCategories() {
      this.categorySearching = true;
      const { data: categories } = await searchCategories({
        name: this.categorySearch,
        limit: 100,
      });
      for (let index = 0; index < categories.length; index++) {
        const category = categories[index];
        const { data: subCategories } = await getCategories({
          parentId: category.id,
          limit: 100,
        });
        category.subCategories = subCategories || [];
      }
      this.categories = categories;
      this.categorySearching = false;
      return categories;
    },
    async getCategory({ id }) {
      for (let i = 0; i < this.categories.length; i++) {
        const category = this.categories[i];
        if (category.id === id) {
          return category;
        }
        for (let j = 0; j < category.subCategories.length; j++) {
          const subCategory = category.subCategories[j];
          if (subCategory.id === id) {
            return subCategory;
          }
        }
      }
      const data = await getCategory({ id });
      return data;
    },
    async previewSubCategories() {
      if (this.subCategoriesLoading) {
        return;
      }
      this.subCategoriesLoading = true;
      this.subCategories = await Promise.all(
        this.detail.subCategories.map((id) => this.getCategory({ id })),
      );
      this.subCategoriesLoading = false;
      return this.subCategories;
    },
    async refreshChapter({ chapterId }) {
      const chapter = await getChapter({
        courseId: this.detail.id,
        chapterId,
        version: this.versionId,
      });

      this.formatChapter(chapter);

      const { data: lectures } = await getLectures({
        courseId: this.detail.id,
        chapterId,
        limit: 100,
        version: this.versionId,
      });

      for (let j = 0; j < lectures.length; j++) {
        const lecture = lectures[j];
        this.formatLecture(lecture, chapter);
      }

      chapter.lectures = lectures;

      const oldChapter = this.findChapter(chapter.id);

      if (oldChapter) {
        Object.assign(oldChapter, chapter);
      } else {
        this.detail.chapters.push(chapter);
      }

      return chapter;
    },
    async getChapters() {
      this.chaptersLoading = true;

      const courseId = this.detail.id;
      const cycleId = this.contentEditable ? undefined : this.cycleId;

      const { data: chapters } = await getChapters({
        courseId,
        limit: 100,
        version: this.versionId,
        cycleId,
      });

      const lecturesList = await Promise.all(
        chapters.map((chapter) => {
          this.formatChapter(chapter);
          return getLectures({
            courseId,
            chapterId: chapter.id,
            limit: 100,
            version: this.versionId,
            cycleId,
          });
        }),
      );

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        const { data: lectures } = lecturesList[i];
        for (let j = 0; j < lectures.length; j++) {
          const lecture = lectures[j];
          this.formatLecture(lecture, chapter);
        }
        chapter.lectures = lectures;
      }

      this.detail.chapters = chapters;
      this.chaptersLoading = false;
      return chapters;
    },
    async updateChapter(params) {
      if (params.chapterId) {
        const chapter = await updateChapter({
          courseId: params.courseId || this.detail.id,
          ...params,
        });
        return chapter;
      } else {
        const chapter = await createChapter({
          autoGenerated: true,
          courseId: this.detail.id,
          ...params,
          name: undefined, // 不再需要默认name
        });
        return chapter;
      }
    },
    async deleteChapter(params) {
      this.popupOpen = false;
      this.chapterPopup = null;
      this.lecturePopup = null;
      const data = await deleteChapter({
        courseId: this.detail.id,
        ...params,
      });
      await this.getCourse();
      return data;
    },
    async reorderChapter(params) {
      const data = await reorderChapter({
        courseId: this.detail.id,
        ...params,
      });
      this.clearSelected();
      return data;
    },
    async updateLecture(params) {
      if (params.lectureId) {
        const lecture = await updateLecture({
          courseId: this.detail.id,
          ...params,
        });
        this.clearSelected();
        return lecture;
      } else {
        const lecture = await createLecture({
          autoGenerated: true,
          courseId: this.detail.id,
          ...params,
          title: undefined, // 不再需要默认title
        });
        this.clearSelected();
        return lecture;
      }
    },
    async deleteLecture(params) {
      this.popupOpen = false;
      this.chapterPopup = null;
      this.lecturePopup = null;
      const data = await deleteLecture({
        courseId: this.detail.id,
        ...params,
      });
      await this.getCourse();
      return data;
    },
    async deleteLectures(params) {
      this.popupOpen = false;
      this.chapterPopup = null;
      this.lecturePopup = null;
      const data = await deleteLectures({
        courseId: this.detail.id,
        ...params,
      });
      await this.getCourse();
      return data;
    },
    async reorderLecture(params) {
      const data = await reorderLecture({
        courseId: this.detail.id,
        ...params,
      });
      return data;
    },
    async publishCourse(params = {}) {
      const data = await publishCourse({
        courseId: this.detail.id,
        ...params,
      });
      return data;
    },
    async reviewCourse(params = {}) {
      const data = await reviewCourse({
        courseId: this.detail.id,
        status: 'published',
        ...params,
      });
      return data;
    },
    async getMembers(params = {}) {
      if (params.roles || params.username) {
        const data = await searchMembers({
          courseId: this.detail.id,
          ...params,
        });
        return data;
      } else {
        const data = await getMembers({
          courseId: this.detail.id,
          ...params,
        });
        return data;
      }
    },
    async searchMembers(params = {}) {
      const data = await searchMembers({
        courseId: this.detail.id,
        ...params,
      });
      return data;
    },
    async addMember(params) {
      const data = await addMember({
        courseId: this.detail.id,
        ...params,
      });
      return data;
    },
    async removeMember(params) {
      const data = await removeMember({
        courseId: this.detail.id,
        ...params,
      });
      return data;
    },
    async updateMember(params) {
      const data = await updateMember({
        courseId: this.detail.id,
        ...params,
      });
      return data;
    },
    async searchPoetntialMembers(params) {
      const data = await searchPoetntialMembers({
        courseId: this.detail.id,
        ...params,
      });
      return data;
    },
    async deleteChaptersMany(params) {
      this.popupOpen = false;
      this.chapterPopup = null;
      this.lecturePopup = null;
      const data = await deleteChaptersMany({
        courseId: this.detail.id,
        ...params,
      });
      await this.getCourse();
      return data;
    },
    async deleteLecturesMany(params) {
      this.popupOpen = false;
      this.chapterPopup = null;
      this.lecturePopup = null;
      const data = await deleteLecturesMany({
        courseId: this.detail.id,
        ...params,
      });
      await this.getCourse();
      return data;
    },
    async retrieveBillingInfo(params) {
      const data = await retrieveBillingInfo(params);
      return data;
    },
    async inviteMembers(params) {
      const data = await inviteCourseMembers(params);
      return data;
    },
    async getInviteLink(params) {
      const data = await getInviteLink(params);
      return data;
    },
    async acceptInvite(params) {
      const data = await acceptInvite(params);
      return data;
    },
    async save({ chapter, lecture }) {
      const saveChapter = () =>
        this.updateChapter({
          chapterId: chapter.id,
          name: chapter.name,
          dates: chapter.cycles[0].dates?.startDate
            ? chapter.cycles[0].dates
            : undefined,
        });

      const saveLecture = () => {
        const thumbnail = {
          fileId: lecture.thumbnail.fileId,
          metadata: lecture.thumbnail.metadata,
        };

        const videos = lecture.videos
          .filter((video) => !!video.fileId)
          .map((video) => ({
            fileId: video.fileId,
            metadata: {
              ...video.metadata,
              framingPath: undefined,
              framingPaths: undefined,
              transcodingPaths: undefined,
              videoDuration: undefined,
            },
          }));

        const attachments = lecture.attachments
          .filter((attachment) => !!attachment.fileId)
          .map((attachment) => ({
            fileId: attachment.fileId,
            metadata: {
              ...attachment.metadata,
              framingPath: undefined,
              framingPaths: undefined,
              transcodingPaths: undefined,
              videoDuration: undefined,
            },
          }));

        const observers = lecture.observers.map((observer) => observer.id);
        const teachers = lecture.teachers.map((teacher) => teacher.id);
        const attendants = lecture.attendants.map((attendant) => attendant.id);

        const hubEvent = useHubEventStore();
        const event = hubEvent.getEvent(hubEvent.event);

        const hubCalendar = useHubCalendarStore();
        hubCalendar.entryDataList = hubCalendar.entryDataList.filter(
          (entry) => !entry.creating,
        );
        hubCalendar.unSelectedCalendar(
          {
            ...event,
            calendarId: this.detail.calendarId,
          },
          hubEvent.event,
          this.detail.color,
        );

        return this.updateLecture({
          chapterId: chapter.id,
          lectureId: lecture.id,
          title: lecture.title,
          type: lecture.type,
          duration: lecture.duration || undefined,
          description: lecture.description || undefined,
          videos: videos.length ? videos : undefined,
          thumbnail: thumbnail.fileId ? thumbnail : undefined,
          attachments: attachments.length ? attachments : undefined,
          observers: observers.length ? observers : undefined,
          teachers: teachers.length ? teachers : undefined,
          attendants: attendants.length ? attendants : undefined,
          event: lecture.type === 'live' ? event : undefined,
        });
      };

      await Promise.all([saveChapter(), saveLecture()]);
    },
    async delete({ chapter, lecture }) {
      if (chapter?.lectures) {
        const index = chapter.lectures.findIndex(
          (lecture) => lecture.id === lecture.id,
        );
        chapter.lectures.splice(index, 1);
      }
      if (lecture.id) {
        await this.deleteLecture({
          chapterId: chapter.id,
          lectureId: lecture.id,
        });
      }
    },
    async remove() {
      try {
        if (this.deleting) {
          return;
        }

        if (!this.deleteCheck.length) {
          return;
        }

        this.deleting = true;

        const lectures = this.deleteCheck.filter(
          (item) => item._type === 'lecture' && item.id,
        );

        const chapters = this.deleteCheck.filter(
          (item) =>
            item._type === 'chapter' &&
            item.id &&
            item.id !== this.detail.chapters[0].id, // 不能删除第一个章节
        );

        if (lectures.length) {
          await this.deleteLecturesMany({
            chapterId: lectures[0].chapterId,
            ids: lectures.map((item) => item.id),
            chapterIds: lectures.map((item) => item.chapterId),
          });
        }

        if (chapters.length) {
          await this.deleteChaptersMany({
            ids: chapters.map((item) => item.id),
          });
        }

        await this.getChapters();
        this.clearSelected();

        this.deleting = false;
      } catch (error) {
        this.deleting = false;
        throw error;
      }
    },
    async assignSubjects(params) {
      const hubSubject = useHubSubjectStore();
      try {
        if (this.assigning) {
          return;
        }
        if (!this.deleteCheck.length) {
          return;
        }

        this.assigning = true;

        const selectedLectures = this.deleteCheck
          .filter((item) => item._type === 'lecture' && item.id)
          .map((lecture) => lecture.id);

        const selectedChapters = this.deleteCheck.filter(
          (item) => item._type === 'chapter' && item.id,
        );

        const chapterLectures = selectedChapters
          .flatMap((chapter) => chapter.lectures || [])
          .map((lecture) => lecture.id);

        const uniqueLectureIds = [
          ...new Set([...selectedLectures, ...chapterLectures]),
        ];

        if (uniqueLectureIds.length) {
          await hubSubject.assignSubjects({
            courseId: this.detail.id,
            lectureIds: uniqueLectureIds,
            ...params,
          });
        }

        this.assigning = false;
        this.clearSelected();
        await hubSubject.getSubjects({
          courseId: this.detail.id,
        });
        await this.getChapters();
      } catch (error) {
        this.assigning = false;
        throw error;
      }
    },
    async unassignSubjects() {
      const hubSubject = useHubSubjectStore();
      try {
        if (this.assigning || !this.deleteCheck.length) {
          return;
        }

        this.assigning = true;

        const selectedChapters = this.deleteCheck.filter(
          (item) => item._type === 'chapter' && item.id,
        );

        const lectureGroups = this.deleteCheck.reduce((acc, item) => {
          if (item._type === 'lecture' && item.id && item.subjectId) {
            acc[item.subjectId] = acc[item.subjectId] || [];
            acc[item.subjectId].push(item.id);
          }
          return acc;
        }, {});

        for (const chapter of selectedChapters) {
          if (chapter.lectures) {
            for (const lecture of chapter.lectures) {
              if (lecture.id && lecture.subjectId) {
                lectureGroups[lecture.subjectId] =
                  lectureGroups[lecture.subjectId] || [];
                if (!lectureGroups[lecture.subjectId].includes(lecture.id)) {
                  lectureGroups[lecture.subjectId].push(lecture.id);
                }
              }
            }
          }
        }

        if (Object.keys(lectureGroups).length) {
          for (const [subjectId, lectureIds] of Object.entries(lectureGroups)) {
            await hubSubject.unassignSubjects({
              courseId: this.detail.id,
              subjectId,
              lectureIds,
            });
          }
        }

        this.assigning = false;
        this.clearSelected();
        await hubSubject.getSubjects({
          courseId: this.detail.id,
        });
        await this.getChapters();
      } catch (error) {
        this.assigning = false;
        throw error;
      }
    },
    async generateAi() {
      const paymentStore = usePaymentStore();
      try {
        this.ai.loading = true;

        const data = await createAiContentsCourse(
          {
            ...this.ai.info,
            chapterTitleLength: undefined,
            lectureTitleLength: undefined,
          },
          this.ai.assignCategories,
        );
        return data;
      } catch (error) {
        this.ai.loading = false;
        this.ai.backgroundAILoad = false;
        if (error.errorCode) {
          paymentStore.serviceFailedDialog = error.errorCode;
        }
        throw error;
      }
    },
    async courseGenerationCompleted(eventData) {
      if (eventData.courseId !== this.detail.id) {
        return;
      }

      if (eventData.status === true) {
        await this.getCourse({
          courseId: this.detail.id,
        });

        await this.getChapters();
        this.ai.done = true;
        this.ai.loading = false;
        await sleep(3000);
        this.ai.open = false;
        this.ai.backgroundAILoad = false;
        this.ai.done = false;
      } else {
        this.ai.loading = false;
        this.$toast.error(this.$t('course.ai.error.generate'));
      }
    },
    async suggestSubCategories(params) {
      try {
        const data = await suggestSubCategories({
          courseId: this.detail.id,
          ...params,
        });
        return data;
      } catch (error) {
        const paymentStore = usePaymentStore();
        if (error.errorCode) {
          paymentStore.serviceFailedDialog = error.errorCode;
        }
        console.error(error);
        throw error;
      }
    },
    resetVersion() {
      this.version = {
        edit: false,
        loading: false,
        preview: null,
        history: {
          cursor: {},
          data: [],
        },
      };
    },
    async createVersion(params) {
      const data = await createVersion(params);
      return data;
    },
    async getVersion(params) {
      const data = await getVersion(params);
      return data;
    },
    async restoreVersion(params) {
      const data = await restoreVersion(params);
      return data;
    },
    async updateVersion(params) {
      const data = await updateVersion(params);
      return data;
    },
    async searchLogs(params) {
      try {
        this.log.loading = true;
        const { data } = await searchVersions({
          sortDirection: 'desc',
          limit: 0,
          ...params,
        });

        const relatedVersion = this.versions.find(
          (version) => version.parentId === params.parentId,
        );

        if (relatedVersion) {
          data.unshift(relatedVersion);
        }
        this.log.loading = false;
        return data;
      } catch (error) {
        this.log.loading = false;
        throw error;
      }
    },
    async searchVersions(params = {}) {
      try {
        this.version.loading = true;
        const { cursor, data } = await searchVersions({
          sortDirection: 'desc',
          ...params,
        });

        this.version.history.cursor = cursor;
        this.versions = data;

        if (params.next) {
          this.version.history.data.push(...data);
        } else {
          this.version.history.data = data;
        }

        if (this.version.history.data[0]) {
          this.version.history.data[0].current = true;
        }

        this.version.loading = false;
        return data;
      } catch (error) {
        this.version.loading = false;
        throw error;
      }
    },
    async deleteCycle(params) {
      const data = await deleteCycle(params);
      return data;
    },
    async createCycles(params) {
      const data = await createCycles(params);
      return data;
    },
    async updateCycles(params) {
      const data = await updateCycles(params);
      return data;
    },
    async appendChapter() {
      const $toast = useToast();
      const course = this.detail;

      const courseDates = course.cycles[0]?.dates || {};
      const courseEndDate = courseDates.endDate;
      const lastChapter = course.chapters[course.chapters.length - 1];
      const lastChapterEndDate = lastChapter?.cycles[0].dates?.endDate;

      // 章节的开始时间默认为上一个章节的结束时间的后一天，或者课程的开始时间
      // 章节的结束时间默认为课程的结束时间
      const chapterDates = {};
      if (course.type === 'live') {
        // 假如上一个章节的结束时间和课程的结束时间在同一天，那么不能再添加章节
        if (
          courseEndDate &&
          lastChapterEndDate &&
          dayjs(lastChapterEndDate).isSame(dayjs(courseEndDate), 'day')
        ) {
          return $toast.error('Cannot add more chapters');
        }

        chapterDates.startDate = lastChapterEndDate
          ? dayjs(lastChapterEndDate).add(1, 'day').toISOString()
          : courseDates.startDate;
        chapterDates.endDate = courseEndDate;

        // 假如时间不合法，那么不能添加章节
        if (
          dayjs(chapterDates.startDate).isAfter(dayjs(chapterDates.endDate))
        ) {
          return $toast.error('Cannot add more chapters');
        }
      }

      const chapter = await this.updateChapter({
        dates: course.type === 'live' ? chapterDates : undefined,
      });

      // 事件的开始时间默认为章节的开始时间？？向上取整似乎不准确
      const chapterStartDate = chapter?.cycles[0]?.dates.startDate;
      const eventDates = chapterStartDate
        ? getCreateDateRange(chapterStartDate)
        : null;

      const lecture = await this.updateLecture({
        chapterId: chapter.id,
        type: course.type,
        event:
          course.type === 'live' && eventDates
            ? {
                dates: eventDates,
              }
            : undefined,
      });

      await this.refreshChapter({
        chapterId: chapter.id,
      });

      this.clearSelected();
      this.getCourse();

      return {
        chapter: this.findChapter(chapter.id),
        lecture: this.findLecture(lecture.id),
      };
    },
    async saveCourse() {
      const { $eventBus } = useNuxtApp();
      const $toast = useToast();
      const { t } = useNuxtApp().$i18n;
      const hubSpaces = useHubSpacesStore();
      const hubSidebar = useHubSidebarStore();
      const paymentStore = usePaymentStore();
      const course = this.detail;
      const folder = hubSidebar.course.folder;
      const dates = course.cycles[0]?.dates || {};

      if (this.step === 2) {
        if (this.ai.assigning) {
          return;
        }

        const token = hubSpaces.statistics.billings.find(
          (bill) => bill.type === 'tokens',
        );
        const aiFreeTierFinished = token?.freeTierPercentage === 100;
        const hasPaymentMethod = paymentStore.paymentMethods.length > 0;

        const originalIds = course.originalSubCategories.map((sub) => sub.id);

        const isDifferent =
          originalIds.length !== course.subCategories.length ||
          !originalIds.every((id) => course.subCategories.includes(id));

        const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

        if (
          (hasPaymentMethod || !aiFreeTierFinished) &&
          !isoDateRegex.test(course.title) &&
          (isDifferent || !course.subCategories.length)
        ) {
          this.ai.suggestSubCategoriesDialog = true;
          return;
        }
      }

      if (this.saving || this.courseSaveDisabled) {
        return;
      }

      const objectives = course.objectives.filter(Boolean);
      const requirements = course.requirements.filter(Boolean);

      /* make possible to save the course without filling language, skills and goals because it takes a lot of time to fill out and save for testing */

      // if (this.step === 1) {
      //   if (
      //     !course.title ||
      //     objectives.length < 5 ||
      //     course.skills.length < 3 ||
      //     !course.languageId
      //   ) {
      //     $toast.error(`Validation Error: ${!course.title ? '\n • You must give title.' : ''} ${!course.languageId ? '\n • You must select a language.' : ''} ${course.skills.length < 3 ? ' \n • You must provide at least 3 skills.' : ''} ${objectives.length < 5 ? '\n • You must define at least 5 goals.' : ''}
      //       `);
      //     this.saving = false;
      //   }
      // }

      /* for now show only the error message and make it possible to save without full information /comment out return/ */
      if (this.infoSaveDisabled) {
        $eventBus.emit('SAVE-INFO');
        // return;
      }

      if (course.status === 'generating') {
        $toast.error(t('course.generate.error'));
        return;
      }

      try {
        this.saving = true;
        await sleep(100);

        const thumbnail = {
          fileId: course.thumbnail.fileId,
          metadata: course.thumbnail.metadata,
        };

        const trailer = {
          fileId: course.trailer.fileId,
          metadata: {
            ...course.trailer.metadata,
            framingPath: undefined,
            framingPaths: undefined,
            transcodingPaths: undefined,
            videoDuration: undefined,
          },
        };

        const billing = { ...course.billing };

        billing.totalPrice = billing.totalPrice
          ? Number(billing.totalPrice)
          : undefined;

        billing.subscriptionFee = billing.subscriptionFee
          ? Number(billing.subscriptionFee)
          : undefined;

        if (billing.subscriptionFee >= billing.totalPrice) {
          $toast.error(t('category.fee.error.subscription.price'));
          this.saving = false;
          return;
        }

        if (billing.paymentModel === PAYMENT_MODEL.FREE) {
          billing.totalPrice = 0;
        } else {
          if (billing.paymentModel && !billing.totalPrice) {
            $toast.error('Total price is required');
            this.saving = false;
            return;
          }
        }

        if (billing.paymentModel === PAYMENT_MODEL.RECURRING) {
          if (!billing.subscriptionFee) {
            this.saving = false;
            $toast.error(t('category.fee.error.subscription.required'));
            return;
          }
        }

        if (billing.paymentModel === PAYMENT_MODEL.ONE_TIME) {
          billing.subscriptionFee = undefined;
          billing.frequency = undefined;
          billing.installments = undefined;
          billing.installmentNumber = undefined;
          billing.remainingAmount = undefined;
          billing.installmentsAmount = undefined;
          billing.lastInstallmentAmount = undefined;
        }

        const certificateTemplate =
          this.step === 5
            ? {
                ...course.certificateTemplate,
                url: undefined,
                logo: course.certificateTemplate.logo?.fileId
                  ? {
                      fileId: course.certificateTemplate.logo.fileId,
                      metadata: {
                        mimetype:
                          course.certificateTemplate.logo.metadata.mimetype,
                        size: course.certificateTemplate.logo.metadata.size,
                        name: course.certificateTemplate.logo.metadata.name,
                      },
                    }
                  : undefined,
              }
            : undefined;

        await this.updateCourse({
          id: course.id,
          certificateTemplate,
          billing: billing.paymentModel ? billing : undefined,
          seatCount: Number(course.seatCount) || -1,
          objectives: objectives.length ? objectives : undefined,
          requirements: requirements.length ? requirements : undefined,
          spaceId: course.spaceId || undefined,
          title: course.title || undefined,
          description: course.description || undefined,
          thumbnail: thumbnail.fileId ? thumbnail : undefined,
          trailer: trailer.fileId ? trailer : undefined,
          type: course.type || undefined,
          dates: this.mainCycleChanged ? dates : undefined,
          visibility: course.visibility || undefined,
          languageId: course.languageId || undefined,
          skills: course.skills.length ? course.skills : undefined,
          categories: course.categories.length ? course.categories : undefined,
          subCategories: course.subCategories.length
            ? course.subCategories
            : undefined,
        });

        // 不能重复使用fileId
        course.thumbnail.fileId = undefined;
        course.trailer.fileId = undefined;

        // 重置mainCycleChanged
        this.mainCycleChanged = false;

        if (course.type === 'live') {
          const newCycles = course.cycles
            .slice(1)
            .filter((item) => !item.id && item.dates.startDate)
            .map((item) => ({
              startDate: item.dates.startDate,
            }));

          const oldCycles = course.cycles
            .slice(1)
            .filter((item) => item.id && item.changed && item.dates.startDate)
            .map((item) => ({
              cycleId: item.id,
              startDate: item.dates.startDate,
            }));

          // 任何状态下都可以新增的周期
          if (newCycles.length) {
            await this.createCycles({
              courseId: course.id,
              cycles: newCycles,
            });
          }

          // 只有课程是草稿状态，去没发布过才可编辑，才能更新的周期
          if (
            oldCycles.length &&
            course.status === 'draft' &&
            course.cycles[0].status === 'draft'
          ) {
            await this.updateCycles({
              courseId: course.id,
              cycles: oldCycles,
            });
          }
        }

        this.saving = false;

        $toast.success('Course saved successfully');

        hubSidebar.course.data = await this.getCourse({
          courseId: course.id,
        });

        if (folder.id) {
          hubSpaces.getCourses({
            spaceId: course.spaceId,
            folderId: folder.id,
          });
        }
      } catch (error) {
        this.saving = false;
        throw error;
      }
    },
  },
});
