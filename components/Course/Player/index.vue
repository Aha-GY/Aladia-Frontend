<template>
  <BasePlayer
    id="player"
    class="courses-player h-full w-full"
    :class="{
      'disabled-next': !next?.video,
      'disabled-prev': !prev?.video,
    }"
    :option="option"
    @get-instance="getInstance"
  />
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const courseStore = useCourseStore();
    return { authStore, courseStore };
  },
  data() {
    return {
      /**
       * @type {Artplayer} - An Artplayer instance.
       */
      art: null,
      timer: null,
      lastPlayedTime: 0,
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
            tooltip: 'Previous Lecture',
            click: () => this.playLecture(this.prev),
          },
          {
            index: 12,
            html: `<i class="fa-solid fa-forward-step text-xl"></i>`,
            name: 'next',
            position: 'left',
            tooltip: 'Next Lecture',
            click: () => this.playLecture(this.next),
          },
        ],
        layers: [
          {
            html: '',
            name: 'detail',
          },
        ],
      },
    };
  },
  computed: {
    course() {
      return this.courseStore.course;
    },
    player() {
      return this.courseStore.player;
    },
    current() {
      return this.courseStore.current;
    },
    completion() {
      return this.courseStore.completion;
    },
    currentLectureLivingRecording() {
      return this.courseStore.currentLectureLivingRecording;
    },
    next() {
      return this.courseStore.next;
    },
    prev() {
      return this.courseStore.prev;
    },
    url() {
      try {
        if (this.current) {
          return this.current.videos[0].url;
        } else {
          return this.course.trailer.url;
        }
      } catch {
        return '';
      }
    },
    poster() {
      try {
        if (this.current) {
          return this.current.thumbnail.url;
        } else {
          return this.course.thumbnail.url;
        }
      } catch {
        return '';
      }
    },
    thumbnails() {
      try {
        if (this.current) {
          return this.current.videos[0]?.metadata?.framingPath || '';
        } else {
          return this.course.trailer?.metadata?.framingPath || '';
        }
      } catch {
        return '';
      }
    },
  },
  mounted() {
    this.checkPlaying();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.timer);
  },
  methods: {
    /**
     * @param {Artplayer}  art - An Artplayer instance.
     */
    async getInstance(art) {
      this.art = art;
      window['art'] = art;

      art.url = this.url;
      art.poster = this.poster;
      art.thumbnails = {
        url: this.thumbnails,
        number: 100,
        column: 10,
      };

      art.on('video:loadstart', () => {
        this.player.loading = true;
      });

      art.on('video:waiting', () => {
        this.player.loading = true;
      });

      art.on('video:canplay', () => {
        this.player.loading = false;
      });

      art.on('video:ended', () => {
        if (this.player.autoplay) {
          this.playLecture(this.next);
        }
      });

      art.on('video:loadeddata', () => {
        this.lastPlayedTime = 0;
      });

      art.on('video:timeupdate', () => {
        if (!this.current) {
          return;
        }

        if (!this.authStore.logged) {
          return;
        }

        if (
          this.art.currentTime - this.lastPlayedTime > 10 ||
          this.art.currentTime === this.art.duration
        ) {
          this.lastPlayedTime = this.art.currentTime;
          const completion = parseInt(
            (this.art.currentTime / this.art.duration) * 100,
          );

          if (isNaN(completion)) {
            return;
          }

          if (this.currentLectureLivingRecording) {
            const completions = this.completion.completions
              .find((c) => c.chapterId === this.current.chapterId)
              .completions.find(
                (l) =>
                  l.lectureId === this.currentLectureLivingRecording.lectureId,
              ).completions;

            // 1. 先初始化
            for (
              let index = 0;
              index < this.currentLectureLivingRecording._totalParentVideos;
              index++
            ) {
              if (!completions[index]) {
                completions[index] = 0;
              }
            }

            // 2. 更新数据
            completions[this.currentLectureLivingRecording._videoIndex] =
              completion;

            // 3. 更新本地Completion
            this.courseStore.updateLocalLectureCompletion({
              lectureId:
                this.current.id || this.currentLectureLivingRecording.lectureId,
              completion,
              index: this.currentLectureLivingRecording._videoIndex,
            });

            this.courseStore.updateCompletion({
              courseId: this.course.id,
              chapterId: this.current.chapterId,
              lectureId: this.currentLectureLivingRecording.lectureId,
              completions,
            });
          } else {
            // 更新本地Completion
            this.courseStore.updateLocalLectureCompletion({
              lectureId:
                this.current.id || this.currentLectureLivingRecording.lectureId,
              completion,
              index: 0,
            });

            this.courseStore.updateCompletion({
              courseId: this.course.id,
              chapterId: this.current.chapterId,
              lectureId: this.current.id,
              completions: [completion],
            });
          }
        }
      });

      art.on('control', (state) => {
        this.player.control = state;
      });

      art.emit('video:loadedmetadata');

      art.events.hover(
        art.controls.next,
        () => {
          this.player.showNext = true;
        },
        () => {
          this.player.showNext = false;
        },
      );

      art.events.hover(
        art.controls.prev,
        () => {
          this.player.showPrev = true;
        },
        () => {
          this.player.showPrev = false;
        },
      );
    },
    checkPlaying() {
      this.timer = requestAnimationFrame(() => {
        if (this.art) {
          this.player.url = this.art.url;
          this.player.playing = this.art.playing;
          this.player.currentTime = this.art.currentTime;
          this.player.played = this.art.played;
          this.player.duration = this.art.duration;
        } else {
          this.player.url = '';
          this.player.playing = false;
          this.player.currentTime = 0;
          this.player.played = 0;
          this.player.duration = 0;
        }
        this.checkPlaying();
      });
    },
    playLecture(item) {
      if (!item) {
        return;
      }
      const { chapter, lecture } = item;
      const url = lecture.videos[0]?.url;
      if (!url) {
        return;
      }

      if (lecture._isLivingRecording) {
        this.player.currentLectureLivingRecording = lecture;
        this.$router.replace({
          query: {
            ...this.$route.query,
            lectureId: lecture.lectureId,
            chapterId: chapter.id,
            videoId: lecture.id,
          },
        });
      } else {
        this.player.currentLecture = lecture;
      }
      this.player.currentChapter = chapter;
      this.courseStore.play(lecture);
    },
  },
};
</script>

<style lang="scss">
.courses-player {
  .art-progress-played,
  .art-layer-mini-progress-bar {
    background-color: #802cac !important;
  }
}

.disabled-next .art-control-next,
.disabled-prev .art-control-prev {
  pointer-events: none;
  opacity: 0.5;
}
</style>
