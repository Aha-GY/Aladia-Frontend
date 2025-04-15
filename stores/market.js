import { getCategories } from '~/api/v2/category';
import { getCourses, getCompletions, searchCourses } from '~/api/v2/course';
import { getOrganizations } from '~/api/v2/org';
import { searchProfile } from '~/api/v2/profile';

export const useMarketStore = defineStore('market', {
  state() {
    return {
      subCategory: null,
      categories: [],
      categoryActive: 0,
      categoriesLoading: true,
      subCategories: [],
      subCategoriesLoading: true,
      subCategoriesOpen: false,
      courses: [],
      coursesLoading: true,
      category: {},
      categoryLoading: true,
      floatUrl: null,
      floatType: null,
      floatCourse: null,
      floatElement: null,
      floatVideo: null,
      floatRect: {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      },
      common: {
        loading: true,
        continue: [],
        top: [],
        popular: [],
        instructors: [],
        video: [],
        new: [],
        suggested: [],
        organizations: [],
      },
      completions: [],
    };
  },
  actions: {
    async getCategories(params = {}) {
      this.categoriesLoading = true;
      const { data: categories } = await getCategories({
        limit: 100,
        ...params,
      });

      for (let index = 0; index < categories.length; index++) {
        const category = categories[index];
        category.subCategories = [];
        category.loaded = false;
        category.index = index;
      }

      this.categories = categories;
      this.categoriesLoading = false;
      return categories;
    },
    async getSubCategories({ parentId }) {
      const category = this.categories.find((item) => item.id === parentId);
      if (category?.loaded) {
        return;
      }

      this.subCategoriesLoading = true;
      const { data: subCategories } = await getCategories({
        parentId,
        limit: 100,
      });

      if (category) {
        category.loaded = true;
        category.subCategories = subCategories;
      }

      this.subCategoriesLoading = false;
      return subCategories;
    },
    async getCommonCarousel() {
      const authStore = useAuthStore();
      this.common.loading = true;

      const result = await Promise.all([
        // 0.Continue Watching
        authStore.logged
          ? searchCourses({
              limit: 16,
              continueWatching: true,
              profileId: authStore.context,
            })
          : { data: [] },
        // 1.Top 10 Today ???
        getCourses({
          limit: 10,
          sortBy: 'purchases',
        }),
        // 2.Most Popular
        getCourses({
          limit: 16,
          sortBy: 'purchases',
        }),
        // 3.Top Instructors
        searchProfile({
          limit: 16,
          type: 'teacher',
          featuredUsers: true,
        }),
        // 4.Video Carousel ???
        getCourses({
          limit: 16,
          sortBy: 'review.globalRating',
        }),
        // 5.New Courses
        getCourses({
          limit: 16,
          sortBy: 'createdAt',
          sortDirection: 'desc',
        }),
        // 6.Suggested Users
        searchProfile({
          limit: 16,
          featuredUsers: true,
        }),
        // 7.Organizations
        getOrganizations({
          limit: 16,
          topOrganizations: true,
        }),
      ]);

      this.common.continue = result[0].data;
      this.common.top = result[1].data;
      this.common.popular = result[2].data;
      this.common.instructors = result[3].data;
      this.common.video = result[4].data;
      this.common.new = result[5].data;
      this.common.suggested = result[6].data;
      this.common.organizations = result[7].data;
      this.common.loading = false;
      return this.common;
    },
    async searchCourses(params) {
      this.coursesLoading = true;

      if (!params.next) {
        this.courses = [];
      }

      const res = await searchCourses(params);

      if (params.next) {
        this.courses.push(...res.data);
      } else {
        this.courses = res.data;
      }

      this.coursesLoading = false;
      return res;
    },
    async searchCoursesByCategory({ parentId, ...params }) {
      const route = useRoute();

      const res = await getCategories({
        parentId,
        ...params,
      });

      // 如果当前分类不是当前路由的分类，直接返回
      if (parentId !== route.query.categoryId) {
        return;
      }

      return res;
    },
    async getCompletions(params) {
      const { data } = await getCompletions(params);
      this.completions = data;
      return data;
    },
  },
});
