<template>
  <NuxtLayout name="empty">
    <Head>
      <Title>Player - Aladia</Title>
    </Head>
    <div class="h-screen w-screen">
      <BasePlayer
        class="h-full w-full"
        :class="{
          'disabled-next': !next?.file?.signedUrl,
          'disabled-prev': !prev?.file?.signedUrl,
        }"
        :option="option"
        @get-instance="getInstance"
      />
    </div>
  </NuxtLayout>
</template>

<script>
export default {
  setup() {
    const hubCalendar = useHubCalendarStore();
    return { hubCalendar };
  },
  data() {
    return {
      art: null,
      option: {
        url: '',
        poster: '',
        playbackRate: true,
        aspectRatio: true,
        setting: true,
        pip: true,
        flip: true,
        fullscreen: true,
        fullscreenWeb: true,
        miniProgressBar: true,
        lang: 'en',
        controls: [
          {
            index: 11,
            html: `<i class="fa-solid fa-backward-step text-xl"></i>`,
            name: 'prev',
            position: 'left',
            tooltip: 'Previous Record',
            click: () => this.playLecture(this.prev, 'prev'),
          },
          {
            index: 12,
            html: `<i class="fa-solid fa-forward-step text-xl"></i>`,
            name: 'next',
            position: 'left',
            tooltip: 'Next Record',
            click: () => this.playLecture(this.next, 'next'),
          },
        ],
        layers: [
          {
            html: '',
            name: 'detail',
          },
        ],
      },
      recordings: [],
      currentIndex: 0,
    };
  },
  computed: {
    calendarId() {
      return this.$route.query.calendarId;
    },
    eventId() {
      return this.$route.query.eventId;
    },
    videoId() {
      return this.$route.query.videoId;
    },
    type() {
      return this.$route.query.type;
    },
    next() {
      return this.recordings[this.currentIndex + 1];
    },
    prev() {
      if (this.currentIndex === 0) {
        return null;
      }
      return this.recordings[this.currentIndex - 1];
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      if (this.type === 'calendar') {
        await this.retriveEvent();
      }
    },
    async retriveEvent() {
      this.hubCalendar
        .retriveEvent({
          calendarId: this.calendarId,
          id: this.eventId,
        })
        .then((data) => {
          const { live } = data;
          this.recordings = live.recordings || [];
          const recordObj = this.videoId
            ? this.recordings.find((r) => r.file.fileId === this.videoId)
            : this.recordings[0];
          const url = recordObj?.file?.signedUrl;
          if (!url) {
            return;
          }
          this.art.switchUrl(url);
          this.art.once('video:canplay', () => {
            this.art.play();
          });
        });
    },
    async getInstance(art) {
      this.art = art;

      art.url = this.recordings[0]?.file?.signedUrl || '';

      art.on('video:ended', () => {
        this.playLecture(this.next, 'next');
      });
    },
    playLecture(item, type) {
      if (!item) {
        return;
      }

      const url = item?.file?.signedUrl;
      if (!url) {
        return;
      }
      if (type === 'next') {
        this.currentIndex += 1;
      } else {
        this.currentIndex -= 1;
      }

      this.art.switchUrl(url);
      this.art.once('video:canplay', () => {
        this.art.play();
      });
    },
  },
};
</script>
