<template>
  <div>
    <div v-if="options.maxSize" class="pb-2 text-white/50">
      <i class="fa-regular fa-circle-exclamation mr-1" />
      {{ $t('base.limit.video.description1') }} {{ options.maxSize }}.
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
              accept="video/*"
              class="absolute inset-0 opacity-0"
              data-cy="63f8f65af8bf655e"
              @change="onChange"
            />
          </BaseButton>
          <BaseButton
            class="ml-3"
            label="$t:base.upload.save"
            :loading="loading"
            data-cy="44427860db27c2e7"
            @click="confirm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { setPlugins, getEditorDefaults } from '@pqina/pintura';
import { plugin_trim, plugin_trim_locale_en_gb } from '@pqina/pintura-video';
import { PinturaEditor } from '@pqina/vue-pintura';
import '@pqina/pintura/pintura.css';
import '@pqina/pintura-video/pinturavideo.css';
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

setPlugins(plugin_trim);

const { t } = useI18n();
const $toast = useToast();
const editorOptions = computed(() => ({
  ...getEditorDefaults(),
  enableButtonExport: false,
  cropImageSelectionCornerStyle: 'hook',
  cropEnableInfoIndicator: true,
  cropEnableButtonFlipVertical: true,
  enableBrowseImage: true,
  locale: {
    ...getEditorDefaults().locale,
    ...plugin_trim_locale_en_gb,
  },
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
