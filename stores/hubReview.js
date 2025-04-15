import {
  getQuestionsReviewsRating,
  getQuestionsReviewsRanking,
  getQuestionsReviewsOverview,
} from '@/api/v2/analytics';
import { searchPosts } from '@/api/v2/social';

export const useHubReviewStore = defineStore('review', {
  state: () => ({
    courseLoading: false,
    course: {},

    index: 0,
    open: true,
    selects: [],

    courseId: null,
    reviewType: 'Total',

    reviewFilter: 'all',
    reviewFilterHover: 'all',
    reviewsLoading: false,
    reviewsRetingLoading: false,
    reviewsRankingLoading: false,
    reviewsReviewLoading: false,
    reviews: {
      reviews: [],
      rating: {
        average: 0,
        rateCount: {},
      },
      overview: {
        total: 0,
        positive: 0,
        negative: 0,
      },
    },

    loading: false,
    total: 0,
    reviews2: [],
    params: {
      type: 'review',
      name: '',
      fromName: '',
      role: '',
      status: '',
      rates: [],
    },
  }),
  getters: {
    tableQuery() {
      const payload = {};
      if (this.courseId) {
        payload.entityId = this.courseId;
        payload.entityType = 'course';
      }
      if (this.reviewFilter !== 'all') {
        payload.rating = Number(this.reviewFilter);
      }

      return { ...payload };
    },
  },
  actions: {
    async getPosts(params = {}) {
      this.loading = true;
      const data = await searchPosts({
        type: 'review',
        limit: 20,
        ...params,
      });
      this.reviews2 = data.data;
      this.loading = false;
      return data;
    },
    async getReviewsRating() {
      this.reviewsRetingLoading = true;
      try {
        const { average, percentages } = await getQuestionsReviewsRating();
        this.reviews.rating.average = average;
        this.reviews.rating.rateCount = percentages;
        return { average, percentages };
      } finally {
        this.reviewsRetingLoading = false;
      }
    },
    async getReviewsRank() {
      this.reviewsRankingLoading = true;
      try {
        const data = await getQuestionsReviewsRanking();
        this.reviews.reviews = data?.courses || [];
        return data;
      } finally {
        this.reviewsRankingLoading = false;
      }
    },
    async getReviewOverview() {
      this.reviewsReviewLoading = true;
      try {
        const { total, categories } = await getQuestionsReviewsOverview();
        this.reviews.overview.total = total;
        this.reviews.overview.positive = categories.positive;
        this.reviews.overview.negative = categories.negative;
        return { total, categories };
      } finally {
        this.reviewsReviewLoading = false;
      }
    },
  },
});
