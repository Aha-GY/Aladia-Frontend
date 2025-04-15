<template>
  <client-only>
    <el-dialog
      v-model="deletePopup.state"
      :show-close="false"
      append-to-body
      align-center
      :width="$device.isMobile ? '346px' : '600px'"
    >
      <div class="rounded-5 border border-white/10 bg-[#060606]">
        <div
          class="relative flex items-center justify-between rounded-t-5 bg-[#0c0c0c] p-4"
        >
          <div class="flex items-center gap-5">
            <i class="fa-solid fa-trash text-base text-[#D9D9D9]" />
            <div class="text-base text-[#B0B0B0]">
              {{ $t('calendar.delete.title') }}
            </div>
          </div>
          <BaseIconClose @click="onClose" />
        </div>
        <div class="px-4 py-6">
          <div class="mb-4 text-xs text-white/60">
            {{ $t('calendar.delete.content1') }}
            <span class="font-semibold">{{ detail.name }}?</span>
            {{
              detail.owner?.type === 'organization'
                ? `${$t('calendar.delete.form')}`
                : ''
            }}
            <span
              v-if="detail.owner?.type === 'organization'"
              class="font-semibold"
            >
              {{ name }}?
            </span>
            {{ $t('calendar.delete.content2') }}
          </div>
          <div class="flex items-center gap-1.5">
            <div class="flex h-4 w-4 items-center justify-center">
              <i
                class="fa-solid fa-calendar text-xs"
                :style="{ color: detail.color }"
              />
            </div>
            <div class="text-base text-[#D9D9D9]">{{ detail.name }}</div>
          </div>
        </div>
        <div class="flex items-center justify-end gap-5 p-4">
          <BaseButton
            label="$t:base.upload.cancel"
            type="secondary"
            @click="onClose"
          />
          <BaseButton type="error" @click="onDelete">
            <i
              v-if="loading"
              class="fa-light fa-loader animate-spin text-base"
            />
            {{
              detail.owner?.type === 'organization'
                ? $t('calendar.delete.deleteOrganization')
                : $t('calendar.delete.delete')
            }}
          </BaseButton>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  setup() {
    const hubCalendarStore = useHubCalendarStore();
    const profileStore = useProfileStore();
    const hubSidebar = useHubSidebarStore();
    return { hubCalendarStore, profileStore, hubSidebar };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    deletePopup() {
      return this.hubCalendarStore.delete;
    },
    detail() {
      return this.deletePopup.data;
    },
    name() {
      const name = this.profileStore?.myProfileDetail?.name;
      if (name) {
        return name;
      } else {
        const organizations =
          this.profileStore?.myProfileDetail?.organizations || [];
        return organizations.find((r) => r.id === this.detail.owner?.id)?.name;
      }
    },
  },
  methods: {
    onClose() {
      this.hubCalendarStore.delete.state = false;
    },
    async onDelete() {
      if (this.loading) {
        return;
      }
      this.loading = true;
      await this.hubCalendarStore.deleteCalendar({ id: this.detail.id });
      if (this.hubSidebar?.calendar?.data?.id === this.detail.id) {
        this.hubSidebar.state = false;
        this.hubSidebar.calendar.state = false;
      }
      this.loading = false;
      this.onClose();
    },
  },
};
</script>
