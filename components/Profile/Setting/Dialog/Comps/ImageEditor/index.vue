<template>
  <div class="pr-3">
    <div v-if="options.imageCropMinSize" class="pb-2 text-white/50">
      <i class="fa-regular fa-circle-exclamation mr-1" />
      {{ $t('base.limit.image.description1') }}
      {{ options.imageCropMinSize.width }} x
      {{ options.imageCropMinSize.height }}
      {{ $t('base.limit.image.description2', { size: '6' }) }}
    </div>
    <div class="h-[30rem] w-full">
      <PinturaEditor
        v-if="editorSrc || isUploadedFile"
        ref="pintura"
        v-bind="editorOptions"
        :src="editorSrc"
        @mousemove="handleCanvasMouseMove($event)"
      />

      <div
        v-else
        class="pintura-editor relative flex h-[30rem] w-full content-center items-center justify-center"
      >
        <input
          type="file"
          :disabled="loading"
          accept="image/*"
          class="absolute inset-0 bottom-0 left-0 right-0 top-0 opacity-0"
          :data-cy="`${dataCy}-editor`"
          @change="onChange"
        />
        <div class="flex justify-center">
          <BaseButton type="secondary" :disabled="loading" class="relative">
            <i class="fa-solid fa-upload" />
            {{ $t('base.upload.image') }}
            <input
              type="file"
              :disabled="loading"
              accept="image/*"
              class="absolute inset-0 opacity-0"
              :data-cy="`${dataCy}-editor`"
              @change="onChange"
            />
          </BaseButton>
        </div>
      </div>
    </div>
    <div class="mt-[1.125rem] flex justify-between">
      <div><slot name="extra-left-button" /></div>
      <div class="flex justify-end">
        <div class="flex justify-end">
          <slot name="extra-button" />
          <BaseButton type="secondary" :disabled="loading" class="relative">
            <i class="fa-solid fa-upload" />
            {{ $t('base.editor.upload') }}
            <input
              type="file"
              :disabled="loading"
              accept="image/*"
              class="absolute inset-0 opacity-0"
              :data-cy="`${dataCy}-editor`"
              @change="onChange"
            />
          </BaseButton>
          <BaseButton
            class="ml-3"
            label="$t:base.upload.save"
            :loading="loading"
            :data-cy="`${dataCy}-save-button`"
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
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';
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
  dataCy: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['result']);
const { t } = useI18n();
const $toast = useToast();
const showMobileCrop = ref(true);
const showDesktopCrop = ref(true);
const mobileCropPosition = ref({ x: 0, y: 0 });
const desktopCropPosition = ref({ x: 0, y: 0 });
const isUploadedFile = ref(false);

const renderText = (text, x, y) => ({
  text,
  x,
  y,
  alwaysOnTop: true,
  fontWeight: 'bold',
  fontSize: 12,
  textAlign: 'center',
  lineHeight: 20,
  color: [0, 0, 0],
  width: 60,
  height: 20,
  cornerRadius: 30,
  backgroundColor: [1, 1, 1, 1],
});

const willRenderCanvasRatio1 = (shapes, state) => {
  const { utilVisibility, selectionRect, lineColor, backgroundColor } = state;
  // Exit if crop utils is not visible
  if (utilVisibility.crop <= 0) {
    return shapes;
  }
  const { x, y, width, height } = selectionRect;
  return {
    ...shapes,
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
    ],
  };
};
const willRenderCanvasRatio16by3 = (shapes, state) => {
  const { utilVisibility, selectionRect } = state;
  if (utilVisibility.crop <= 0) {
    return shapes;
  }
  const { x, y, width, height } = selectionRect;
  const mobileCropWidth = width / 1.69;
  const desktopCropWidth = (width - mobileCropWidth) / 2;
  desktopCropPosition.value = {
    x: x + 8,
    y: y + 8,
  };
  mobileCropPosition.value = {
    x: x + width / 2 - mobileCropWidth / 2 + 8,
    y: y + 8,
  };
  const desktopMask = !showDesktopCrop.value || showMobileCrop.value;
  return {
    ...shapes,
    interfaceShapes: [
      {
        width,
        height,
        x,
        y,
        strokeWidth: 1,
        strokeColor: [1, 1, 1],
      },
      showDesktopCrop.value ? renderText('Desktop', x + 8, y + 8) : {},
      {
        width: desktopCropWidth,
        height,
        x,
        y,
        backgroundColor: [1, 1, 1, desktopMask ? 0.4 : 0],
      },
      {
        width: desktopCropWidth,
        height,
        x: x + desktopCropWidth + mobileCropWidth,
        y,
        backgroundColor: [1, 1, 1, desktopMask ? 0.4 : 0],
      },
      showMobileCrop.value
        ? renderText('Mobile', x + width / 2 - mobileCropWidth / 2 + 8, y + 8)
        : {},
      {
        width: mobileCropWidth,
        height,
        x: x + width / 2 - mobileCropWidth / 2,
        y,
        strokeWidth: showMobileCrop.value ? 1 : 0,
        strokeColor: [1, 1, 1],
      },
      {
        text: showMobileCrop.value
          ? `${mobileCropWidth.toFixed(0)} x ${height.toFixed(0)}`
          : '',
        x: x + desktopCropWidth + mobileCropWidth - 65,
        y: y + height - 20,
        fontWeight: 'bold',
        fontSize: 12,
        color: [1, 1, 1],
      },
    ],
  };
};
const willRenderCanvas = () => {
  if (props.options.imageCropAspectRatio === 1) {
    return willRenderCanvasRatio1;
  }
  if (props.options.imageCropAspectRatio === 16 / 3) {
    console.log(showMobileCrop.value); // Do Not Delete
    console.log(showDesktopCrop.value); // Do Not Delete
    return willRenderCanvasRatio16by3;
  }
  return undefined;
};
const handleCanvasMouseMove = (event) => {
  const canvasRect = pintura.value.$el.getBoundingClientRect();
  const clickX = event.clientX - canvasRect.left;
  const clickY = event.clientY - canvasRect.top;
  // in Desktop
  if (
    clickX >= desktopCropPosition.value.x &&
    clickX <= desktopCropPosition.value.x + 60 &&
    clickY >= desktopCropPosition.value.y &&
    clickY <= desktopCropPosition.value.y + 20
  ) {
    showMobileCrop.value = false;
  } else {
    showMobileCrop.value = true;
  }
  // in Mobile
  if (
    clickX >= mobileCropPosition.value.x &&
    clickX <= mobileCropPosition.value.x + 60 &&
    clickY >= mobileCropPosition.value.y &&
    clickY <= mobileCropPosition.value.y + 20
  ) {
    showDesktopCrop.value = false;
  } else {
    showDesktopCrop.value = true;
  }
};

const editorOptions = computed(() => ({
  ...getEditorDefaults(),
  enableButtonExport: false,
  cropSelectPresetFilter: true,
  cropImageSelectionCornerStyle: 'hook',
  cropEnableZoomInput: false,
  cropEnableInfoIndicator: true,
  cropEnableButtonFlipVertical: true,
  utils: ['crop'],
  willRenderCanvas: willRenderCanvas(),
  ...props.options,
}));
const pintura = ref(null);
const editorSrc = ref(undefined);
const loading = ref(false);

const onChange = (event) => {
  const files = event.target.files;
  if (files[0]) {
    isUploadedFile.value = true;
    if (files[0].size > 1024 * 1024 * 6) {
      $toast.error(t('base.limit.image.error', { size: 6 }));
      isUploadedFile.value = false;
      editorSrc.value = props.url; // Reset editor source

      return false;
    }

    setTimeout(() => {
      pintura.value.editor
        .loadImage(files[0], {
          ...props.options,
        })
        .catch((err) => {
          if (err?.error?.message) {
            $toast.error(err.error.message);
            isUploadedFile.value = false;
            editorSrc.value = props.url; // Reset editor source
          }
        });
    }, 500); // 1 second delay
  }
};

const confirm = async () => {
  if (editorSrc.value || isUploadedFile.value) {
    if (loading.value) {
      return false;
    }
    loading.value = true;
    const res = await pintura.value.editor.processImage();
    emit('result', res.dest, () => {
      loading.value = false;
    });
  } else {
    $toast.error('Image is empty, please upload the image.');
    return false;
  }
};

onBeforeMount(async () => {
  if (props.url) {
    editorSrc.value = props.url;
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
