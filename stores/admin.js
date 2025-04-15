import {
  coursesSearchVerifying,
  reviewCourse,
  searchBlockedUsers,
  getListAllModerationsContentGivenUser,
  unblockUser,
} from '~/api/v2/admin';

export const useAdminStore = defineStore('admin', {
  state: () => ({}),
  actions: {
    async getCoursesSearchVerifying(params) {
      const data = await coursesSearchVerifying(params);
      return data;
    },

    async reviewCourse(params) {
      const data = await reviewCourse(params);
      return data;
    },

    async unblockUser(params) {
      const data = await unblockUser(params);
      return data;
    },

    async getContentModeration(params) {
      const data = await searchBlockedUsers(params);
      for (const item of data.data) {
        item._tableList = [];
      }
      return data;
    },

    async getListAllModerationsContentGivenUser(params) {
      const data = await getListAllModerationsContentGivenUser(params);
      return data;
    },
  },
});
