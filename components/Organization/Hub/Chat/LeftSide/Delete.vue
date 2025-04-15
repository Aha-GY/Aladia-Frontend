<template>
  <div
    class="flex cursor-pointer items-center rounded-5 p-2 text-[#FF4A4A]/80 transition-all hover:text-[#FF4A4A]"
    :class="
      isSide
        ? 'mt-2 h-14 rounded-none bg-[#0c0c0c] px-[1.375rem] pr-7 hover:bg-[#252525]'
        : 'gap-2 hover:bg-white/5 active:scale-95'
    "
    data-cy="OrganizationHubChatLeftSideDelete-1"
    @click="showDelete = true"
  >
    <div
      class="flex h-4 items-center justify-center"
      :class="isSide ? 'w-12' : 'w-4 text-sm'"
    >
      <i
        class="fa-solid fa-trash-can"
        :class="isSide ? 'text-xl' : 'text-xs'"
      />
    </div>
    <div>{{ $t(deleteText) }}</div>
  </div>
  <client-only>
    <el-dialog
      v-model="showDelete"
      :show-close="false"
      align-center
      append-to-body
      width="27.5rem"
      class="!rounded-lg"
    >
      <div
        class="rounded-md border border-[#fff]/10 bg-[#020202] p-3 text-sm text-white/80"
      >
        <div class="mb-3 flex items-center justify-between text-base">
          <div class="flex items-center gap-3">
            <i class="fa-sharp fa-solid fa-trash-can" />
            {{ $t(deleteText) }}
          </div>
          <BaseIconClose @click="showDelete = false" />
        </div>
        <div class="flex flex-col justify-center gap-4 text-white/60">
          <div
            v-if="item.type === 'one-to-one'"
            class="flex flex-col gap-2 p-2"
          >
            <div class="flex items-center justify-center gap-2 text-center">
              <OrganizationHubChatLeftSideMemberAvatar
                :item="item"
                :show-online="false"
              />
              {{ $t('org.activity.chat.clear.message') }}
            </div>
            <div
              class="flex cursor-pointer items-center justify-center gap-2 truncate hover:text-white/80"
              data-cy="87651be236050931"
              @click="deleteForAll = !deleteForAll"
            >
              <BaseCheckboxStyle
                :state="deleteForAll ? 'checked' : 'unchecked'"
              />
              <span class="truncate">
                {{
                  $t('org.activity.chat.clear.delete', { roomName: item.name })
                }}
              </span>
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center gap-4">
            <div class="flex items-center justify-center gap-2 text-center">
              <OrganizationHubChatLeftSideMemberAvatar
                :item="item"
                :show-online="false"
              />
              {{ $t('org.activity.chat.clear.leave', { group: item.name }) }}
            </div>
            <div
              v-if="isOwner"
              class="flex cursor-pointer items-center justify-center gap-2 hover:text-white/80"
              data-cy="e33f0ad1dcc5a48f"
              @click="deleteForAll = !deleteForAll"
            >
              <BaseCheckboxStyle
                :state="deleteForAll ? 'checked' : 'unchecked'"
              />
              {{ $t('org.activity.chat.clear.everyone') }}
            </div>
          </div>
          <div class="flex items-center justify-end gap-4">
            <BaseButton
              type="tertiary"
              data-cy="39f94a957258b1f4"
              @click="showDelete = false"
            >
              {{ $t('base.upload.cancel') }}
            </BaseButton>
            <BaseButton
              type="error"
              data-cy="OrganizationHubChatLeftSideDelete-2"
              :loading="deleteLoading"
              @click="onDelete"
            >
              {{ $t('base.editor.delete') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script>
export default {
  props: {
    item: Object,
    isSide: Boolean,
  },
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      showDelete: false,
      deleteForAll: false,
      deleteLoading: false,
    };
  },
  computed: {
    isOwner() {
      return this.item.userRole === 'chat-room-owner';
    },
    deleteText() {
      if (this.item.type === 'one-to-one') {
        return 'org.activity.chat.delete.label';
      } else {
        if (this.isOwner) {
          return 'org.activity.chat.delete.leave';
        } else {
          return 'org.activity.group.leave';
        }
      }
    },
  },
  watch: {
    showDelete: {
      handler(val) {
        if (!val) {
          this.deleteForAll = false;
        }
      },
    },
  },
  methods: {
    async onDelete() {
      this.deleteLoading = true;
      const params = {
        roomId: this.item.id,
      };
      if (this.isOwner) {
        params.deleteForAll = this.deleteForAll;
      } else {
        params.deleteForAll = false;
      }
      try {
        await this.hubChatStore.deleteRoom(params);
        this.deleteLoading = false;
        this.showDelete = false;
      } catch (error) {
        this.deleteLoading = false;
      }
    },
  },
};
</script>
