<template>
  <el-drawer
    v-model="show"
    :with-header="true"
    :show-close="false"
    :lock-scroll="false"
    destroy-on-close
    :modal="false"
    :close-on-press-escape="false"
    :append-to-body="!isLeftDrawer"
    :class="{
      'is-body-drawer': !isLeftDrawer,
    }"
    class="!w-[30rem]"
    @close="handleClose"
  >
    <template #header>
      <div class="flex items-center justify-between pr-6 text-[#b0b0b0]">
        <div class="flex items-center">
          <div
            class="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center"
            data-cy="53cece51632c91d1"
            @click="handleClose"
          >
            <i class="fa-sharp fa-solid fa-arrow-left text-lg" />
          </div>
          <div class="text-lg">
            {{
              memberProfile.id
                ? `${memberProfile.firstName} ${memberProfile.lastName}`
                : memberDetail?.email
            }}
          </div>
        </div>
      </div>
    </template>
    <div
      v-loading="loading"
      class="relative flex h-full flex-col overflow-hidden"
      :class="{
        'p-4': !isLeftDrawer,
      }"
    >
      <div
        class="relative mb-16 flex h-[6.8rem] w-[100%] items-center justify-center rounded-md bg-[#1C1C1C]/35"
      >
        <img
          v-if="memberProfile.cover"
          class="h-full w-full rounded-md object-cover"
          :src="memberProfile.cover"
        />
        <div v-else class="relative rounded-md bg-[#060606] px-3 py-1">
          <i class="fa-solid fa-panorama text-[2rem] text-[#505050]" />
        </div>
        <el-tooltip effect="light" placement="bottom-end">
          <template #content>
            <span class="cursor-pointer">
              {{ memberDetail.id }}
            </span>
          </template>
          <div
            class="absolute right-2 top-2 cursor-pointer rounded-5 border-[0.3px] border-white/40 bg-black/40 px-1.5 py-1"
            @click="handleCopy(memberDetail.id)"
          >
            <!-- Member ID -->
            {{
              $t('base.member.id', { groupId: shortenString(memberDetail.id) })
            }}
            <i class="fa-sharp fa-solid fa-copy ml-1 text-white" />
          </div>
        </el-tooltip>
        <div
          class="absolute bottom-[-3.4rem] left-2 flex w-full items-center justify-between"
        >
          <div class="rounded-full bg-[#060606] p-1">
            <BaseAvatarNext
              v-if="memberProfile.id"
              :picture="memberProfile.picture"
              :story="memberProfile?.story"
              :user-id="memberProfile?.id"
              :online="memberProfile.online"
              size="lg"
            />
            <div
              v-else
              class="flex h-[5.875rem] w-[5.875rem] items-center justify-center"
            >
              <div
                class="flex h-20 w-20 items-center justify-center rounded-full bg-[#2c2c2c]"
              >
                <i class="fa-solid fa-envelope text-xl" />
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-hidden pl-4 pt-8">
            <div class="line-clamp-1 text-base font-medium text-[#d9d9d9]">
              {{
                memberProfile.id
                  ? `${memberProfile.firstName} ${memberProfile.lastName}`
                  : memberDetail?.email
              }}
            </div>
            <div class="line-clamp-1 text-xs text-[#707070]">
              {{ memberProfile.id ? memberProfile?.email : 'other' }}
            </div>
          </div>
          <div class="mt-8 scale-75">
            <ProfileStatus :detail="memberProfile" />
          </div>
        </div>
      </div>
      <div
        class="mt-2 flex w-full items-center justify-between rounded-5 bg-[#fff]/5 px-3.5 py-2"
      >
        <div class="flex items-center">
          <BaseButton
            class="mr-2 h-6 text-xs"
            @click="onChangeFollow(!memberProfile.isFollowing)"
          >
            <i v-if="followLoading" class="fa-solid fa-spinner animate-spin" />
            <i
              v-else-if="memberProfile.isFollowing"
              class="fa-solid fa-circle-check"
            />
            <i v-else class="fa-light fa-user-plus" />
            {{
              memberProfile.isFollowing
                ? $t('base.member.following')
                : $t('base.member.follow')
            }}
          </BaseButton>
          <BaseButton
            class="mr-1 text-[#FAFAFA]"
            icon="fa-sharp fa-solid fa-comment"
            type="tertiary"
            label="Message"
            @click="handleChat"
          />
          <BaseButton
            class="mr-1 text-[#FAFAFA]"
            icon=" fa-solid fa-envelope"
            type="tertiary"
            label="$t:personal.email"
          />
        </div>
        <div
          class="cursor-pointer rounded-5 border border-[rgba(226,226,226,0.08)] bg-[#450A0A] px-1.5 py-1 text-xs font-medium text-[#EF4444] hover:bg-opacity-60"
          @click="handleRemoveUser"
        >
          <i
            v-if="removeLoading"
            class="fa-solid fa-spinner animate-spin text-xs"
          />
          {{ $t('personal.remove.user') }}
        </div>
      </div>
      <ProfileSettingDialogOrgMenuIAMComponentsMemberDetailDrawerRole
        :member-detail="memberDetail"
        :is-owner="isOwner"
        @comfirm="handleUpdateRole"
      />
    </div>
  </el-drawer>
</template>
<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { deleteMembersInvitation, deleteMembers } from '~/api/v2/org';
import { retrieveProfile } from '~/api/v2/profile';
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
  memberDetail: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue', 'reference']);
const { t } = useI18n();
const $toast = useToast();
const { $eventBus } = useNuxtApp();
const { copy } = useClipboard();
const handleCopy = (value) => {
  if (!value) {
    return;
  }
  copy(value);
  $toast.success(t('index.copy.done'));
};
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();
const profileStore = useProfileStore();
const followLoading = ref(false);
const show = computed(() => props.modelValue);
const removeLoading = ref(false);
const memberProfile = ref({});
const isOwner = ref(false);
const handleClose = () => {
  emit('update:modelValue', false);
};
const onChangeFollow = async () => {
  if (!memberProfile.value.id || followLoading.value) {
    return;
  }
  followLoading.value = true;
  try {
    await profileStore.follow(memberProfile.value);
    await getMemberDetail();
  } catch (error) {
    console.log(error);
  } finally {
    followLoading.value = false;
  }
};
const handleChat = () => {
  if (!memberProfile.value.id) {
    return;
  }
  $eventBus.emit(profileEvent.CLOSE_PROFILE_DRAWER);
  const url = `/${authStore.isOrg ? 'organization' : 'user'}/hub/${profileStore.myProfileDetail.id}/chat?${memberProfile.value?.entityType === 'organization' ? 'orgId' : 'userId'}=${memberProfile.value.id}`;
  router.push(url);
};

const handleRemoveUser = async () => {
  if (removeLoading.value) {
    return;
  }
  removeLoading.value = true;
  try {
    if (!props.memberDetail.acceptedInvitation) {
      await deleteMembersInvitation({
        organizationId: profileStore.myProfileDetail.id,
        email: memberProfile.value.email || props.memberDetail.email,
      });
    } else {
      await deleteMembers({
        organizationId: profileStore.myProfileDetail.id,
        userId: memberProfile.value.id,
      });
    }
    emit('reference');
    emit('update:modelValue', false);
    $toast.success(t('personal.remove.success'));
  } catch (error) {
    console.log(error);
  } finally {
    removeLoading.value = false;
  }
};

const getMemberDetail = async () => {
  loading.value = true;
  if (!memberProfile.value.id) {
    loading.value = false;
    return;
  }
  try {
    const data = await retrieveProfile({
      profileId: memberProfile.value.id,
    });
    memberProfile.value = {
      ...memberProfile.value,
      ...data,
    };
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const handleUpdateRole = () => {
  emit('reference');
};
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      isOwner.value = props.memberDetail.role === 'organization-owner';
      memberProfile.value = props.memberDetail?.profile || {};
      getMemberDetail();
    } else {
      memberProfile.value = {};
    }
  },
  { immediate: true, deep: true },
);
</script>
