<template>
  <div class="flex h-12 items-center pl-[6.1rem]">
    <div class="mr-4 flex size-6 items-center justify-center">
      <i class="fa-solid fa-folder-plus text-white/50" />
    </div>
    <div class="mr-8 w-48 text-sm">
      <BaseInput v-model="name" fixed placeholder="New folder" />
    </div>
    <div
      v-show="name"
      class="flex cursor-pointer items-center gap-2 rounded bg-black px-2 py-1 text-13 text-white/70 hover:bg-white/10 hover:text-white"
      data-cy="f8e513968b7801f1"
      @click="onCreate"
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
      <i v-else class="fa-light fa-check" />
      {{ $t('base.upload.save') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    space: Object,
  },
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      name: '',
      loading: false,
    };
  },
  methods: {
    async onCreate() {
      if (this.loading) {
        return;
      }

      if (!this.name) {
        return this.$toast.error(this.$t('course.error.folder.name'));
      }

      if (!this.space?.id) {
        return this.$toast.error(this.$t('course.error.space'));
      }

      try {
        this.loading = true;

        await this.hubSpaces.createFolder({
          spaceId: this.space.id,
          name: this.name,
          parent: this.space.rootFolder.id,
        });

        await this.hubSpaces.getFolders({
          spaceId: this.space.id,
        });

        this.hubSpaces.getSpaces();

        this.name = '';
        this.loading = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>
