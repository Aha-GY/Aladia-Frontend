<template>
  <div
    class="relative flex flex-1 flex-col justify-between overflow-hidden px-[0.38rem] py-2"
  >
    <div class="flex flex-1 flex-col overflow-hidden">
      <div class="flex flex-1 flex-col overflow-hidden">
        <div class="text-base text-[#D9D9D9]">
          {{ $t('calendar.role.organization') }}
        </div>
        <div class="hide-scrollbar mt-2 flex-1 overflow-y-auto">
          <div
            v-for="item in roleList"
            :key="item.value"
            class="mb-2 cursor-pointer rounded-5 border-l border-transparent px-2 py-[0.08rem] transition-all duration-200 hover:bg-[#131313]"
            :class="{
              'hover:border-[#9D50ED]': item.value === 'organization-member',
              'hover:border-[#9E1515]': item.value === 'organization-admin',
              'bg-[#131313]': item.value === activeRole,
            }"
          >
            <div
              class="flex h-10 items-center justify-between"
              data-cy="01c90c01dd6fb095"
              @click="handleSelectRole(item.value)"
            >
              <div class="flex-1">
                <i :class="item.icon" class="pl-3" />
                <span class="ml-2 text-sm text-[#FAFAFA]">
                  {{ $t(item.label) }}
                </span>
              </div>
              <div class="pr-3">
                <BaseCheckboxStyle
                  :state="activeRole === item.value ? 'checked' : 'unchecked'"
                />
              </div>
            </div>
            <div
              class="overflow-hidden transition-all duration-200"
              :class="{
                'h-0': activeRole !== item.value,
                'h-[19rem]': activeRole === item.value,
              }"
            >
              <div
                v-for="ele in item.typeRoles"
                :key="ele.value"
                class="mb-[0.63rem] rounded-5 bg-[#191919] px-4 py-2 text-base text-[#D9D9D9] transition-all duration-300 hover:pl-6"
                @click="handleSelectTypeRole(ele.label)"
              >
                <div class="flex h-9 items-center justify-between">
                  <div>{{ $t(ele.title) }}</div>
                  <i :class="ele.icon" class="pl-3" />
                </div>
              </div>
              <div
                v-for="item in billingAndDeveloper"
                :key="item.value"
                class="mx-2 flex items-center justify-between rounded-5 p-2 hover:bg-[#191919]"
                @click="handleSelectCheckedBillingDeveloper(item.value)"
              >
                <div class="flex flex-1 items-center">
                  <div
                    class="relative mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#232222] transition-all duration-200"
                  >
                    <i :class="item.icon" />
                    <div
                      class="absolute -bottom-1 -right-2 flex items-center justify-center rounded-full bg-black p-1"
                    >
                      <i class="fa-light fa-circle-exclamation" />
                    </div>
                  </div>
                  <div>{{ $t(item.label) }}</div>
                </div>
                <BaseCheckboxStyle
                  :state="item.checked ? 'correctChecked' : 'unchecked'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex items-end justify-end py-1">
        <BaseButton
          :disabled="inviteBtnDisabled"
          type="secondary"
          icon="fa-light fa-paper-plane"
          :loading="loading"
          data-cy="3c686418f536530c"
          @click="handlerSend"
        >
          <span>{{ $t('org.group.invite.save') }}</span>
        </BaseButton>
      </div>
    </div>
    <div
      :class="showRoleBody ? 'left-0' : 'left-[102%]'"
      class="absolute top-0 z-50 flex h-full w-full flex-col bg-[#060606] transition-all duration-300"
    >
      <div class="flex items-center py-4 pl-2 text-base text-[#D9D9D9]">
        <div
          class="mr-2 flex cursor-pointer items-center justify-center rounded-5 px-1.5 py-1.5 hover:bg-white/5"
          data-cy="901a418d6475d5d8"
          @click="showRoleBody = false"
        >
          <i class="fa-sharp fa-solid fa-arrow-left" />
        </div>
        <span>
          {{ $t('calendar.role.select.assign') }}
          <span class="capitalize">{{ activeTypeRole }}</span>
          {{ $t('calendar.role.select.role') }}
        </span>
      </div>
      <template v-if="showRoleBody">
        <ProfileSettingDialogOrgMenuIAMComponentsSpaceCoursesRoles
          v-if="activeTypeRole === 'Space & Courses'"
          is-edit
          :user-id="userId"
          :value="selectSpaceCoursesValue"
          :invites="invites"
          @back="showRoleBody = false"
          @change="handleChangeSpaceCourses"
        />
        <ProfileSettingDialogOrgMenuIAMComponentsCalendarsRoles
          v-if="activeTypeRole === 'Calendars'"
          is-edit
          :user-id="userId"
          :value="selectCalendarsValue"
          :invites="invites"
          @back="showRoleBody = false"
          @change="handleChangeCalendars"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { roleList } from '../CONST';

import {
  updateOrgGroupMemberRole,
  patchOrgMembersResources,
  organizationInvitationsMembers,
} from '~/api/v2/org';

const props = defineProps({
  invites: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'user',
  },
});
const emit = defineEmits(['comfirm']);
const { t } = useI18n();
const $toast = useToast();
const profileStore = useProfileStore();
const activeRole = ref('');
const activeTypeRole = ref('');
const showRoleBody = ref(false);
const selectCalendarsValue = ref([]);
const selectSpaceCoursesValue = ref({ spaces: [], courses: [] });
const loading = ref(false);
const billingAndDeveloper = ref([
  {
    label: 'calendar.role.billing.mgr',
    icon: 'fa-solid fa-dollar-sign text-base',
    value: 'organization-billing-manager',
    checked: false,
  },
  {
    label: 'calendar.role.developer',
    icon: 'fa-solid fa-code text-sm',
    value: 'organization-developer',
    checked: false,
  },
  {
    label: 'SocialMedia Manager',
    icon: 'fa-solid fa-share-nodes text-sm',
    value: 'organization-social-manager',
    checked: false,
  },
]);

const inviteBtnDisabled = computed(() => {
  const inviteBtnDisabled =
    !props.invites.length || !activeRole.value || loading.value;

  return inviteBtnDisabled;
});

const commonParams = computed(() => ({
  organizationId: profileStore.myProfileDetail.id,
  spaces:
    selectSpaceCoursesValue.value.spaces?.map((item) => ({
      id: item.id,
      role: item.role,
    })) || [],
  courses:
    selectSpaceCoursesValue.value.courses?.map((item) => ({
      id: item.id,
      spaceId: item.spaceId,
      role: item.role,
    })) || [],
  calendars:
    selectCalendarsValue.value.map((item) => ({
      id: item.id,
      role: item.role,
    })) || [],
  secondaryRoles: billingAndDeveloper.value
    .filter((item) => item.checked)
    .map((item) => item.value),
}));

const userId = computed(() =>
  props.invites[0].acceptedInvitation
    ? props.invites[0].profile.id
    : props.invites[0].id,
);

const initData = () => {
  activeRole.value = props.invites[0].role;
  billingAndDeveloper.value.forEach((item) => {
    item.checked = props.invites[0].secondaryRoles?.includes(item.value);
  });
};

watch(
  () => props.invites,
  () => {
    initData();
  },
  { immediate: true, deep: true },
);

const clearData = () => {
  activeRole.value = '';
  showRoleBody.value = false;
  activeTypeRole.value = '';
  selectCalendarsValue.value = [];
  selectSpaceCoursesValue.value = { spaces: [], courses: [] };
  billingAndDeveloper.value.forEach((item) => {
    item.checked = false;
  });
};

const handleSelectRole = (role) => {
  if (role === activeRole.value) {
    clearData();
  } else {
    clearData();
    activeRole.value = role;
  }
};

const handleSelectTypeRole = (role) => {
  showRoleBody.value = true;
  activeTypeRole.value = role;
};

const handleSelectCheckedBillingDeveloper = (value) => {
  const index = billingAndDeveloper.value.findIndex(
    (item) => item.value === value,
  );
  billingAndDeveloper.value[index].checked =
    !billingAndDeveloper.value[index].checked;
};
const handleChangeCalendars = (value) => {
  selectCalendarsValue.value = value;
  showRoleBody.value = false;
};

const handleChangeSpaceCourses = (value) => {
  selectSpaceCoursesValue.value = value;
  showRoleBody.value = false;
};

const handlerSend = () => {
  if (props.type === 'group') {
    handlerGroupSend();
  } else {
    if (props.invites[0].acceptedInvitation) {
      handlerUserSend();
    } else {
      handlerInviteUserSend();
    }
  }
};

const handlerGroupSend = async () => {
  try {
    if (inviteBtnDisabled.value) {
      return;
    }
    loading.value = true;
    const { updated } = await updateOrgGroupMemberRole({
      groupId: userId.value,
      role: activeRole.value,
      ...commonParams.value,
    });
    if (updated) {
      $toast.success(t('calendar.update.success.group'));
      emit('comfirm');
    }
  } finally {
    loading.value = false;
  }
};

const handlerUserSend = async () => {
  try {
    if (inviteBtnDisabled.value) {
      return;
    }
    loading.value = true;
    const { updated } = await patchOrgMembersResources({
      userId: userId.value,
      role: activeRole.value,
      ...commonParams.value,
    });
    if (updated) {
      $toast.success(t('calendar.update.success.member'));
      emit('comfirm');
    }
  } finally {
    loading.value = false;
  }
};

const handlerInviteUserSend = async () => {
  try {
    if (inviteBtnDisabled.value) {
      return;
    }
    loading.value = true;
    const { invited } = await organizationInvitationsMembers({
      ids: [],
      role: activeRole.value,
      emails: props.invites.map((item) => item.email) || [],
      ...commonParams.value,
      spaces: commonParams.value.spaces.filter((item) => item.role) || [],
      courses: commonParams.value.courses.filter((item) => item.role) || [],
      calendars: commonParams.value.calendars.filter((item) => item.role) || [],
    });
    if (invited) {
      $toast.success(t('calendar.update.success.invite'));
      emit('comfirm');
    }
  } finally {
    loading.value = false;
  }
};
</script>
