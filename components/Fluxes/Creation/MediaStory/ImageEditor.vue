<template>
  <div class="h-full w-full">
    <PinturaEditor ref="pintura" v-bind="editorOptions" :src="editorSrc" />
  </div>
</template>
<script setup>
import {
  setPlugins,
  plugin_sticker,
  plugin_sticker_locale_en_gb,
  getEditorDefaults,
  createDefaultColorOptions,
  createMarkupEditorToolStyles,
} from '@pqina/pintura';
import { PinturaEditor } from '@pqina/vue-pintura';
import '@pqina/pintura/pintura.css';

import smallSunCloudy from '~/assets/icons/cloudy-sun.svg';
import stickerOne from '~/assets/icons/pintura-sticker-one.svg';
import stickerThree from '~/assets/icons/pintura-sticker-three.svg';
import stickerTwo from '~/assets/icons/pintura-sticker-two.svg';
import bigSunCloudy from '~/assets/icons/small-cloud.svg';
import smile from '~/assets/icons/smile.svg';
import star from '~/assets/icons/star.svg';
import sun from '~/assets/icons/sun.svg';
import thumbsDown from '~/assets/icons/thumbsDown.svg';
import thumbsUp from '~/assets/icons/thumbsUp.svg';

const props = defineProps({
  url: {
    type: String,
    default: () => '',
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

setPlugins(plugin_sticker);

const fillColors = computed(() => [
  ...Object.values(createDefaultColorOptions()),
]);

const editorOptions = computed(() => ({
  ...getEditorDefaults({
    imageCropAspectRatio: 10 / 16,
  }),

  stickerForceEnable: true,

  stickers: [
    [
      'Emoji',
      [star, smile, thumbsUp, thumbsDown, sun, bigSunCloudy, smallSunCloudy],
    ],
    [
      'Markers',
      [
        {
          src: stickerOne,
          width: '5%',
          alt: 'One',
        },
        {
          src: stickerTwo,
          width: '5%',
          alt: 'Two',
        },
        {
          src: stickerThree,
          width: '5%',
          alt: 'Three',
        },
      ],
    ],
  ],

  locale: {
    ...getEditorDefaults().locale,
    ...plugin_sticker_locale_en_gb,
  },

  enableButtonExport: false,
  cropSelectPresetFilter: true,
  cropSelectPresetOptions: [
    [undefined, 'Custom'],
    [1, '1:1'],
    // shown when cropSelectPresetFilter is set to 'landscape'
    [2 / 1, '2:1'],
    [3 / 2, '3:2'],
    [4 / 3, '4:3'],
    [16 / 10, '16:10'],
    [16 / 9, '16:9'],
    // shown when cropSelectPresetFilter is set to 'portrait'
    [1 / 2, '1:2'],
    [2 / 3, '2:3'],
    [3 / 4, '3:4'],
    [10 / 16, '10:16'],
    [9 / 16, '9:16'],
  ],
  cropImageSelectionCornerStyle: 'hook',
  cropEnableZoomInput: false,
  cropEnableInfoIndicator: true,
  cropEnableButtonFlipVertical: true,
  enableBrowseImage: true,
  imageCropLimitToImage: false, // Defaults to true, when set to true Pintura Image Editor will prevent cropping outside of
  imageCurrentTime: 0,
  layoutDirectionPreference: 'vertical',
  utils: [
    'annotate',
    'fill',
    'crop',
    'filter',
    'finetune',
    // 'decorate',
    'sticker',
    'frame',
    'redact',
    // 'resize',
  ],
  util: 'annotate',

  markupEditorToolStyles: createMarkupEditorToolStyles({
    text: {
      // Increase default font size
      fontSize: '10%',
    },
  }),

  fillOptions: fillColors.value,
  willRenderCanvas:
    props.options.imageCropAspectRatio === 1
      ? (shapes, state) => {
          const { utilVisibility, selectionRect, lineColor, backgroundColor } =
            state;

          // Exit if crop utils is not visible
          if (utilVisibility.crop <= 0) {
            return shapes;
          }

          // Get variable shortcuts to the crop selection rect
          const { x, y, width, height } = selectionRect;

          return {
            // Copy all props from current shapes
            ...shapes,
            // Now we add an inverted ellipse shape to the interface shapes array
            interfaceShapes: [
              {
                x: x + width * 0.5,
                y: y + height * 0.5,
                rx: width * 0.5,
                ry: height * 0.5,
                opacity: utilVisibility.crop,
                inverted: true,
                backgroundColor: [...backgroundColor, 0.5],
                strokeWidth: 1,
                strokeColor: [...lineColor],
              },
              // Spread all existing interface shapes onto the array
              ...shapes.interfaceShapes,
            ],
          };
        }
      : undefined,
  ...props.options,
}));
const pintura = ref(null);
const editorSrc = ref(undefined);

onMounted(async () => {
  if (props.file) {
    const f = props.file.src || props.file.url;
    editorSrc.value = f;
  }
  pintura.value.editor.on('ready', () => {
    emits('ready', true);
  });
});

watch(
  () => props.url,
  (newUrl) => {
    if (newUrl) {
      editorSrc.value = newUrl;
    }
  },
);
const getCurrentImg = async () => {
  try {
    const res = await pintura.value.editor.processImage();
    return res;
  } catch {
    return null;
  }
};
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
