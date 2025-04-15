import {
  createSubject,
  deleteSubject,
  getSubjects,
  getSubject,
  updateSubject,
  assignSubjects,
  unassignSubjects,
} from '~/api/v2/subject';

export const useHubSubjectStore = defineStore('hubSubject', {
  state: () => ({
    isEdit: false,
    isPreview: false,

    activeSubject: '',
    deleting: false,
    loading: false,
    addNewSubject: false,
    subjectPopup: false,
    isTeacherPoup: false,
    selectedTeachers: [],
    courseMembers: [], // it is better to fetch all members and select from this for subject teachers

    detail: {
      id: '',
      courseId: '',
      spaceId: null,
      subjects: [],
    },
  }),

  actions: {
    async createSubject(params) {
      const data = await createSubject(params);
      this.detail.subjects.push(data);
      return data;
    },

    async updateSubject(params) {
      const data = await updateSubject(params);
      this.detail.subjects = this.detail.subjects.map((subject) => {
        if (subject.id === data.id) {
          return { ...subject, ...data };
        }
        return subject;
      });
      return data;
    },

    async getSubject(params) {
      const data = await getSubject({
        version: params.version ? params.version : 'latest',
        ...params,
      });
      return data;
    },

    async getSubjects(params) {
      const { data } = await getSubjects({
        version: params.version ? params.version : 'latest',
        limit: params.limit ? params.limit : 100, // we need to fetch all for now we keep it till the api support it
        ...params,
      });
      this.detail.subjects = data;
      return data;
    },

    async deleteSubject(params) {
      const data = await deleteSubject(params);
      this.detail.subjects = this.detail.subjects.filter(
        (subject) => subject.id !== params.subjectId,
      );
      return data;
    },

    async assignSubjects(params) {
      const data = await assignSubjects(params);
      return data;
    },

    async unassignSubjects(params) {
      const data = await unassignSubjects(params);
      return data;
    },
  },
});
