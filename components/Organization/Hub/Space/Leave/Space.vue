<template>
  <OrganizationHubSpacePopup>
    <div class="w-full rounded bg-black p-3 md:w-[36rem]">
      <div class="mb-3 flex items-center justify-between text-sm">
        <div class="flex items-center gap-3">
          <i class="fa-sharp fa-solid fa-trash" />
          {{ $t('space.leave.title') }}
        </div>
        <BaseIconClose
          data-cy="f37ae61809407c46"
          @click="hubSpaces.leaveSpace = false"
        />
      </div>
      <div class="mb-3 text-xs text-white/50">
        {{ $t('space.leave.dialog', { orgName: space.name }) }}
        {{ $t('space.leave.description') }}
      </div>
      <div class="mb-5 flex items-center gap-2 text-sm">
        <BaseSpaceLogo :space="space" />
        {{ space.name }}
      </div>
      <div class="flex justify-end">
        <BaseButton type="error" data-cy="eba48c459805a406" @click="onLeave">
          <i v-if="loading" class="fa-solid fa-spinner animate-spin text-xs" />
          {{ $t('org.leave') }}
        </BaseButton>
      </div>
    </div>
  </OrganizationHubSpacePopup>
</template>

<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    return { authStore, hubSpaces };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    space() {
      return this.hubSpaces.leaveSpace;
    },
  },
  methods: {
    async onLeave() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;

        await this.hubSpaces.setLeaveSpace({
          spaceId: this.space.id,
        });

        await this.hubSpaces.getSpaces();

        this.loading = false;
        this.hubSpaces.leaveSpace = false;
      } catch (error) {
        this.loading = false;
        throw error;
      }
    },
  },
};
</script>
