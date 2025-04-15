<template>
  <OrganizationHubSpacePopup>
    <div class="w-full rounded bg-black p-3 md:w-[36rem]">
      <div class="mb-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <i class="fa-sharp fa-solid fa-trash" />
          {{ $t('space.delete.label') }}
        </div>
        <BaseIconClose
          data-cy="45b65e92d0089ba3"
          @click="hubSpaces.deleteSpace = false"
        />
      </div>
      <div class="mb-3 text-xs text-white/50">
        {{
          $t('space.delete.dialog', {
            orgName: space?.name,
          })
        }}
        {{ $t('space.delete.description') }}
      </div>
      <div class="mb-5 flex items-center gap-2 text-sm">
        <BaseSpaceLogo :space="space" />
        {{ space.name }}
      </div>
      <div class="flex justify-end">
        <BaseButton type="error" data-cy="156296bc134f3677" @click="onDelete">
          <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
          {{ $t('space.delete.button') }}
        </BaseButton>
      </div>
    </div>
  </OrganizationHubSpacePopup>
</template>

<script>
export default {
  setup() {
    const hubSpaces = useHubSpacesStore();
    return { hubSpaces };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    space() {
      return this.hubSpaces.deleteSpace;
    },
  },
  methods: {
    async onDelete() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;

        await this.hubSpaces.removeSpace({
          spaceId: this.space.id,
        });

        await this.hubSpaces.getSpaces();

        this.loading = false;
        this.hubSpaces.deleteSpace = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>
