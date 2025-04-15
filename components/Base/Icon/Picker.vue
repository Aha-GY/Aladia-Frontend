<template>
  <div class="rounded p-2">
    <div class="mb-2">
      <BaseInput
        v-model="name"
        fixed
        search
        clear
        class="mb-2 text-sm"
        :placeholder="$t('base.icon.search')"
      />
      <div class="hide-scrollbar h-40 overflow-y-auto">
        <div class="flex flex-wrap gap-x-1 gap-y-2">
          <div
            v-for="icon in filterIcons"
            :key="icon"
            class="flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-all hover:bg-white/5 active:scale-95"
            :class="
              iconValue === icon
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white'
            "
            :data-cy="icon"
            @click="onIconChange(icon)"
          >
            <i class="fa-light" :class="icon" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="relative flex h-8 items-center justify-center rounded border-dashed border-white/50 text-white/50 transition-all hover:border-white hover:text-white"
      :class="file ? '' : 'border'"
    >
      <div
        v-if="file"
        class="flex items-center gap-2 border-b text-xs text-white"
      >
        <i class="fa-light fa-pencil" />
        Replace Image
      </div>
      <div v-else class="flex items-center gap-2 text-xs">
        <i class="fa-light fa-upload" />
        {{ $t('base.upload.image') }}
      </div>
      <input
        ref="file"
        type="file"
        accept="image/*"
        class="absolute inset-0 z-10 opacity-0"
        data-cy="6187430e250addeb"
        @change="upload"
      />
    </div>
  </div>
</template>

<script>
import icons from '~/constant/icons';

export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      name: '',
      color: '',
      file: null,
      iconValue: this.icon,
      picture: '',
    };
  },
  computed: {
    icons() {
      return icons.map((icon) => `fa-${icon}`);
    },
    filterIcons() {
      return this.icons.filter((icon) =>
        icon.toLowerCase().includes(this.name.toLowerCase()),
      );
    },
  },
  methods: {
    onColorChange(color) {
      this.color = color;
      this.onChange();
    },
    onIconChange(icon) {
      this.iconValue = icon;
      this.picture = '';
      this.file = null;
      this.onChange();
    },
    async upload(event) {
      const file = event.target.files[0];

      if (!file.type.startsWith('image/')) {
        return this.$toast.error(this.$t('auth.signup.image.error'));
      }

      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.picture = reader.result;
        this.onChange();
      };
    },
    onChange() {
      this.$emit('change', {
        icon: this.iconValue,
        color: this.color,
        picture: this.picture,
        file: this.file,
      });
    },
  },
};
</script>
