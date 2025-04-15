import { getOrgMembersMap } from '~/api/v2/org';

export const useOrgStore = defineStore('org', {
  state: () => ({
    membersMapData: { sites: [], members: [] },
  }),
  getters: {
    mapSites(state) {
      return state.membersMapData.sites || [];
    },
    mapMembers(state) {
      return state.membersMapData.members || [];
    },
  },
  actions: {
    async getMembersMap(params) {
      try {
        const data = await getOrgMembersMap(params);
        this.membersMapData = data;
        return data;
      } finally {
        // do something
      }
    },
  },
});
