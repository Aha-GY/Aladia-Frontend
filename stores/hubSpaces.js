import { createCourse, getCompletions, leaveCourse } from '~/api/v2/course';
import { searchProfile } from '~/api/v2/profile';
import {
  getSpaces,
  getSpace,
  createSpace,
  updateSpace,
  deleteSpace,
  reorderSpace,
  previewSpace,
  getFolders,
  getFolder,
  deleteFolder,
  createFolder,
  updateFolder,
  searchFolders,
  reorderFolder,
  getCourses,
  moveCourse,
  removeCourseFromSpace,
  deleteCourseFromSpace,
  duplicateCourseInSpace,
  reorderCourse,
  addMember,
  acceptInvite,
  handleInvite,
  getInviteLink,
  inviteMembers,
  removeMember,
  updateMember,
  getMembers,
  searchMembers,
  searchPotentialMembers,
  leaveSpace,
  cancelInvite,
  checkMemberExists,
  assignLicense,
  removeLicense,
  getSpaceOverview,
  assignLicenseToMembers,
} from '~/api/v2/space';

export const useHubSpacesStore = defineStore('hubSpaces', {
  state: () => ({
    filter: 'all',
    editCourse: false,
    editCourseField: '',
    previewCourse: false,

    newSpace: false,
    newFolder: false,
    newCourse: false,

    leaveSpace: false,
    leaveCourse: false,

    deleteSpace: false,
    deleteFolder: false,
    deleteCourse: false,
    deleteSubject: false,

    removeCourse: false,
    duplicateCourse: false,
    currentFolder: null,

    editFolder: false,
    editSpace: false,
    editCostumize: false,

    teaching: false,
    learning: false,
    dragLeft: '50%',
    dragTop: '50%',
    isDraging: false,
    isSelecting: false,
    isTmpCheck: false,
    isDroping: false,
    isCollapse: false,
    collapseId: null,
    dropLayout: '', // list, grid, sidebar
    spaces: [],
    spacesExpand: [],
    completions: [],
    statistics: {
      expand: true,
      startDate: undefined,
      endDate: undefined,
      ai: {
        increase: 0,
        timeline: [],
        total: 0,
      },
      storage: {
        increase: 0,
        timeline: [],
        total: 0,
      },
      streaming: {
        increase: 0,
        timeline: [],
        total: 0,
      },
      billings: [],
    },
  }),
  getters: {
    checkeds() {
      const result = [];
      this.recursion((item) => {
        if (item._state === 'checked') {
          result.push(item);
        }
      });
      return result;
    },
    checkedsClear() {
      return getCheckedNodes(this.spaces);
    },
  },
  actions: {
    recursion(callback) {
      for (let i = 0; i < this.spaces.length; i++) {
        const space = this.spaces[i];
        callback(space, 'space');
        callback(space.rootFolder, 'folder');
        for (let j = 0; j < space.folders.length; j++) {
          const folder = space.folders[j];
          callback(folder, 'folder');
          for (let k = 0; k < folder.courses.length; k++) {
            const course = folder.courses[k];
            callback(course, 'course');
          }
        }
        for (let k = 0; k < space.courses.length; k++) {
          const course = space.courses[k];
          callback(course, 'course');
        }
      }
    },
    uncheck() {
      this.recursion((item) => {
        item._state = 'unchecked';
      });
    },
    find(id) {
      let result = null;
      this.recursion((item) => {
        if (item.id === id) {
          result = item;
        }
      });
      return result;
    },
    checkCourseEditable(course) {
      const authStore = useAuthStore();
      return (
        course.owner?.id === authStore.context ||
        course.createdBy === authStore.context
      );
    },
    formatSpace(space) {
      const authStore = useAuthStore();
      const old = this.find(space.id);

      space._type = 'space';
      space._state = old?._state || 'unchecked';
      space._isOwner = space.owner?.id === authStore.context;

      space.folders = old?.folders || [];
      space.courses = old?.courses || [];
      space.members = old?.members || [];

      space.rootFolder._root = true;
      space.rootFolder._type = 'folder';
      space.rootFolder._spaceId = space.id;
      space.rootFolder._state = space._state;
      return space;
    },
    formatFolder({ folder, spaceId }) {
      const old = this.find(folder.id);
      folder.originalCourses = folder.courses || [];
      folder._type = 'folder';
      folder._state = old?._state || 'unchecked';
      folder._spaceId = spaceId;
      folder.courses = old?.courses || [];
      return folder;
    },
    formatCourse({ course, spaceId, folderId }) {
      const authStore = useAuthStore();
      const old = this.find(course.id);
      course._type = 'course';
      course._state = old?._state || 'unchecked';
      course._spaceId = spaceId;
      course._folderId = folderId;
      course._isOwner = course.owner?.id === authStore.context;
      return course;
    },
    async searchProfile(params) {
      const data = await searchProfile(params);
      return data;
    },
    async getSpaces(params = {}) {
      const { data } = await getSpaces({
        limit: 100,
        ...params,
      });

      for (let index = 0; index < data.length; index++) {
        this.formatSpace(data[index]);
      }

      this.spaces = data;
      return data;
    },
    async getSpace({ spaceId }) {
      const space = await getSpace({ spaceId });
      return this.formatSpace(space);
    },
    async createSpace(params) {
      const space = await createSpace(params);
      return this.formatSpace(space);
    },
    async updateSpace(params) {
      const space = await updateSpace(params);
      return this.formatSpace(space);
    },
    async removeSpace(params) {
      const data = await deleteSpace(params);
      return data;
    },
    async reorderSpace(params) {
      const data = await reorderSpace(params);
      return data;
    },
    async previewSpace(params) {
      const { data } = await previewSpace(params);
      return data;
    },
    async createFolder(params) {
      const data = await createFolder(params);
      return data;
    },
    async getFolders({ spaceId }) {
      const space = this.find(spaceId);
      const { data } = await getFolders({
        spaceId,
        limit: 100,
        sortBy: 'createdAt',
        sortDirection: 'desc',
      });

      for (let index = 0; index < data.length; index++) {
        const folder = data[index];
        this.formatFolder({ folder, spaceId });
      }

      space.folders = data;
      return data;
    },
    async removeFolder(params) {
      const data = await deleteFolder(params);
      return data;
    },
    async getFolder(params) {
      const data = await getFolder(params);
      return data;
    },
    async updateFolder(params) {
      const data = await updateFolder(params);
      return data;
    },
    async searchFolders(params) {
      const { data } = await searchFolders(params);
      return data;
    },
    async reorderFolder(params) {
      const data = await reorderFolder(params);
      return data;
    },
    async inviteMembers(params) {
      const data = await inviteMembers(params);
      return data;
    },
    async getCourses({ spaceId, folderId }) {
      const space = this.find(spaceId);
      const folder = this.find(folderId);
      if (folderId && !folder) {
        throw new Error(`Folder with ID ${folderId} not found`);
      }

      const { data } = await getCourses({ spaceId, folderId, limit: 100 });

      for (let index = 0; index < data.length; index++) {
        const course = data[index];
        this.formatCourse({ course, spaceId, folderId });
      }

      if (folderId === space.rootFolder.id) {
        space.courses = [...data];
      } else {
        folder.courses = [...data];
      }

      return data;
    },
    async createCourse(params) {
      const data = await createCourse(params);
      return data;
    },
    async moveCourse(params) {
      const data = await moveCourse(params);
      return data;
    },
    async deleteCourseFromSpace(params) {
      const data = await deleteCourseFromSpace(params);
      return data;
    },
    async removeCourseFromSpace(params) {
      const data = await removeCourseFromSpace(params);
      return data;
    },
    async duplicateCourseInSpace(params) {
      const data = await duplicateCourseInSpace(params);
      return data;
    },
    async updateMember(params) {
      const data = await updateMember(params);
      return data;
    },
    async reorderCourse(params) {
      const data = await reorderCourse(params);
      return data;
    },
    async addMember(params) {
      const data = await addMember(params);
      return data;
    },
    async removeMember(params) {
      const data = await removeMember(params);
      return data;
    },
    async searchMembers(params) {
      const data = await searchMembers(params);
      return data;
    },
    async getMembers(params) {
      if (params.roles || params.username) {
        const data = await searchMembers(params);
        return data;
      } else {
        const data = await getMembers(params);
        return data;
      }
    },
    async searchPotentialMembers(params) {
      const data = await searchPotentialMembers(params);
      return data;
    },
    async getInviteLink(params) {
      const data = await getInviteLink(params);
      return data;
    },
    async handleInvite(params) {
      const data = await handleInvite(params);
      return data;
    },
    async acceptInvite(params) {
      const data = await acceptInvite(params);
      return data;
    },
    async getCompletions(params) {
      const { data } = await getCompletions(params);
      this.completions = data;
      return data;
    },
    async getSpaceOverview(params) {
      const data = await getSpaceOverview({
        ...params,
        startDate: this.statistics.startDate,
        endDate: this.statistics.endDate,
      });
      this.statistics = {
        ...this.statistics,
        ...data,
      };
      return data;
    },
    async setLeaveCourse(params) {
      const data = await leaveCourse(params);
      return data;
    },
    async setLeaveSpace(params) {
      const data = await leaveSpace(params);
      return data;
    },
    async cancelInvite(params) {
      const data = await cancelInvite(params);
      return data;
    },
    async checkMemberExists(params) {
      const data = await checkMemberExists(params);
      return data;
    },
    async assignLicense(params) {
      const data = await assignLicense(params);
      return data;
    },
    async assignLicenseToMembers(params) {
      const data = await assignLicenseToMembers(params);
      return data;
    },
    async removeLicense(params) {
      const data = await removeLicense(params);
      return data;
    },
    addVirtualCourse(course, _folderId) {
      const route = useRoute();

      // 查询spaceId
      const spaceId = route.query.space || course.spaceId;
      const space = this.find(spaceId);

      // 指定folderId/二级目录/根目录
      const folderId =
        _folderId ||
        this.currentFolder ||
        route.query.folder ||
        space?.rootFolder?.id;
      const folder = this.find(folderId);

      course._type = 'course';
      course._state = 'unchecked';
      course._spaceId = spaceId;
      course._folderId = folderId;

      if (folderId === space?.rootFolder.id) {
        space.courses.push(course);
      } else {
        folder.courses.push(course);
      }
      this.currentFolder = null;
      // 刷新空间列表
      this.getSpaces();
    },
  },
});
