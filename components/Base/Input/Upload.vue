<template>
  <div
    ref="inputRef"
    class="group/input relative flex h-10 flex-col justify-end text-13"
  >
    <div
      class="relative z-0 flex h-6 w-full cursor-pointer items-center"
      :class="focus || name ? 'opacity-100' : 'opacity-0'"
      @click="focus = true"
    >
      <div v-if="name" class="flex h-full w-full items-center gap-2 pr-4">
        <i v-if="icon" :class="icon" />
        <div class="w-0 flex-1 truncate">
          {{ name }}
        </div>
        <div v-if="file && loading" class="text-white/50">
          {{ getFileSize(size) }}
          /
          {{ getFileSize(file.size) }}
        </div>
      </div>
      <div
        v-else
        class="flex h-full items-center gap-2 text-[#b0b0b0] group-hover/input:text-[#c0c0c0]"
      >
        <i v-if="icon" :class="icon" />
        {{ $t(placeholder) }}
      </div>
      <input
        type="file"
        :accept="accept"
        class="absolute inset-0 z-10 opacity-0"
        @change="onUpload"
      />
      <div
        v-if="name && showRemove"
        class="absolute right-0 z-20 cursor-pointer text-white/50 opacity-0 hover:text-white group-hover/input:opacity-100"
        data-cy="88d1faa8c626c779"
        @click="onRemove"
      >
        <i class="fa-solid fa-circle-xmark" />
      </div>
    </div>
    <div
      class="pointer-events-none absolute bottom-0.5 left-0 z-10 transition-all"
      :class="{
        '-translate-y-6': focus || name,
        'text-[#b0a43e]': focus,
        'text-[#b0b0b0] group-hover/input:text-[#c0c0c0]': !focus,
      }"
    >
      {{ $t(title) }}
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10 transition-all duration-300 group-hover/input:bg-white/30"
    >
      <div
        v-if="file && loading"
        class="h-full bg-[#68598a] transition-all duration-300"
        :style="{
          width: (size / file.size) * 100 + '%',
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'base.upload.browse.file',
    },
    placeholder: {
      type: String,
      default: 'base.upload.browse.choose',
    },
    accept: {
      type: String,
      default: 'video/*',
    },
    name: {
      type: String,
      default: '',
    },
    context: {
      type: String,
      default: '',
    },
    unsupported: {
      type: String,
      default: '',
    },
    showRemove: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const focus = ref(false);
    const inputRef = ref(null);

    onClickOutside(inputRef, () => {
      focus.value = false;
    });

    return { focus, inputRef };
  },
  data() {
    return {
      size: 0,
      file: null,
      loading: false,
    };
  },
  methods: {
    async onUpload(event) {
      try {
        const file = event.target.files[0];
        // event.target.value = '';

        const type = file.type.split('/')[0];
        if (!file.type.startsWith(type)) {
          return this.$toast.error(this.$t(this.unsupported));
        }

        this.$emit('start', { file });
        this.file = file;
        this.size = 0;
        this.loading = true;

        const { fileId } = await upload({
          file,
          onProgress: (progress, file) => {
            if (this.file !== file) {
              return;
            }
            this.size = (progress / 100) * file.size;
            this.$emit('progress', progress);
          },
        });

        if (this.file !== file) {
          return;
        }
        this.size = file.size;
        this.loading = false;
        this.focus = false;
        this.$emit('uploaded', { fileId, file });
      } catch (error) {
        this.file = null;
        this.size = 0;
        this.loading = false;
        this.focus = false;
        this.$emit('error', error);
        throw error;
      }
    },
    onRemove() {
      this.file = null;
      this.size = 0;
      this.loading = false;
      this.focus = false;
      this.$emit('remove');
    },
  },
};
</script>
