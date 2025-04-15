import {
  getCourses,
  searchCourses,
  getCoursesSkills,
  getCoursesLanguages,
} from '~/api/v2/course';
import {
  getIndustries,
  searchSkills,
  searchJobRole,
  searchDegrees,
  searchCountries,
  searchStates,
  searchCities,
} from '~/api/v2/global';
import { getOrganizations } from '~/api/v2/org';
import { searchProfile, getBrands } from '~/api/v2/profile';
import { searchPosts } from '~/api/v2/social';

export const useSearchStore = defineStore('search', {
  state: () => ({
    type: 'all',
    isFocus: false,
    skills: [],
    jobRoles: [],
    degrees: [],
    countries: [],
    brands: [],
    industries: [],
    coursesSkills: [],
    coursesLanguages: [],
    priceRange: {
      priceHistogram: [],
      maximum: 1000,
      columns: 50,
      step: 20,
      total: 19,
    },
    query: {
      title: '',
    },
  }),
  actions: {
    getCourses(params) {
      return getCourses(params);
    },
    searchProfile(params) {
      return searchProfile(params);
    },
    searchPosts(params) {
      return searchPosts(params);
    },
    getOrganizations(params) {
      return getOrganizations(params);
    },
    searchCourses(params) {
      return searchCourses(params);
    },
    async searchSkills() {
      const { data } = await searchSkills({
        limit: 0,
      });
      this.skills = data;
      return data;
    },
    async searchCoursesSkills(params = {}) {
      const skills = await getCoursesSkills({
        limit: 0,
        ...params,
      });
      this.coursesSkills = skills;
    },
    async searchCoursesLanguages(params = {}) {
      const languages = await getCoursesLanguages({
        limit: 0,
        ...params,
      });
      this.coursesLanguages = languages;
    },
    async searchJobRole() {
      const { data } = await searchJobRole({
        limit: 100,
      });
      this.jobRoles = data;
      return data;
    },
    async searchDegrees() {
      const { data } = await searchDegrees({
        limit: 0,
      });
      this.degrees = data;
      return data;
    },
    async searchCountries() {
      const { data } = await searchCountries({
        limit: 0,
      });
      const res = data
        .map((countryItem) => {
          if (['TW'].includes(countryItem.code.alpha2)) {
            return {
              ...countryItem,
              name: `${countryItem.name}, China`,
              name1: countryItem.name,
              alpha2: countryItem.code.alpha2,
              originAlpha2: countryItem.code.alpha2,
            };
          } else {
            return {
              ...countryItem,
              name1: countryItem.name,
              originAlpha2: countryItem.code.alpha2,
              alpha2:
                countryItem.code.alpha2 === 'GB'
                  ? 'UK'
                  : countryItem.code.alpha2,
            };
          }
        })
        .sort((prev, curr) =>
          prev.name.localeCompare(curr.name, 'en', { sensitivity: 'base' }),
        );
      this.countries = res;
      return data;
    },
    async searchStates(params) {
      const { data } = await searchStates({
        limit: 0,
        ...params,
      });
      return data;
    },
    async searchCities(params) {
      const { data } = await searchCities({
        limit: 0,
        ...params,
      });
      return data;
    },
    async getBrands() {
      const { data } = await getBrands({
        //
      });
      this.brands = data;
      return data;
    },
    async getIndustries() {
      const { data } = await getIndustries({
        limit: 0,
      });
      this.industries = data;
      return data;
    },
    async getPriceRange(params = {}) {
      const { histogram } = await searchCourses({
        histogram: true,
        ...params,
      });
      histogram.priceHistogram.shift();
      this.priceRange = histogram;
    },
  },
});
