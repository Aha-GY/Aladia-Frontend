<template>
  <div ref="box" class="flex h-full flex-col gap-2 bg-[#060606]">
    <MeetSidebarHeader
      :title="$t('meet.visual.effects.label')"
      icon="fa-wand-magic-sparkles"
    />
    <div
      class="hide-scrollbar flex h-0 flex-1 flex-col gap-2 overflow-y-auto bg-[#060606]"
    >
      <div class="bg-[#0D0D0D] px-6 py-4">
        <div
          class="relative m-auto h-[9.25rem] w-[16.5rem] overflow-hidden rounded-5"
        >
          <MeetVideo :mirror="true" :track-id="videoTrack?.id" />
          <div
            v-if="!hmsStore.hmsIsLocalVideoEnabled"
            class="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white/5 p-6 text-center text-sm"
          >
            {{ $t('meet.visual.warning') }}
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2 bg-[#0D0D0D] px-6 py-2">
        <div class="flex items-center gap-2 p-2">
          <div class="flex h-6 w-6 items-center justify-center">
            <i class="fa-light fa-droplet text-[#707070]" />
          </div>
          <div class="text-base text-[#FAFAFA]">
            {{ $t('meet.visual.effects.blur.label') }}
          </div>
        </div>

        <!-- <div class="flex flex-wrap gap-2 text-xs font-medium text-[#FAFAFA]">
          <div
            class="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-5"
            :class="activeIndex === 'none' ? 'bg-white/5' : 'hover:bg-white/5'"
            data-cy="1d89b40d8541c2f6"
            @click="removePlugin"
          >
            {{ $t('meet.visual.effects.none') }}
          </div>
          <div
            class="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-5"
            :class="activeIndex === 'blur' ? 'bg-white/5' : 'hover:bg-white/5'"
            data-cy="6ddfe3ea7c8254db"
            @click="changeBlue"
          >
            <i class="fa-light fa-droplet text-2xl" />
            {{ $t('meet.visual.effects.blur.label') }}
          </div>
        </div> -->

        <div
          class="px-3 text-sm"
          :class="activeIndex === 'blur' ? '' : 'opacity-50'"
        >
          {{ $t('meet.visual.effects.blur.intensity.label') }}
        </div>
        <div
          class="flex items-center gap-4 px-6 text-[#393939]"
          :class="activeIndex === 'blur' ? '' : 'opacity-50'"
        >
          <!-- {{ $t('meet.visual.effects.blur.intensity.low') }} -->
          <el-slider
            v-model="intensity"
            :max="1"
            :min="0"
            :step="0.1"
            :show-tooltip="false"
            class="w-0 flex-1"
            @change="changeBlue"
          />
          <!-- {{ $t('meet.visual.effects.blur.intensity.high') }} -->
        </div>
      </div>

      <div class="flex flex-col gap-2 bg-[#0D0D0D] px-6 py-2">
        <div class="flex items-center gap-2 p-2">
          <div class="flex h-6 w-6 items-center justify-center">
            <i class="fa-light fa-panorama text-xs text-[#707070]" />
          </div>
          <div class="text-base text-[#FAFAFA]">
            {{ $t('meet.visual.virtual.background') }}
          </div>
        </div>

        <div class="grid grid-cols-4 gap-3 text-xs font-medium text-[#FAFAFA]">
          <div
            class="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-5 border-2 bg-white/5"
            :class="
              activeIndex === 'none' ? 'border-[#E0B92C]' : 'border-[#0D0D0D]'
            "
            @click="removePlugin"
          >
            {{ $t('meet.visual.effects.none') }}
          </div>
          <div
            v-for="image in images"
            :key="image"
            class="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-5 border-2 bg-cover"
            :class="
              activeIndex === image ? 'border-[#E0B92C]' : 'border-[#0D0D0D]'
            "
            :style="{
              'background-image': `url(${image})`,
            }"
            data-cy="335b22b41f80cef5"
            @click="changeImg(image)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  selectEffectsKey,
  selectCameraStreamByPeerID,
} from '@100mslive/hms-video-store';
import { HMSVirtualBackgroundTypes } from '@100mslive/hms-virtual-background';

import { VBHandler } from '~/libs/meet/VBHandler';
import { hmsActions, hmsStore } from '~/utils/hms';

export default {
  setup() {
    const box = ref(null);
    const hmsStore = useHmsStore();
    return { box, hmsStore };
  },
  data() {
    return {
      images: [
        'https://img-vb.100ms.live/layouts/defaults/vb-1.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-2.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-3.png',
        'https://img-vb.100ms.live/layouts/defaults/vb-4.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-5.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-6.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-7.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-8.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-9.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-10.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-11.jpg',
        'https://img-vb.100ms.live/layouts/defaults/vb-12.jpg',
      ],
      activeIndex: 'none',
      intensity: 0,
      unsub1: null,
      videoTrack: null,
    };
  },
  computed: {
    hmsLocalPeer() {
      return this.hmsStore.hmsLocalPeer;
    },
  },
  watch: {
    hmsLocalPeer() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  unmounted() {
    if (this.unsub1) {
      this.unsub1();
    }
  },
  methods: {
    init() {
      if (this.hmsLocalPeer) {
        this.unsub1 = hmsStore.subscribe((track) => {
          this.videoTrack = track;
        }, selectCameraStreamByPeerID(this.hmsLocalPeer.id));
      }

      this.activeIndex = VBHandler.getBackground() || 'none';

      let vbObject = VBHandler.getVBObject();
      if (!vbObject) {
        const effectsKey = hmsStore.getState(selectEffectsKey);

        VBHandler.initialisePlugin(effectsKey);
        vbObject = VBHandler.getVBObject();
        if (effectsKey) {
          hmsActions.addPluginsToVideoStream([vbObject]);
        }
      }
    },
    async changeBlue() {
      try {
        if (!this.hmsStore.hmsIsLocalVideoEnabled) {
          await hmsActions.setLocalVideoEnabled(
            !this.hmsStore.hmsIsLocalVideoEnabled,
          );
        }
        await VBHandler?.setBlur(this.intensity);
        this.activeIndex = HMSVirtualBackgroundTypes.BLUR;
      } catch (err) {
        this.$toast.error(this.$t('meet.visual.virtual.error'));
      }
    },
    async changeImg(url) {
      try {
        if (!this.hmsStore.hmsIsLocalVideoEnabled) {
          await hmsActions.setLocalVideoEnabled(
            !this.hmsStore.hmsIsLocalVideoEnabled,
          );
        }
        await VBHandler?.setBackground(url);
        this.activeIndex = url;
      } catch (err) {
        this.$toast.error(this.$t('meet.visual.virtual.error'));
      }
    },
    async removePlugin() {
      await VBHandler.removeEffects();
      this.activeIndex = HMSVirtualBackgroundTypes.NONE;
    },
  },
};
</script>
