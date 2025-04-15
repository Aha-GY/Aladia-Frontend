<template>
  <div
    :class="showEditDrawer ? 'left-0' : 'left-[120%]'"
    class="absolute top-0 z-[100] flex h-full w-full flex-col overflow-hidden bg-[#060606] px-4 transition-all duration-300"
  >
    <div class="flex flex-1 flex-col overflow-hidden">
      <div
        class="py-4 pl-2 text-base text-[#D9D9D9]"
        @click="emit('update:modelValue', false)"
      >
        <i
          class="fa-sharp fa-solid fa-arrow-left mr-2 cursor-pointer"
          data-cy="901a418d6475d5d8"
        />
        <span>
          {{ $t('post.iam.members.add') }}
        </span>
      </div>
      <div class="h-[98%] overflow-hidden">
        <BaseMemberInvite
          :placeholder="$t('post.iam.members.placeholder')"
          :actives="invites"
          :is-enter="false"
          type="group"
          height="h-[98%]"
          from="organization"
          :submit-text="$t('post.iam.add')"
          :invite-loading="loading"
          :params="{
            organizationId: profileStore.myProfileDetail.id,
            alreadyMembers: true,
          }"
          @save="onSave"
          @close="onClose"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { createOrgGroupMember } from '~/api/v2/org';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  groupId: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['save', 'update:modelValue']);
const { t } = useI18n();
const $toast = useToast();
const profileStore = useProfileStore();
const showEditDrawer = ref(false);
watch(
  () => props.modelValue,
  (value) => {
    showEditDrawer.value = value;
    if (value) {
      invites.value = [];
      loading.value = false;
    }
  },
);
const invites = ref([]);
const onClose = () => {
  invites.value = [];
  emit('update:modelValue', false);
};

const loading = ref(false);

const onSave = async (user) => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  invites.value = user;
  try {
    await createOrgGroupMember({
      organizationId: profileStore.myProfileDetail.id,
      groupId: props.groupId,
      profileIds: invites.value.map((item) => item.id) || [],
    });
    $toast.success(t('post.add.success'));
    emit('save');
    onClose();
  } finally {
    loading.value = false;
  }
};
</script>
