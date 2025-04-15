<template>
  <el-popover
    v-model:visible="show"
    trigger="click"
    :show-arrow="false"
    :offset="10"
    placement="top-end"
    :popper-style="{
      border: 'none',
      borderRadius: '0.3125rem',
      width: 'auto !important',
    }"
  >
    <template #reference>
      <div class="flex items-end self-stretch">
        <div class="relative flex flex-shrink-0 cursor-pointer items-end">
          <BaseAvatarNext
            :picture="curUser.picture"
            :show-online="false"
            size="md"
          />
          <div class="absolute bottom-1 right-1">
            <div
              class="full flex size-4 items-center justify-center rounded-full bg-[#0B0B0B]"
            >
              <i class="fa-regular fa-chevron-down text-xs text-[#707070]" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="flex flex-col gap-2 rounded-5 p-2 text-sm text-white/60">
      <div class="px-4 py-2 text-base text-white">
        {{ $t('org.activity.message.send.as') }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-1 rounded-5 p-2 hover:bg-white/10"
        data-cy="4d7863495964f7ee"
        @click="onChecked('organization')"
      >
        <div class="relative">
          <BaseAvatarNext
            :picture="org.picture"
            :show-online="false"
            size="md"
          />
          <div
            class="absolute bottom-1 right-1 rounded-full bg-[#0A0A0A] p-0.5"
          >
            <BaseCheckboxStyle
              :state="
                checked === 'organization' ? 'correctChecked' : 'unchecked'
              "
            />
          </div>
        </div>
        {{ org.name }}
      </div>
      <div
        class="flex cursor-pointer items-center gap-1 rounded-5 p-2 hover:bg-white/10"
        data-cy="adbd6cd5cf086b10"
        @click="onChecked('organization-member')"
      >
        <div class="relative">
          <BaseAvatarNext
            :picture="user.picture"
            :show-online="false"
            size="md"
          />
          <div
            class="absolute bottom-1 right-1 rounded-full bg-[#0A0A0A] p-0.5"
          >
            <BaseCheckboxStyle
              :state="
                checked === 'organization-member'
                  ? 'correctChecked'
                  : 'unchecked'
              "
            />
          </div>
        </div>
        <div>{{ user.fullName }}</div>
        <div class="text-white/40">
          {{ $t('meet.from') }}
        </div>
        <div class="flex items-center gap-1">
          <BaseAvatarNext
            v-if="org.picture"
            :picture="org.picture"
            :show-online="false"
            size="md"
          />
          {{ org.name }}
        </div>
      </div>
      <div class="flex justify-end gap-5 p-2">
        <BaseButton
          icon="fa fa-reply"
          type="tertiary"
          data-cy="25ee79cafb4fc043"
          @click="show = false"
        >
          {{ $t('base.upload.cancel') }}
        </BaseButton>
        <BaseButton
          icon="fa fa-check"
          type="primary"
          data-cy="f44f8e4d7e72c715"
          @click="onChange"
        >
          {{ $t('base.upload.confirm') }}
        </BaseButton>
      </div>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: {
    mode: String,
  },
  emits: ['change'],
  setup() {
    const hubChatStore = useHubChatStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    return { hubChatStore, authStore, profileStore };
  },
  data() {
    return {
      show: false,
      checked: '',
    };
  },
  computed: {
    user() {
      return this.profileStore.myUserProfileDetail;
    },
    org() {
      return this.profileStore.myOrgProfileDetail;
    },
    curUser() {
      if (this.checked === 'organization') {
        return this.org;
      } else {
        return this.user;
      }
    },
  },
  watch: {
    show: {
      immediate: true,
      handler() {
        this.checked = this.mode;
      },
    },
  },
  mounted() {
    this.checked = this.mode;
  },
  methods: {
    onChecked(mode) {
      this.checked = mode;
    },
    onChange() {
      this.$emit('change', this.checked);
      this.show = false;
    },
  },
};
</script>
