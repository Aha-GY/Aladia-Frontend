<template>
  <NuxtLayout name="empty">
    <Head>
      <Title>{{ $t('event.meet.label') }}</Title>
    </Head>
    <div v-loading="loading" class="flex h-screen w-screen flex-col p-2">
      <LazyMeetConference v-if="hmsStore.hmsIsConnectedToRoom" />
    </div>
  </NuxtLayout>
</template>

<script>
import axios from 'axios';

import { hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    roomId() {
      return this.$route.query.roomId;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (!this.hmsStore.hmsIsConnectedToRoom) {
        this.hmsStore.initialiseSubscribe();
      }
      if (!this.roomId) {
        return;
      }
      this.loading = true;

      const baseUrl =
        'https://prod-in2.100ms.live/hmsapi/daniel-videoconf-2020.app.100ms.live/api/token';
      const { data } = await axios.post(baseUrl, {
        role: '__internal_recorder',
        room_id: this.roomId,
        user_id: 'beam',
      });
      await hmsActions.join({
        userName: 'beam',
        authToken: data.token,
        asRole: '__internal_recorder',
      });
      this.loading = false;
    },
  },
};
</script>
