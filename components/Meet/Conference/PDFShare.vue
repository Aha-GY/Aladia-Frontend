<template>
  <div class="relative h-full w-full rounded-5 bg-[#202020] p-1">
    <div class="absolute -z-10 flex h-full w-full items-center justify-center">
      <i class="fa-light fa-spinner animate-spin text-2xl" />
    </div>
    <iframe
      ref="iframeRef"
      title="Embed View"
      class="h-full w-full rounded-lg border-0"
      allow="autoplay; clipboard-write;"
      referrerPolicy="no-referrer"
    />
  </div>
</template>
<script>
import { parsedUserAgent } from '@100mslive/hms-video-store';

import { hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      inProgress: false,
    };
  },
  computed: {
    hmsIsLocalScreenShared() {
      return this.hmsStore.hmsIsLocalScreenShared;
    },
    pdfConfig() {
      return this.hmsStore.pdfConfig;
    },
  },
  // watch: {
  //   hmsIsLocalScreenShared() {
  //     if (!this.hmsIsLocalScreenShared) {
  //       this.hmsStore.pdfConfig = null;
  //     }
  //   },
  // },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      try {
        if (this.pdfConfig) {
          await this.startShare(this.pdfConfig);
        }
      } catch (err) {
        this.hmsStore.pdfConfig = null;
        this.$toast.error(
          `${this.$t('meet.error.share.annotator')} ${err.message || ''}`,
        );
      }
    },
    async toggleScreen(config) {
      try {
        await hmsActions.setScreenShareEnabled(
          !this.hmsIsLocalScreenShared,
          config,
        );
      } catch (err) {
        throw new Error(this.$t('meet.error.share.annotator'));
      }
    },
    async startShare(value) {
      if (this.inProgress) {
        return;
      }
      if (!value) {
        throw new Error(this.$t('meet.error.notFound.file'));
      }
      if (this.hmsIsLocalScreenShared) {
        throw new Error(this.$t('meet.error.share.sharing'));
      }
      if (!this.$refs.iframeRef) {
        throw new Error(this.$t('meet.error.share.iframe'));
      }

      const pdfIframeURL =
        'https://pdf-annotation.100ms.live/generic/web/viewer.html';
      this.$refs.iframeRef.src = `${pdfIframeURL}${typeof value === 'string' ? `?file=${value}` : ''}`;
      this.$refs.iframeRef.onload = () => {
        requestAnimationFrame(() => {
          if (value instanceof File) {
            this.sendDataToPDFIframe(value);
          }
        });
      };
      this.inProgress = true;
      const isInsideIframe = window.self !== window.top;

      const chromiumBasedBrowsers = ['blink'];
      const isChromiumBased = chromiumBasedBrowsers.some(
        (value) => parsedUserAgent.getEngine()?.name?.toLowerCase() === value,
      );
      await this.toggleScreen?.({
        forceCurrentTab: isChromiumBased && !isInsideIframe,
        cropElement: this.$refs.iframeRef,
        preferCurrentTab: isChromiumBased && !isInsideIframe,
      });
    },
    sendDataToPDFIframe(file) {
      if (this.$refs.iframeRef) {
        this.$refs.iframeRef.contentWindow?.postMessage(
          {
            theme: 2, // dark theme -> 2, light theme -> 1
            file,
          },
          '*',
        );
      }
    },
  },
};
</script>
