import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '~/api/v2/category';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    //
  }),
  actions: {
    async getCategories(params) {
      const data = await getCategories(params);
      return data;
    },
    async createCategory(params) {
      const data = await createCategory(params);
      return data;
    },
    async updateCategory(params) {
      const data = await updateCategory(params);
      return data;
    },
    async deleteCategory(params) {
      const data = await deleteCategory(params);
      return data;
    },
  },
});
