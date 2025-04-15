<template>
  <div>
    <div v-if="options.imageCropMinSize" class="pb-2 text-white/50">
      <i class="fa-regular fa-circle-exclamation mr-1" />
      {{ $t('base.limit.image.description1') }}
      {{ options.imageCropMinSize.width }} x
      {{ options.imageCropMinSize.height }}
      {{ $t('base.limit.image.description2', { size: options.maxSize }) }}
    </div>
    <div class="h-[30rem] w-full">
      <PinturaEditor ref="pintura" v-bind="editorOptions" :src="editorSrc" />
    </div>
    <div class="mt-[1.125rem] flex justify-between">
      <div><slot name="extra-left-button" /></div>
      <div class="flex justify-end">
        <div class="flex justify-end">
          <slot name="extra-button" />
          <BaseButton type="secondary" :disabled="loading" class="relative">
            <i class="fa-solid fa-paperclip" />
            {{ $t('base.editor.update') }}
            <input
              type="file"
              :disabled="loading"
              accept="image/*"
              class="absolute inset-0 opacity-0"
              data-cy="f10e55055b4ed71d"
              @change="onChange"
            />
          </BaseButton>
          <BaseButton
            class="ml-3"
            label="$t:base.upload.save"
            :loading="loading"
            data-cy="8a28071acc080a1b"
            @click="confirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getEditorDefaults } from '@pqina/pintura';
import { PinturaEditor } from '@pqina/vue-pintura';
import '@pqina/pintura/pintura.css';
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps({
  src: {
    type: String,
    dafault: () => '',
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['result']);
const { t } = useI18n();
const $toast = useToast();
const editorOptions = computed(() => ({
  ...getEditorDefaults(),
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
  utils: [
    'crop',
    'filter',
    'finetune',
    'annotate',
    'decorate',
    // 'sticker',
    'frame',
    'redact',
    // 'resize',
  ],
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
const loading = ref(false);

const onChange = (event) => {
  const files = event.target.files;
  if (files[0]) {
    if (
      props.options.maxSize &&
      files[0].size > 1024 * 1024 * props.options.maxSize
    ) {
      $toast.error(
        t('base.limit.image.error', { size: props.options.maxSize }),
      );
      return false;
    }
    pintura.value.editor.loadImage(files[0], {
      ...props.options,
    });
  }
};

const confirm = async () => {
  if (loading.value) {
    return false;
  }
  loading.value = true;
  const res = await pintura.value.editor.processImage();
  emit('result', res.dest, () => {
    loading.value = false;
  });
};

onBeforeMount(async () => {
  if (props.src) {
    editorSrc.value = props.src;
  }
});
const getCurrentImg = async () => {
  try {
    const res = await pintura.value.editor.processImage();
    return res.dest;
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
.pintura-editor {
  cursor: pointer;
  border: 1px dashed #39393a;
  border-radius: 4px;
  &:hover {
    border: 1px dashed #eacb5b;
  }
}
</style>
