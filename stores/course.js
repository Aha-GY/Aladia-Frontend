import { getCategory } from '~/api/v2/category';
import { getChapters } from '~/api/v2/chapter';
import { updateCompletion, getCompletion, getCourse } from '~/api/v2/course';
import { getLectures, getLecture } from '~/api/v2/lecture';
import { searchPosts } from '~/api/v2/social';
import { getSubjects } from '~/api/v2/subject';
import { handleCourseAvailableAndCycles } from '~/utils/payment.js';

export const useCourseStore = defineStore('course', {
  state: () => ({
    paying: false,
    loading: false,
    purchasing: false,
    course: {},
    completion: {},
    courseSubjects: [],
    subjects: [],

    popup: {
      state: false,
      type: '',
    },

    chapter: {
      state: false,
      index: null,
    },

    review: {
      rating: 0,
      hover: 0,
      view: 'list', // grid, list
      loading: false,
      course: {},
      completion: {},
      data: [],
      cursor: null,
    },

    question: {
      status: '',
      hover: 0,
      view: 'list', // grid, list
      loading: false,
      data: [],
      cursor: null,
    },

    player: {
      url: '',
      played: 0,
      duration: 0,
      playing: false,
      loading: false,
      currentTime: 0,
      currentLecture: null,
      currentChapter: null,
      collpase: false,
      control: true,
      showNext: false,
      showPrev: false,
      autoplay: true,

      currentLectureLivingRecording: null,
    },
  }),
  getters: {
    buyed() {
      // false 展示购买按钮
      // true 隐藏购买按钮

      const authStore = useAuthStore();

      // 未登录能购买
      if (!authStore.logged) {
        return false;
      }

      // 自己的课程不能购买
      if (this.course.owner?.id === authStore.context) {
        return true;
      }

      // 限量课程且已售完不能购买
      if (this.course.cycles) {
        const { courseAvailable } = handleCourseAvailableAndCycles(this.course);
        if (!courseAvailable) {
          return !courseAvailable;
        }
      }

      // 组织可以一直购买
      if (authStore.isOrg) {
        return false;
      }

      // 支付失败的
      if (this.course.suspend) {
        return false;
      }

      // 自己购买的，或者别人分配的
      return this.course.purchased || !!this.course.role;
    },
    chapterIndex() {
      if (!this.player.currentChapter) {
        return null;
      }
      const chapters = this.course.chapters;
      return chapters.findIndex(
        (item) => item.id === this.player.currentChapter.id,
      );
    },
    lectureIndex() {
      if (!this.player.currentChapter) {
        return null;
      }
      if (!this.player.currentLecture) {
        return null;
      }

      const route = useRoute();
      const { lectureId, chapterId, videoId } = route.query;
      if (lectureId && chapterId && videoId) {
        const lecture = this.player.currentChapter.lectures.find(
          (item) => item.lectureId === lectureId,
        );
        return lecture.lectures.find((item) => item.id === videoId)
          .lectureIndex;
      }

      return this.player.currentChapter.lectures.findIndex(
        (item) => item.id === this.player.currentLecture.id,
      );
    },
    current() {
      return this.player.currentLecture;
    },
    currentLectureLivingRecording() {
      return this.player.currentLectureLivingRecording;
    },
    next() {
      try {
        // 无当前课程, 返回第一节
        if (!this.current) {
          const lecture = this.course.chapters[0].lectures[0];
          return {
            lecture,
            chapter: this.course.chapters[0],
            video: lecture.videos[0].url,
          };
        }

        const chapters = this.course.chapters;

        if (this.currentLectureLivingRecording) {
          const lecture = this.player.currentChapter.lectures.find(
            (item) =>
              item.lectureId === this.currentLectureLivingRecording.lectureId,
          );
          const next0 = lecture.lectures.find(
            (item) => item.lectureIndex === this.lectureIndex + 1,
          );
          if (next0) {
            return {
              lecture: next0,
              chapter: chapters[this.chapterIndex],
              video: next0.videos[0].url,
            };
          }
        }

        const next1 =
          chapters[this.chapterIndex].lectures[this.lectureIndex + 1];
        if (next1) {
          return {
            lecture: next1,
            chapter: chapters[this.chapterIndex],
            video: next1.videos[0].url,
          };
        }

        const next2 = chapters[this.chapterIndex + 1].lectures[0];

        if (next2) {
          return {
            lecture: next2,
            chapter: chapters[this.chapterIndex + 1],
            video: next2.videos[0].url,
          };
        }
        return null;
      } catch {
        return null;
      }
    },
    prev() {
      try {
        const chapters = this.course.chapters;

        if (this.currentLectureLivingRecording) {
          const lecture = this.player.currentChapter.lectures.find(
            (item) =>
              item.lectureId === this.currentLectureLivingRecording.lectureId,
          );
          const prev0 = lecture.lectures.find(
            (item) => item.lectureIndex === this.lectureIndex - 1,
          );
          if (prev0) {
            return {
              lecture: prev0,
              chapter: chapters[this.chapterIndex],
              video: prev0.videos[0].url,
            };
          }
        }

        const prev1 =
          chapters[this.chapterIndex].lectures[this.lectureIndex - 1];

        if (prev1) {
          return {
            lecture: prev1,
            chapter: chapters[this.chapterIndex],
            video: prev1.videos[0].url,
          };
        }

        const prev2 = chapters[this.chapterIndex - 1].lectures.slice(-1)[0];

        if (prev2) {
          return {
            lecture: prev2,
            chapter: chapters[this.chapterIndex - 1],
            video: prev2.videos[0].url,
          };
        }
        return null;
      } catch {
        return null;
      }
    },
    isOwner() {
      const authStore = useAuthStore();
      return this.course.owner?.id === authStore.context;
    },
    cycleId() {
      const paymentStore = usePaymentStore();

      // 未选择周期
      if (!paymentStore.cyclesId) {
        return;
      }

      // 非直播课程
      if (this.course.type !== 'live') {
        return;
      }

      // 课程无周期
      if (!this.course.cycles?.length) {
        return;
      }

      // 忽略第一周期
      if (this.course.cycles[0]?.id === paymentStore.cyclesId) {
        return;
      }

      // 周期不在课程周期内
      if (
        this.course.cycles.every((item) => item.id !== paymentStore.cyclesId)
      ) {
        return;
      }

      return paymentStore.cyclesId;
    },
  },
  actions: {
    getVersion() {
      const route = useRoute();
      return route.query.version || 'latest_published';
    },
    getLectureCompletion(target, isLiveRecord) {
      try {
        for (let i = 0; i < this.completion.completions.length; i++) {
          const chapter = this.completion.completions[i];
          const lecture = chapter.completions.find((item) =>
            isLiveRecord
              ? item.lectureId === target.lectureId
              : item.lectureId === target.id ||
                item.lectureId === target.original,
          );
          if (lecture) {
            if (isLiveRecord) {
              return lecture.completions;
            } else {
              return lecture.completions[0];
            }
          }
        }
      } catch {
        return 0;
      }
    },
    updateLocalLectureCompletion({ lectureId, completion, index }) {
      try {
        for (let i = 0; i < this.completion.completions.length; i++) {
          const chapter = this.completion.completions[i];
          const lecture = chapter.completions.find(
            (item) => item.lectureId === lectureId,
          );
          if (lecture) {
            lecture.completions[index] = completion;
            return;
          }
        }
      } catch (error) {
        console.error('Error updating lecture completion:', error);
      }
    },
    getChapterCompletion(target) {
      try {
        for (let i = 0; i < this.completion.completions.length; i++) {
          const chapter = this.completion.completions[i];
          if (chapter.chapterId === target.id) {
            return chapter.average;
          }
        }
      } catch {
        return 0;
      }
    },
    async getCourse(params) {
      this.loading = true;

      const hubCourse = useHubCoursesStore();

      const data = await getCourse({
        ...params,
        version: this.getVersion(),
      });

      const { data: subjects } = await getSubjects({
        courseId: params.courseId,
        version: 'latest',
        showChapters: true,
      });
      this.courseSubjects = subjects;

      const course = hubCourse.formatCourse(data);
      data.chapters = this.course.chapters || [];
      this.course = course;
      this.loading = false;
      return course;
    },
    async getCompletion() {
      const data = await getCompletion({
        courseId: this.course.id,
      });
      this.completion = data;
      return data;
    },
    async updateCompletion(params) {
      const data = await updateCompletion(params);
      this.completion = data;
      return data;
    },
    async getChapters({ courseId }) {
      const authStore = useAuthStore();
      const hubCourse = useHubCoursesStore();

      const { data: chapters } = await getChapters({
        courseId,
        limit: 100,
        version: this.getVersion(),
        cycleId: this.cycleId,
      });

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        hubCourse.formatChapter(chapter);
        chapter.numberOfLectures = chapter.lectures.length;
        chapter.loading = false;
        chapter.loaded = false;
        chapter.originalLectures = chapter.lectures;
        chapter.lectures = [];
      }

      this.course.chapters = chapters;

      // 加载第一章节
      await this.getLectures({
        courseId,
        chapterId: chapters[0].id,
        version: this.getVersion(),
        cycleId: this.cycleId,
      });

      // 加载url中的章节, 防止权限问题
      try {
        // 未登录不处理url的Lecture
        if (authStore.logged) {
          await this.routeLecture();
        }
      } catch (error) {
        console.error(error);
      }

      return chapters;
    },
    async routeLecture() {
      const route = useRoute();
      const chapters = this.course.chapters;
      const { lectureId, chapterId, videoId } = route.query;

      if (lectureId && chapterId) {
        // 假如lectureId和chapterId来自第一个章节的点播课程
        if (chapters[0]?.id === chapterId) {
          const lectureFromFirstChapter = chapters[0].lectures.find(
            (item) => item.id === lectureId,
          );
          if (lectureFromFirstChapter) {
            this.popup.state = false;
            this.chapter.state = true;
            this.chapter.index = 0;
            this.player.currentChapter = chapters[0];
            this.player.currentLecture = lectureFromFirstChapter;
            return;
          }
        }

        const lecture = await this.getLecture({
          courseId: this.course.id,
          chapterId,
          lectureId,
          version: this.getVersion(),
          cycleId: this.cycleId,
        });

        const chapter = chapters.find((item) => item.id === chapterId);

        this.player.currentLecture = lecture;
        this.player.currentChapter = chapter;

        if (videoId) {
          const video = lecture.videos.find((item) => item.fileId === videoId);
          const videoIndex = lecture.videos.findIndex(
            (item) => item.fileId === videoId,
          );
          this.player.currentLectureLivingRecording = {
            ...lecture,
            type: 'on-demand',
            _isLivingRecording: true, // 前端页面根据这个字段查找
            lectureId: lecture.id,
            id: videoId, // 用fileId代替lectureID
            duration: video.metadata.videoDuration,
            videos: [video],
            _totalParentVideos: lecture.videos.length,
            _videoIndex: videoIndex,
          };
        }

        this.popup.state = false;
        this.chapter.state = true;
        this.chapter.index = chapters.findIndex(
          (item) => item.id === chapterId,
        );
      }
    },
    async getLecture(params) {
      const hubCourse = useHubCoursesStore();
      const lecture = await getLecture(params);
      hubCourse.formatLecture(lecture);
      lecture.subject = this.courseSubjects.find(
        (item) => item.id === lecture.subjectId,
      );
      return lecture;
    },
    transformLectureWhenHasLivingRecord(lecture) {
      // 当lecture是直播并至少有1条回放记录时 转化此数据生成多个lecture
      const videos = lecture.videos;
      const data = videos.map((item, videoIndex) => {
        const _lecture = {
          ...lecture,
          type: 'on-demand',
          _isLivingRecording: true, // 前端页面根据这个字段查找
          lectureId: lecture.id,
          id: item.fileId, // 用fileId代替lectureID
          duration: item.metadata.videoDuration,
          _totalParentVideos: videos.length,
          _videoIndex: videoIndex,
        };
        _lecture.videos = [item];
        return _lecture;
      });
      return data;
    },
    buildLecturesDataWithExpand(lectures) {
      const hubCourse = useHubCoursesStore();
      const data = [];
      let offsetCount = 0;
      for (let i = 0; i < lectures.length; i++) {
        const lecture = lectures[i];
        hubCourse.formatLecture(lecture);
        if (lecture._isLivingRecording) {
          const target = data.find(
            (lecture) =>
              lecture.component &&
              lecture.component === 'CourseLectureExpand' &&
              lecture.lectureId === lecture.lectureId,
          );
          if (target) {
            target.lectures.push({ ...lecture, lectureIndex: i + 1 });
          } else {
            offsetCount++;
            data.push({
              _isGroup: true,
              component: 'CourseLectureExpand',
              lectures: [{ ...lecture, lectureIndex: i + 1 }],
              lectureId: lecture.lectureId,
              lectureIndex: i,
            });
          }
        } else {
          data.push({ ...lecture, lectureIndex: i + offsetCount });
        }
      }
      return data;
    },

    async getLectures({ courseId, chapterId }) {
      const hubCourse = useHubCoursesStore();

      const chapter = this.course.chapters.find(
        (item) => item.id === chapterId,
      );

      chapter.loading = true;

      const { data: lectures } = await getLectures({
        courseId,
        chapterId,
        limit: 100,
        version: this.getVersion(),
        cycleId: this.cycleId,
      });

      const data = [];
      for (let i = 0; i < lectures.length; i++) {
        const lecture = lectures[i];
        lecture.subject = this.courseSubjects.find(
          (item) => item.id === lecture.subjectId,
        );
        hubCourse.formatLecture(lecture);
        // lecture.subject = subject;
        if (
          lecture.type === 'live' &&
          lecture.videos.length >= 1 &&
          lecture.videos[0].fileId !== '' &&
          lecture.duration > 0
        ) {
          data.push(...this.transformLectureWhenHasLivingRecord(lecture));
        } else {
          data.push(lecture);
        }
      }

      if (chapter) {
        // chapter.lectures = lectures;
        chapter.lectures = this.buildLecturesDataWithExpand(data);
        chapter.loaded = true;
      }

      chapter.loading = false;
      chapter.loaded = true;
      // return lectures;
      return chapter.lectures;
    },
    async getSubjects(params) {
      const sanitizedSubjects = await Promise.all(
        this.courseSubjects
          .filter((subject) => subject.lecturesWithChapter?.length > 0)
          .map(async (subject) => {
            const groupedLectures = subject.lecturesWithChapter.reduce(
              (acc, lecture) => {
                if (!acc[lecture.chapterId]) {
                  acc[lecture.chapterId] = [];
                }
                acc[lecture.chapterId].push(lecture.lectureId);
                return acc;
              },
              {},
            );

            const validChapters = await Promise.all(
              this.course.chapters
                .filter((ch) => groupedLectures[ch.id])
                .map(async (courseChapter) => {
                  const lectureIds = groupedLectures[courseChapter.id];

                  courseChapter.lectures = await this.getLectures({
                    courseId: params.courseId,
                    chapterId: courseChapter.id,
                  });

                  const filteredLectures = courseChapter.lectures.filter(
                    (lecture) => lectureIds.includes(lecture.id),
                  );

                  const chapterDuration = filteredLectures.reduce(
                    (sum, lecture) => sum + (lecture.duration || 0),
                    0,
                  );

                  return {
                    ...courseChapter,
                    lectures: filteredLectures,
                    lecturesCount: filteredLectures.length,
                    duration: chapterDuration,
                  };
                }),
            );

            const lecturesCount = validChapters.reduce(
              (count, chapter) => count + chapter.lecturesCount,
              0,
            );
            const duration = validChapters.reduce(
              (sum, chapter) => sum + chapter.duration,
              0,
            );
            const chaptersCount = validChapters.length;

            return {
              ...subject,
              chapters: validChapters,
              chaptersCount,
              lecturesCount,
              duration,
            };
          }),
      );

      this.subjects = sanitizedSubjects;
      return sanitizedSubjects;
    },
    async getCategory(params) {
      const data = await getCategory(params);
      return data;
    },
    play(lecture) {
      const art = window['art'];
      const url = lecture.videos[0]?.url || '';

      if (!url) {
        throw new Error('No video found');
      }

      const poster = lecture.thumbnail?.url || '';
      const thumbnails = lecture.videos[0]?.metadata?.framingPath || '';

      art.switchUrl(url);
      art.poster = poster;

      if (thumbnails) {
        art.thumbnails = {
          url: thumbnails,
          number: 100,
          column: 10,
        };
      }

      art.once('video:canplay', () => {
        const completion = this.getLectureCompletion(lecture);
        if (completion) {
          art.seek = (completion / 100) * art.duration;
        }
        art.play();
      });
    },
    async refresh({ courseId }) {
      this.chapter.state = false;
      this.chapter.index = null;
      await this.getCourse({
        courseId,
      });
      await this.getChapters({
        courseId,
      });
    },
    async getReviews(params = {}) {
      this.review.loading = true;
      const { cursor, data } = await searchPosts({
        type: 'review',
        entityId: this.course.id,
        entityType: 'course',
        next: this.review.next,
        rating: this.review.rating || undefined,
        limit: 20,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        ...params,
      });
      this.review.data = data;
      this.review.cursor = cursor;
      this.review.loading = false;
      return data;
    },
    deleteReview(review) {
      const index = this.review.data.findIndex((item) => item.id === review.id);
      this.review.data.splice(index, 1);
      this.refreshReviews();
    },
    refreshReviews() {
      this.getReviews();
      if (this.course.id) {
        this.getCourse({
          courseId: this.course.id,
        });
      }
    },
    async getQuestions(params = {}) {
      this.question.loading = true;
      const { cursor, data } = await searchPosts({
        type: 'question',
        entityId: this.course.id,
        entityType: 'course',
        next: this.question.next,
        status: this.question.status || undefined,
        limit: 20,
        ...params,
      });
      this.question.data = data;
      this.question.cursor = cursor;
      this.question.loading = false;
      return data;
    },
    deleteQuestion(question) {
      const index = this.question.data.findIndex(
        (item) => item.id === question.id,
      );
      this.question.data.splice(index, 1);
      this.refreshQuestion();
    },
    refreshQuestion() {
      this.getQuestions();
      if (this.course.id) {
        this.getCourse({
          courseId: this.course.id,
        });
      }
    },
  },
});
