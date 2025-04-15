import {
  getQuestionsOverview,
  getQuestionsActivity,
  getQuestionsSolvingRate,
} from '@/api/v2/analytics';
import { searchPosts } from '@/api/v2/social';

export const useHubQaStore = defineStore('hubQa', {
  state: () => ({
    globalHighlight: null,
    activityType: 'general',
    view: 'list',
    open: true,

    widgetLoading: false,
    global: {
      solved: 0,
      answered: 0,
      notAnswered: 0,
      answeredByTeacher: 0,
    },
    activity: {
      questions: 0,
      answers: 0,
      solvedQuestions: 0,
      bestAnswers: 0,
    },
    solving: {
      solved: 0,
      solvingRate: [],
      increase: 0,
    },

    domain: '', // my-courses, feed, bought-courses
    filter: 'all', // all, my-question, answered-by-me, community-question
    questionsLoading: false,
    questions: {
      cursor: {},
      data: [],
    },
  }),
  actions: {
    async getPosts(params = {}) {
      const authStore = useAuthStore();
      this.questionsLoading = true;

      const query = {};

      if (this.domain === 'feed') {
        if (this.filter === 'all') {
          query.ownerId = authStore.context;
          query.filter = 'all';
          query.groupBy = 'feed';
        }
        if (this.filter === 'my-question') {
          query.ownerId = authStore.context;
          query.groupBy = 'feed';
        }
        if (this.filter === 'answered-by-me') {
          query.filter = 'answered-by-me';
          query.groupBy = 'feed';
          query.ownerId = authStore.context;
        }
      }

      if (this.domain === 'bought-courses') {
        if (this.filter === 'all') {
          query.ownerId = authStore.context;
          query.groupBy = 'purchased-course';
          query.filter = 'all';
        }
        if (this.filter === 'my-question') {
          query.ownerId = authStore.context;
          query.groupBy = 'purchased-course';
        }
        if (this.filter === 'answered-by-me') {
          query.groupBy = 'purchased-course';
          query.filter = 'answered-by-me';
          query.ownerId = authStore.context;
        }
      }

      if (this.domain === 'my-courses') {
        if (this.filter === 'all') {
          query.groupBy = 'owned-course';
          query.filter = 'all';
          query.ownerId = authStore.context;
        }
        if (this.filter === 'my-question') {
          query.ownerId = authStore.context;
          query.groupBy = 'owned-course';
        }
        if (this.filter === 'answered-by-me') {
          query.groupBy = 'owned-course';
          query.filter = 'answered-by-me';
          query.ownerId = authStore.context;
        }
        if (this.filter === 'community-question') {
          query.groupBy = 'owned-course';
          query.filter = 'community-question';
          query.ownerId = authStore.context;
        }
      }

      const data = await searchPosts({
        type: 'question',
        limit: 20,
        ...query,
        ...params,
      });

      this.questions = data;
      this.questionsLoading = false;
      return data;
    },
    async getQuestionsOverview(params = {}) {
      const data = await getQuestionsOverview({
        userId: useAuthStore().context,
        ...params,
      });
      this.global = data;
      return data;
    },
    async getQuestionsActivity(params = {}) {
      const data = await getQuestionsActivity(params);
      this.activity = data;
      return data;
    },
    async getQuestionsSolvingRate(params = {}) {
      const data = await getQuestionsSolvingRate(params);
      this.solving = data;
      return data;
    },
  },
});
