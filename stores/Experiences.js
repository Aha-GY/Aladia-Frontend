import {
  createExperience,
  patchExperience,
  deleteExperience,
  searchExperience,
  getListExperience,
  retrieveExperience,
} from '~/api/v2/experiences';

export const useExperiencesStore = defineStore('experiences', {
  state: () => ({
    defaultExperienceParams: {
      id: '',
      name: '',
      degree: '',
      fieldOfStudy: '',
      authority: '',
      type: '',
      link: '',
      description: '',
      address: '',
      startDate: '',
      endDate: '',
      _startDate: {
        year: { label: '' },
        month: { label: '' },
      },
      _endDate: {
        year: { label: '' },
        month: { label: '' },
      },
      skills: [],
      isNow: false,
      jobType: { label: '' },
      contractType: { label: '' },
      brand: {
        name: '',
        domain: '',
        picture: '',
      },
      organization: { id: null },
    },
    experiences: [],
  }),
  actions: {
    isRightExperience(obj) {
      const commonVerify =
        !!obj._startDate?.month?.label &&
        !!obj._startDate?.year?.label &&
        !!obj.authority &&
        (obj.isNow
          ? true
          : !!obj._endDate?.month?.label && !!obj._endDate?.year?.label);
      if (obj.type === 'work') {
        return (
          !!obj.name &&
          !!obj.address &&
          !!obj.brand.domain &&
          !!obj.jobType?.label &&
          !!obj.contractType?.label &&
          commonVerify
        );
      }
      if (obj.type === 'study') {
        return (
          !!obj.degree && !!obj.fieldOfStudy && !!obj.address && commonVerify
        );
      }
      if (obj.type === 'certificate') {
        return !!obj.name && !!obj.link && commonVerify;
      }
    },
    async deleteExperience(params) {
      const data = await deleteExperience(params);
      return data;
    },
    async searchExperience(params) {
      const data = await searchExperience({
        ...params,
        limit: 0,
      });
      return data;
    },
    async getListExperience(id) {
      const profileStore = useProfileStore();
      const experienceId = id || profileStore.getPersonalProfileDetail().id;
      const data = await getListExperience({
        experienceId,
        limit: 0,
      });
      this.experiences = data.data;
      return data;
    },
    async retrieveExperience(params) {
      const data = await retrieveExperience(params);
      return data;
    },

    getFormatExperience(data) {
      const obj = data;
      const { type, id } = data;
      const startDateStr = `${obj._startDate.month.label} ${obj._startDate.year.label}`;
      const endDateStr = `${obj._endDate.month.label} ${obj._endDate.year.label}`;

      obj.startDate = new Date(startDateStr)?.toISOString();
      if (obj.isNow) {
        obj.endDate = undefined;
      } else {
        obj.endDate = new Date(endDateStr)?.toISOString();
      }

      const params = {
        skills: obj.skills,
        jobType: type === 'work' ? obj.jobType.label : undefined,
        contractType: type === 'work' ? obj.contractType.label : undefined,
        name: type === 'study' ? undefined : obj.name,
        degree: type === 'study' ? obj.degree : undefined,
        fieldOfStudy: type === 'study' ? obj.fieldOfStudy : undefined,
        link: type === 'certificate' ? obj.link : '',
        address: type === 'certificate' ? undefined : obj.address,
        startDate: obj.startDate,
        endDate: obj.endDate,
        description: obj.description,
        authority: obj.authority,
        brand: !obj.organization?.id ? obj.brand : null,
        organization: obj.organization?.id || null,
        type: id ? undefined : type,
        experienceId: id || undefined,
      };
      return params;
    },

    async handleUpdateExperience(data) {
      const params = this.getFormatExperience(data);
      const api = params.experienceId ? patchExperience : createExperience;
      await api(params);
    },

    handleDetailExperienceData(data) {
      const startDate = data?.startDate
        ? formatDate(data.startDate, 'YYYY MMMM').split(' ')
        : ['', ''];
      const endDate = data?.endDate
        ? formatDate(data.endDate, 'YYYY MMMM').split(' ')
        : ['', ''];
      const params = {
        ...data,
        jobType: data.jobType ? data.jobType : { label: '' },
        contractType: data.contractType ? data.contractType : { label: '' },
        _startDate: {
          year: { label: startDate[0] },
          month: { label: startDate[1] },
        },
        _endDate: {
          year: data.endDate ? { label: endDate[0] } : { label: '' },
          month: data.endDate ? { label: endDate[1] } : { label: '' },
        },
        isNow: !data.endDate,
      };
      if (data.type === 'work') {
        params.jobType = { label: data.jobType };
        params.contractType = { label: data.contractType };
      }
      return params;
    },
  },
});
