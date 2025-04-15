<template>
  <div
    v-if="openModal"
    class="fixed left-0 top-0 z-[1000] flex h-screen w-screen flex-col justify-center bg-black/60"
  >
    <MeetNotificationAutoPlayError :on-close="closeModal" />
  </div>
</template>

<script>
import {
  HMSNotificationTypes,
  selectSessionStore,
} from '@100mslive/hms-video-store';

import { hmsNotifications, hmsStore, hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      openModal: false,
      unsub: null,
    };
  },
  computed: {
    notifications() {
      return this.hmsStore.notifications;
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    if (this.unsub) {
      this.unsub();
    }
  },
  methods: {
    init() {
      this.unsub = hmsNotifications.onNotification((notification) => {
        const data = notification.data;
        const code = data?.code;
        switch (notification.type) {
          case HMSNotificationTypes.PEER_JOINED:
            if (
              data.customerUserId === this.hmsLocalPeer.customerUserId &&
              data.id !== this.hmsLocalPeer.id &&
              this.hmsStore.hmsIsConnectedToRoom
            ) {
              hmsActions.leave();
              this.hmsStore.end.show = true;
              this.hmsStore.openPopup = '';
              return;
            }
            if (this.notifications.peerJoined) {
              this.$toast.info(
                this.$t('meet.actions.joined', {
                  name: notification.data.name,
                }),
                {
                  icon: 'fa-solid fa-user-plus',
                },
              );
            }
            break;
          case HMSNotificationTypes.PEER_LEFT:
            if (this.notifications.peerLeave) {
              this.$toast.warning(
                this.$t('meet.actions.left', {
                  name: notification.data.name,
                }),
                {
                  icon: 'fa-solid fa-user-minus',
                },
              );
            }
            break;
          case HMSNotificationTypes.DEVICE_CHANGE_UPDATE:
            // this.$toast.info(notification.message);
            break;
          case HMSNotificationTypes.ERROR:
            console.log('error received ', data);
            if (!this.notifications.error) {
              return;
            }
            if (data.isTerminal) {
              this.hmsStore.end.show = true;
              // hmsActions.leave();
              // this.hmsStore.dialog.disconnect = true; // 断开连接时弹窗
              // this.$toast.error(
              //   `Error, you're disconnected: ${error.message}: ${error.description}`,
              //   {
              //     timeout: false,
              //   },
              // );
            } else if ([3001, 3011].includes(code)) {
              // device permission error
              const isSystemError = code === 3011; // there are two types - system denied permission or user denied permission
              const isScreenShare = data.message.includes('screen');
              const action = isSystemError
                ? this.$t('meet.actions.permission.system')
                : this.$t('meet.actions.permission.browser');
              if (isSystemError || !isScreenShare) {
                // screenshare user denied permission is pretty obvious(user clicks cancel), don't show it
                this.$toast.error(`${data.message} => ${action}`);
              }
            } else if (code === 3008) {
              // autoplay error
              this.openModal = true;
            } else {
              if (data.source === 'screen') {
                const shareIds = hmsStore.getState(
                  selectSessionStore('shareIds'),
                );
                hmsActions.sessionStore.set(
                  'shareIds',
                  shareIds.filter((id) => id !== this.hmsLocalPeer.id),
                );
              }
              this.$toast.error(
                this.$t('meet.actions.permission.error', {
                  error: `${data.message}: ${data.description}`,
                }),
              );
            }
            break;
          case HMSNotificationTypes.RECONNECTING:
            this.$toast.warning(this.$t('meet.actions.internet.reconnecting'));
            break;
          case HMSNotificationTypes.RECONNECTED:
            this.$toast.success(this.$t('meet.actions.internet.reconnected'));
            break;
          case HMSNotificationTypes.NEW_MESSAGE:
            // if (this.notifications.newMessage) {
            //   const data = notification.data;
            //   const toastStr = `<strong>Message from ${data.senderName}:</strong><br>${data.message}`;
            //   this.$toast.info(toastStr);
            // }
            break;
          case HMSNotificationTypes.HAND_RAISE_CHANGED:
            if (this.notifications.handRaised) {
              const peer = notification.data;
              const isHandRaised = peer.isHandRaised;
              if (isHandRaised && !peer.isLocal) {
                this.$toast.info(
                  this.$t('meet.actions.hand.raise', {
                    name: peer.name,
                  }),
                  {
                    icon: 'fa-solid fa-hand-paper',
                  },
                );
              }
            }
            break;
          case HMSNotificationTypes.POLL_STARTED:
            this.$toast.info(
              this.$t('meet.actions.started', { dataType: data.type }),
              {
                onClick: () => {
                  this.hmsStore.pollId = notification.data.id;
                  this.hmsStore.openPopup = data.type;
                },
              },
            );
            break;
          case HMSNotificationTypes.CHANGE_MULTI_TRACK_STATE_REQUEST:
          case HMSNotificationTypes.CHANGE_TRACK_STATE_REQUEST:
            if (data.enabled) {
              let type = '';
              if (data?.tracks) {
                type = data?.tracks[0]?.type;
              } else if (data?.track) {
                type = data?.track?.type;
              }
              // Ask for consent using dialog or any other appropriate UI
              // await hmsActions.setEnabledTrack(track.id, enabled);
              this.hmsStore.dialog.mute.open = true;
              this.hmsStore.dialog.mute.data = {
                name: data.requestedBy.name,
                type,
              };
            } else {
              let type = '';
              if (data?.tracks) {
                type = data?.tracks[0]?.type;
              } else if (data?.track) {
                type = data?.track?.type;
              }
              // Mute Request
              this.$toast.warning(
                this.$t('meet.actions.mute.request', {
                  requestedBy: data.requestedBy.name,
                  type,
                }),
              );
            }
            break;
        }
      });
    },
    closeModal() {
      this.openModal = false;
    },
  },
};
</script>
