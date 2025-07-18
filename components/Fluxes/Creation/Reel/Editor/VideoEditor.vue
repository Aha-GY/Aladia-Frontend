<template>
  <div class="h-full w-full">
    <PinturaEditor ref="pintura" v-bind="editorOptions" :src="editorSrc" />
  </div>
</template>
<script setup>
import {
  setPlugins,
  createDefaultImageWriter,
  createDefaultMediaWriter,
  imageStateToCanvas,
  getEditorDefaults,
} from '@pqina/pintura';
import {
  createMuxerEncoder,
  createDefaultVideoWriter,
  createMediaStreamEncoder,
  plugin_trim,
  plugin_trim_locale_en_gb,
} from '@pqina/pintura-video';
import { PinturaEditor } from '@pqina/vue-pintura';
import * as Mp4Muxer from 'mp4-muxer';
import { useToast } from 'vue-toastification';

import '@pqina/pintura/pintura.css';
import '@pqina/pintura-video/pinturavideo.css';

const props = defineProps({
  url: {
    type: String,
    dafault: () => '',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
  file: Object,
  isEdit: Boolean,
  imageStage: Object,
});

const emits = defineEmits(['ready']);

setPlugins(plugin_trim);

const $toast = useToast();
const editorOptions = computed(() => ({
  ...getEditorDefaults(),
  enableButtonExport: false,
  cropImageSelectionCornerStyle: 'hook',
  cropEnableInfoIndicator: true,
  cropEnableButtonFlipVertical: true,
  enableBrowseImage: true,
  trimEnableSplit: false,
  imageCropLimitToImage: false, // Defaults to true, when set to true Pintura Image Editor will prevent cropping outside of
  layoutDirectionPreference: 'vertical',
  finetuneOptions: getEditorDefaults().finetuneOptions.filter(
    ([key]) => key !== 'exposure',
  ),
  finetuneControlConfiguration: {
    ...getEditorDefaults().finetuneControlConfiguration,
    vignette: {
      ...getEditorDefaults().finetuneControlConfiguration.vignette,
      min: 0,
      max: 1,
    },
  },
  locale: {
    ...getEditorDefaults().locale,
    ...plugin_trim_locale_en_gb,
  },
  imageTrim: [[0, 1]],
  imageCurrentTime: 0,
  imageWriter: createDefaultMediaWriter({}, [
    // For writing images
    createDefaultImageWriter(),
    // Use muxer to encode videos
    createDefaultVideoWriter({
      encoder: createMuxerEncoder({
        // when using the mp4 muxer we need to set video/mp4 mimetype
        muxer: Mp4Muxer,
        mimeType: 'video/mp4',
        // video and audio bitrate to use (optional)
        videoBitrate: 2500000, // 2.5MBps
        audioBitrate: 192000, // 192KBps, should be either (96000, 128000, 160000, or 192000)

        // this draws the image
        imageStateToCanvas,
        // enable logging
        log: true,
      }),
    }),
    createDefaultVideoWriter({
      // Resize image
      // targetSize: {
      //   width: 512,
      // },
      // Use media stream encoder
      encoder: createMediaStreamEncoder({
        // Required
        imageStateToCanvas,
        // output quality (optional)
        videoBitrate: 2500000, // 2.5MBps
        audioBitrate: 192000, // 192KBps

        // Default FPS (optional)
        framesPerSecond: 24,
        // By default logging is disabled
        log: false,
        // Force a mime type, please note that this won't work on each browser.
        // By default this property is undefined and Pintura will search a mime type.
        mimeType: 'video/webm;codecs=vp9,opus',
        // If the `mimeType` property isn't set the `mimeTypes` property allows us to define a list of mime types to test in order.
        // These are the default values.
        mimeTypes: [
          // MP4 if at all possible
          'video/mp4;codecs=avc1,aac',
          'video/mp4;codecs=avc,aac',
          'video/mp4;codecs=mp4a,aac',
          'video/mp4;codecs=h264,aac',
          'video/mp4',
          // WEBM will usually work
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm;codecs=h264,opus',
          'video/webm',
          // Matroska fallback for Linux
          'video/x-matroska;codecs=avc1,opus',
          'video/x-matroska;codecs=vp9,opus',
          'video/x-matroska;codecs=vp8,opus',
          'video/x-matroska',
        ],
      }),
    }),
  ]),
  // ...props.options,
}));
const pintura = ref(null);
const editorSrc = ref(undefined);
const fileData = ref([]);

onMounted(async () => {
  pintura.value.editor.on('ready', () => {
    emits('ready', false);
  });
  if (props.file) {
    editorSrc.value = props.file.src || props.file.url;
    // pintura.value.editor.loadImage(props.file, {
    //   ...props.options,
    // });

    if (!props.isEdit) {
      const { fileId } = await upload({ file: props.file });
      fileData.value.push({
        fileId,
        metadata: {
          mimetype: props.file.type,
          size: props.file.size,
          name: props.file.name,
        },
      });
    }
  }
});
const getCurrentImg = async () => {
  try {
    // const res = await pintura.value.editor.processImage();
    const res = await pintura.value.editor.history.get();
    let videoInfo = null;
    if (!props.isEdit) {
      videoInfo = await captureVideoThumbnailAndDuration(props.file);
    }
    return { imageState: res, info: videoInfo, files: fileData.value };
  } catch (error) {
    $toast.error(
      error.message || error.error.message || 'Failed to process image',
    );
    return null;
  }
};

// const imageBlob = ref(null); // 用来存储生成的封面图 Blob
const videoDuration = ref(0); // 用来存储视频时长
const captureVideoThumbnailAndDuration = (videoFile) =>
  new Promise((resolve, reject) => {
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(videoFile);

    // 监听 video 的 metadata 加载事件
    videoElement.addEventListener('loadedmetadata', () => {
      // 在这里设置 currentTime
      videoElement.currentTime = 0; // 设置为视频的第一帧
      videoElement.muted = true; // 静音
    });

    videoElement.addEventListener('loadeddata', () => {
      // 获取视频时长
      videoDuration.value = videoElement.duration;
      // 创建 canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // 在 canvas 上绘制视频的当前帧
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // 将 canvas 转换为 Blob
      canvas.toBlob((blob) => {
        if (blob) {
          // imageBlob.value = blob; // 存储封面图 Blob
          resolve({
            blob,
            duration: videoDuration.value,
            size: videoElement.size,
          }); // 返回封面图 Blob 和视频时长
        } else {
          reject(new Error('Cover image generation failed, please try again!'));
        }
      }, 'image/jpg');

      URL.revokeObjectURL(videoElement.src); // 释放资源
    });

    // 错误处理
    videoElement.addEventListener('error', () => {
      reject(new Error('Video loading failed'));
    });

    // 播放视频以确保可以绘制帧
    videoElement.play().catch((error) => {
      console.error('Video playback failed:', error);
      reject(error);
    });
  });

defineExpose({
  getCurrentImg,
});
</script>
<style lang="scss" scoped>
.pintura-editor {
  --color-background: 10, 10, 10;
  --color-foreground: 255, 255, 255;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
