import WebSocketService from '~/utils/websocket';

export const useAppStore = defineStore('app', {
  state: () => ({
    splash: false,
    onlines: {},
  }),
  actions: {
    checkOnline() {
      const websocket = WebSocketService.getInstance();
      websocket.on('broadcast', (res) => {
        if (!res || !res.data) {
          return;
        }
        const { userId, online } = res.data;
        this.onlines[userId] = online;
      });
    },
  },
});
