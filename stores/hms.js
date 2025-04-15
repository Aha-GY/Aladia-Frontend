import { getAuthToken } from '~/api/v2/100ms';
import { getEventAuthToken, updateEvent } from '~/api/v2/event';
import { hmsStore, hmsSelectors } from '~/utils/hms';

export const useHmsStore = defineStore('hms', {
  state: () => ({
    meet: {},
    course: null,

    pollId: null,
    openPopup: '',
    settingOpen: '',
    pinId: null,
    spotlightId: null,
    screenTrackId: null,

    pdfConfig: null,

    showPIP: false,

    end: {
      show: false,
      disconnect: false,
    },

    users: {
      host: null,
      'co-host': null,
      guest: null,
    },

    dialog: {
      hls: false,
      stophls: false,
      pdf: false,
      disconnect: false,
      share: false,
      mute: {
        open: false,
        data: {},
      },
    },

    notifications: {
      peerJoined: false,
      peerLeave: false,
      handRaised: false,
      error: true,
    },
    layout: {
      mirrorLocalVideo: true,
      onlyAudio: false,
      hideLocalVideo: false,
      maxTileCount: 49,
      view: 'Tiled',
      hideWithoutVideo: false,
    },

    hmsLocalPeer: null,
    hmsAllPeers: [],
    hmsIsConnectedToRoom: null,
    hmsRoomState: null,
    hmsIsLocalAudioEnabled: null,
    hmsIsLocalVideoEnabled: null,
    hmsMessages: [],
    hmsDevices: [],
    hmsLocalMediaSettings: null,
    hmsIsLocalScreenShared: null,
    hmsIsSomeoneScreenSharing: null,
    hmsPeerScreenSharing: null,
    hmsPeersScreenSharing: [],
    hmsRoleNames: [],
    hmsHLSState: null,
    hmsWhiteboard: null,
    hmsPermissions: {},
    hmsSpeakers: [],
    hmsPolls: [],
    hmsHandRaisedPeers: [],
  }),
  getters: {
    hmsPeers() {
      // return this.hmsAllPeers;
      return uniqBy(this.hmsAllPeers, 'customerUserId');
    },
  },
  actions: {
    // This will trigger a callback anytime the store changes
    initialiseSubscribe() {
      for (const selectorName in hmsSelectors) {
        // we set the initial values
        hmsStore.subscribe((value) => {
          this.updateHmsSelector(value, selectorName);
        }, hmsSelectors[selectorName]);
      }
    },
    updateHmsSelector(value, selector) {
      const parsedValue = value ? JSON.parse(JSON.stringify(value)) : undefined;
      this[selector] = parsedValue;
    },
    async getAuthToken(params) {
      const route = useRoute();
      const user = useAuthStore().user;
      this.meet = { ...user, link: route.fullPath };
      const data = await getAuthToken(params);
      this.meet = { ...user, ...data, link: route.fullPath };
      return data;
    },
    async getEventAuthToken(params) {
      const route = useRoute();
      const user = useAuthStore().user;
      const data = await getEventAuthToken(params);
      this.meet = { ...user, ...data, link: route.fullPath };
      return data;
    },
    async updateEvent(params) {
      const data = await updateEvent(params);
      return data;
    },
  },
});
