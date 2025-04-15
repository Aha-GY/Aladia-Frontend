import {
  getIndustries,
  getCountries,
  searchCountries,
  getLanguages,
  searchSkills,
  searchDegrees,
  searchJobRole,
  searchStates,
} from '~/api/v2/global';
import { searchProfile } from '~/api/v2/profile';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    industryTypes: [],
    skills: [],
    languages: [],
    skillsNext: null,
    skillsLoadding: false,
    headerMenuPopup: false,
    editorLoading: false,
    routePath: '',
    editorLocationPickerVisible: false,
  }),
  actions: {
    async getIndustries(params) {
      const { data } = await getIndustries(params);
      this.industryTypes = data;
      return data;
    },
    async getCountries(params) {
      const data = await getCountries(params);
      return data;
    },
    async searchStates(params) {
      const data = await searchStates(params);
      return data;
    },
    async searchCountries(params) {
      const data = await searchCountries(params);
      return data;
    },
    async getLanguages() {
      const { data } = await getLanguages({
        limit: 0,
      });
      this.languages = data;
      return data;
    },
    async searchProfile(params) {
      const data = await searchProfile(params);
      return data;
    },
    async searchSkills(params) {
      this.skillsLoadding = true;
      const {
        cursor: { next },
        data,
      } = await searchSkills({ ...params, next: this.skillsNext });
      if (this.skillsNext) {
        this.skills.push(...data);
      } else {
        this.skills = data;
      }
      this.skillsNext = next;
      this.skillsLoadding = false;
      return data;
    },
    async searchDegrees(params) {
      const data = await searchDegrees(params);
      return data;
    },
    async searchJobRole(params) {
      const data = await searchJobRole(params);
      return data;
    },
  },
});
