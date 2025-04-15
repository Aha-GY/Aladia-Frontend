<template>
  <div class="h-full w-full">
    <PinturaEditor ref="pintura" v-bind="editorOptions" :src="editorSrc" />
  </div>
</template>
<script setup>
import { getEditorDefaults, createDefaultColorOptions } from '@pqina/pintura';
import { PinturaEditor } from '@pqina/vue-pintura';
import '@pqina/pintura/pintura.css';

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
});

const fillColors = computed(() => [
  // [0.91, 0.76, 0.22],
  ...Object.values(createDefaultColorOptions()),
]);

const editorOptions = computed(() => ({
  ...getEditorDefaults(),
  enableButtonExport: false,
  cropSelectPresetFilter: true,
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
  layoutDirectionPreference: 'vertical',
  utils: [
    // 'crop',
    // 'filter',
    // 'finetune',
    'annotate',
    'fill',
    'decorate',
    // 'sticker',
    'frame',
    'redact',
    // 'resize',
  ],
  willRenderCanvas: undefined,
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
    handleButtonClick();
  }
  // pintura.value.editor.on('ready', () => {
  //   console.log('init');
  //   nextTick(() => {
  //     const fillBtn = document.querySelector('.PinturaTabList > button');
  //     console.log('fillBtn', fillBtn);
  //     if (fillBtn) {
  //       fillBtn.click();
  //     }
  //   });
  // });
});

const handleButtonClick = () => {
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
defineExpose({
  getCurrentImg,
});
</script>
<style lang="scss">
.pintura-editor {
  --color-background: 10, 10, 10;
  --color-foreground: 255, 255, 255;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
