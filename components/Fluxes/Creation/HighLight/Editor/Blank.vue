<template>
  <div class="flex h-full w-full flex-col">
    <div
      class="flex-1"
      :class="withoutFooter ? 'pintura-editor-without-border' : ''"
    >
      <PinturaEditor ref="pintura" v-bind="editorOptions" :src="editorSrc" />
    </div>

    <div v-if="withoutFooter && showButton">
      <template v-if="show">
        <div
          class="absolute left-[50%] top-[0.875rem] z-10 h-[1.875rem] w-[1.875rem] translate-x-[calc(-50%-120px)] cursor-pointer"
          data-cy="f2b5844b239e4fbb"
          @click="emits('close')"
        >
          <i class="fa-solid fa-xmark text-[#ED3C28]" />
        </div>
        <div
          class="absolute right-[50%] top-[0.875rem] z-10 h-[1.875rem] w-[1.875rem] translate-x-[calc(-50%+160px)] cursor-pointer"
          data-cy="66c14a0152a02e21"
          @click="handleSave"
        >
          <i v-if="loading" class="fa-light fa-loader animate-spin text-base" />
          <i v-else class="fa-solid fa-check text-[#35A823]" />
        </div>
      </template>
    </div>

    <div v-else-if="showButton" class="flex items-center justify-end gap-5 p-4">
      <BaseButton
        type="tertiary"
        data-cy="e57bef0cc341cf9c"
        @click="emits('close')"
      >
        {{ $t('flux.discard') }}
      </BaseButton>
      <BaseButton
        :class="
          loading ? '!bg-[#737373]/[0.3] font-medium !text-[#D4D4D4]' : ''
        "
        :disabled="loading"
        data-cy="57999b24a1e3adeb"
        @click="handleSave"
      >
        <i v-if="loading" class="fa-light fa-loader animate-spin" />
        {{ $t('flux.publish') }}
      </BaseButton>
    </div>
  </div>
</template>
<script setup>
import {
  setPlugins,
  getEditorDefaults,
  createDefaultColorOptions,
  plugin_sticker,
  plugin_sticker_locale_en_gb,
  createMarkupEditorToolStyles,
} from '@pqina/pintura';
import { PinturaEditor } from '@pqina/vue-pintura';
import '@pqina/pintura/pintura.css';

import stickerOne from '~/assets/icons/pintura-sticker-one.svg';
import stickerThree from '~/assets/icons/pintura-sticker-three.svg';
import stickerTwo from '~/assets/icons/pintura-sticker-two.svg';
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
  withoutFooter: Boolean,
  showButton: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['close', 'save']);

setPlugins(plugin_sticker);

const show = ref(false);
const loading = ref(false);
const fillColors = computed(() => [
  // [0.91, 0.76, 0.22],
  ...Object.values(createDefaultColorOptions()),
]);

const editorOptions = computed(() => ({
  ...getEditorDefaults(),
  enableButtonExport: false,
  cropSelectPresetFilter: true,
  stickerForceEnable: true,

  markupEditorToolStyles: createMarkupEditorToolStyles({
    text: {
      // Increase default font size
      fontSize: '10%',
    },
  }),

  stickers: [
    ['Emoji', [star, smile, thumbsUp, thumbsDown, sun]],
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

  imageCropAspectRatio: 9 / 16,
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
  enableSticker: true,
  layoutDirectionPreference: 'vertical',
  locale: {
    ...getEditorDefaults().locale,
    ...plugin_sticker_locale_en_gb,
  },
  enableCanvasAlpha: true,
  utils: [
    // 'crop',
    // 'filter',
    // 'finetune',
    'annotate',
    'fill',
    // 'decorate',
    'sticker',
    'frame',
    'redact',
    // 'resize',
  ],
  util: 'fill',
  fillOptions: fillColors.value,
  ...props.options,
}));

const pintura = ref(null);
const editorSrc = ref(undefined);

onMounted(async () => {
  if (props.file) {
    editorSrc.value = props.file.src;
    pintura.value.editor.loadImage(props.file, {
      ...props.options,
    });
  } else {
    initCanvas();

    pintura.value.editor.on('ready', () => {
      show.value = true;
    });

    pintura.value.editor.on('selectutil', async (e) => {
      if (e === 'fill') {
        const currentState = pintura.value.editor.history.get();
        if (currentState && currentState.length) {
          const lastState = currentState[currentState.length - 1];
          lastState.backgroundColor = [1, 1, 1, 1];
          pintura.value.editor.history.set(lastState);
        }
      }
    });
  }
});

const initCanvas = () => {
  // Create a new image canvas
  const image = document.createElement('canvas');
  image.width = 560;
  image.height = 996;

  const imageContext = image.getContext('2d');
  imageContext.fillStyle = 'transparent';
  imageContext.fillRect(0, 0, image.width, image.height);

  // Set editor source to the canvas
  editorSrc.value = image;
};

const getCurrentImg = async () => {
  try {
    const res = await pintura.value.editor.processImage();
    return res;
  } catch {
    return null;
  }
};

const handleSave = async () => {
  loading.value = true;
  try {
    const res = await getCurrentImg();
    emits('save', res);
  } finally {
    loading.value = true;
  }
};

defineExpose({
  getCurrentImg,
  handleSave,
});
</script>
