<template>
  <div
    class="flex w-full items-center justify-center gap-12 transition-all"
    :class="
      width <= 1120 || $device.isMobile
        ? 'min-w-[22.5rem] max-w-[33rem] flex-col px-4'
        : 'px-9'
    "
  >
    <div
      ref="box"
      class="flex flex-col items-end"
      :class="
        width <= 1120 || $device.isMobile
          ? 'w-full'
          : 'w-0 max-w-[51.5rem] flex-1'
      "
    >
      <div
        class="relative flex items-center justify-center overflow-hidden rounded-5 bg-[#202020]"
        :style="{ height: `${peerH}px`, width: `${peerW}px` }"
      >
        <MeetPeer v-if="hmsLocalPeer" :peer="hmsLocalPeer" :is-join="true" />
      </div>
      <div
        class="mt-2 flex h-10 items-center justify-center gap-5"
        :style="{ width: `${peerW}px` }"
      >
        <client-only>
          <LazyMeetAudioSettings />
        </client-only>
        <MeetVideoSettings />
        <LazyMeetVirtualBackground v-if="hmsStore.hmsIsLocalVideoEnabled" />
        <div v-else class="h-7 w-7" />
      </div>
    </div>

    <div
      class="flex flex-col gap-4"
      :class="width <= 1120 || $device.isMobile ? 'w-full' : ''"
    >
      <div
        v-if="!noProfile"
        class="flex flex-col items-center gap-2 rounded-5 bg-[#0D0D0D] px-2 py-4 text-center"
        :class="width <= 1120 || $device.isMobile ? 'w-full' : 'w-[28rem]'"
      >
        <div v-if="eventLoading" class="text-base">
          {{ $t('meet.beReady.label') }}
        </div>
        <div v-if="eventLoading" class="text-xs text-[#707070]">
          {{ $t('meet.beReady.description') }}
        </div>

        <i
          v-if="eventLoading"
          class="fa-light fa-spinner animate-spin text-base"
        />
        <div
          v-if="!eventLoading"
          class="max-w-[13.625rem] text-base text-white"
        >
          {{ meet.eventName }}
        </div>
        <!-- <div class="text-base leading-5 text-white">
          {{ $t('meet.file.upload') }}
        </div> -->
        <div v-if="!eventLoading" class="h-7 text-xs text-[#707070]">
          <span class="text-nowrap font-semibold">
            {{ $t('meet.join.start') }}&nbsp;
          </span>
          {{ $t('meet.join.content') }}
        </div>

        <div v-if="!eventLoading" class="flex flex-col gap-2">
          <div class="flex w-full items-center justify-center pl-1.5">
            <BaseMemberPreview
              :members="joinUsers"
              :online="true"
              gap="0.375rem"
              width="2rem"
            />

            <div
              v-if="!joinUsers.length"
              class="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#060606] text-xs font-medium text-[#D9D9D9]"
            >
              0
            </div>
          </div>

          <div v-if="status === 'future'" class="text-xs text-[#707070]">
            {{ $t('meet.join.future') }}
          </div>

          <div
            v-if="status === 'live' && !joinUsers.length"
            class="text-xs text-[#707070]"
          >
            {{ $t('meet.join.first.label') }}
            <span class="font-bold">{{ $t('meet.join.first.rank') }}</span>
            {{ $t('meet.join.first.description') }}
          </div>
          <div
            v-if="status === 'live' && joinUsers.length"
            class="text-xs text-[#707070]"
          >
            <span class="font-bold">{{ joinUsers[0].name }}&nbsp;</span>
            <span v-if="joinUsers.length > 1">
              {{ $t('meet.join.middle.description1') }}
              <span class="font-bold">{{ joinUsers.length - 1 }}</span>
              {{ $t('meet.join.middle.description2') }}&nbsp;
            </span>
            <!-- <span v-else>&nbsp;is&nbsp;</span> -->
            {{ $t('meet.join.middle.time') }}
          </div>

          <div
            v-if="status === 'future'"
            class="flex items-center justify-center gap-2"
          >
            <div class="flex h-4 w-4 items-center justify-center">
              <i class="fa-light fa-hourglass-clock text-[#707070]" />
            </div>
            <BaseCountdown
              :start-date="dates?.startDate"
              @time-elapsed="onTimeElapsed"
            />
          </div>

          <div
            v-if="status === 'live'"
            class="text-base font-bold text-[#707070]"
          >
            {{ secondToTime2(startSeconds) }}
          </div>
        </div>

        <BaseButton
          v-if="!eventLoading"
          label="$t:flux.meet.join"
          :loading="loading"
          class="mt-2 w-[17.8125rem] justify-center font-medium"
          :disabled="status !== 'live' || !hmsLocalPeer"
          data-cy="0eae94ececad590c"
          @click="onJoin"
        />
      </div>
      <div
        v-if="noProfile"
        class="flex flex-col items-center justify-center gap-4"
        :class="width <= 1120 || $device.isMobile ? 'w-full' : 'w-[28rem]'"
      >
        <img src="~/assets/meet/no-profile.svg" class="m-4" alt="" />
        <div class="my-2.5 text-base text-white">
          Profile is not listed as member of the event.
        </div>
      </div>
      <div v-if="!eventLoading" class="flex items-center justify-center gap-2">
        <div class="text-xs text-[#707070]">
          {{ $t('meet.joinAs') }}
        </div>
        <div class="relative">
          <BaseAvatar :picture="meet.picture" size="sm" class="!p-0" />
          <div
            class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0A0A0A] bg-[#86EFAC]"
          />
        </div>
        <div class="max-w-52 truncate text-sm text-[#D9D9D9]">
          {{ meet.fullName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dayJS from 'dayjs';

import { hmsActions } from '~/utils/hms';

const dayjs = dayJS.tz;

export default {
  props: {
    roomId: String,
    calendarId: String,
    eventId: String,
  },
  setup() {
    const hmsStore = useHmsStore();
    const profileStore = useProfileStore();
    const { width } = useWindowSize();
    const box = ref(null);
    const peerW = ref(824);
    const peerH = ref(464);
    useResizeObserver(box, (entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        if (width < 824) {
          peerW.value = width;
        } else {
          peerW.value = 824;
        }
        peerH.value = (peerW.value * 9) / 16;
      }
    });
    return { hmsStore, profileStore, width, box, peerW, peerH };
  },
  data() {
    return {
      loading: false,
      timer: null,
      startSeconds: 0,
      eventLoading: false,
      noProfile: false,
    };
  },
  computed: {
    meet() {
      return this.hmsStore.meet;
    },
    dates() {
      return this.meet?.dates;
    },
    status() {
      const { startDate, endDate } = this.dates || {};
      if (startDate && endDate) {
        return getCurrentTimeStatus(startDate, endDate);
      }
      return ''; // 'live', 'future', 'past'
    },
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
    hmsPeers() {
      return this.hmsStore.hmsAllPeers;
    },
    joinUsers() {
      return this.hmsPeers
        .filter((peer) => !peer.isLocal)
        .map((r) => {
          if (r.metadata) {
            const metadata = JSON.parse(r.metadata);
            r.picture = metadata.picture;
            r.userId = metadata.userId;
            r.online = true;
          }
          return r;
        });
    },
    hmsHLSState() {
      return this.hmsStore.hmsHLSState;
    },
    isRunning() {
      return this.hmsHLSState?.running;
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.timer && clearInterval(this.timer);
  },
  methods: {
    intervalTime() {
      if (this.status === 'live') {
        const diff = dayjs(new Date(this.dates?.endDate)).diff(
          dayjs(new Date(this.dates?.startDate)),
          'minute',
        );
        const startDate =
          diff % 1440 === 0
            ? dayjs(new Date(this.dates?.startDate)).startOf('day')
            : new Date(this.dates?.startDate);

        this.startSeconds = dayjs().diff(startDate, 'second');
      }
    },
    async init() {
      this.eventLoading = true;
      await sleep(1000);
      if (this.roomId) {
        await this.hmsStore
          .getAuthToken({ roomId: this.roomId })
          .catch(({ response }) => {
            const message = response?.data?.message;
            if (message === 'Profile not found in the event members') {
              this.noProfile = true;
              this.eventLoading = false;
            }
          });
      } else {
        await this.hmsStore
          .getEventAuthToken({
            calendarId: this.calendarId,
            eventId: this.eventId,
          })
          .catch(({ response }) => {
            const message = response?.data?.message;
            if (message === 'Profile not found in the event members') {
              this.noProfile = true;
              this.eventLoading = false;
            }
          });
      }
      this.intervalTime();
      this.timer = setInterval(() => {
        this.intervalTime();
      }, 1000);

      this.onPreview();
    },
    async onPreview() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      await hmsActions.preview({
        userName: this.meet.fullName,
        authToken: this.meet.token,
        asRole: this.meet.role,
        metaData: JSON.stringify({
          picture: this.meet.picture,
          userId: this.meet.id,
        }),
      });
      this.loading = false;
      this.eventLoading = false;
    },
    async onJoin() {
      if (this.loading) {
        return;
      }
      if (this.status !== 'live') {
        return;
      }
      if (
        !this.hmsPeers.some(
          (peer) => peer.roleName === 'host' || peer.roleName === 'co-host',
        )
      ) {
        this.$toast.error(this.$t('meet.admit.error'));
        return;
      }

      try {
        this.loading = true;

        this.$toast.clear(); // it's a new start
        await hmsActions.join({
          userName: this.meet.fullName,
          authToken: this.meet.token,
          asRole: this.meet.role,
          rememberDeviceSelection: true,
          metaData: JSON.stringify({
            picture: this.meet.picture,
            userId: this.meet.id,
          }),
          settings: { isAudioMuted: true, isVideoMuted: true },
        });
      } catch (err) {
        console.error('Error in joining room', err);
        this.$toast.error(
          this.$t('meet.join.error', {
            error: ` ${err.message}: ${err.description}`,
          }),
        );
      } finally {
        this.loading = false;
      }
    },
    async onTimeElapsed() {
      // 倒计时结束，更新开始时间触发直播
      const startDate = new Date().toISOString();
      await sleep(200);
      if (this.status) {
        this.meet.dates.startDate = startDate;
      }
    },
  },
};
</script>
