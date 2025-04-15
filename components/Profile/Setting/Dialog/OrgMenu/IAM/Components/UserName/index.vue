<template>
  <div class="group flex items-center gap-2 overflow-hidden pr-2">
    <div class="pl-2 pr-4">
      <BaseCheckboxStyle
        :state="isSelect ? 'checked' : 'unchecked'"
        data-cy="d6e2855692e3483d"
        @click="onSelect"
      />
    </div>
    <div
      class="flex flex-1 cursor-pointer items-center"
      @click="emit('rowClick')"
    >
      <div class="relative flex shrink-0 items-center justify-center">
        <BaseAvatarNext
          v-if="item.profile"
          :picture="item.profile?.picture"
          :story="item?.story"
          :user-id="item.profile.id"
          :online="item.profile.online"
          size="md"
        />
        <div v-else class="flex h-14 w-14 items-center justify-center">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2c2c]"
          >
            <i class="fa-solid fa-envelope text-xl" />
          </div>
        </div>
      </div>
      <div class="ml-1.5 w-0 flex-1 truncate">
        <div>
          <span
            class="text-[#f1f1f1]"
            v-html="highlightKeywords(userName, [searchValue])"
          />
          <template v-if="from !== 'groups'">
            <el-tooltip
              placement="right-start"
              effect="light"
              popper-class="!text-[#707070] !bg-[rgba(0,0,0,0.40)] !border-[0.01875rem] !border-[rgba(255,255,255,0.40)] !backdrop-blur-[0.1875rem]"
              :show-arrow="false"
            >
              <template #content>
                <div class="p-1.5 text-sm">
                  <span v-if="item.acceptedInvitation">
                    Joined on {{ formatDate(item?.invitedAt, 'DD MMM YYYY') }}
                  </span>
                  <span v-else>
                    invitation sent on
                    {{ formatDate(item?.invitedAt, 'DD MMM YYYY') }}
                  </span>
                </div>
              </template>
              <span
                v-if="item.acceptedInvitation"
                class="ml-3 cursor-pointer text-xs text-[#707070]"
              >
                <i class="fa-regular fa-circle-info" />
              </span>
              <span
                v-else
                class="cursor-pointer !text-[#F0CA41]"
                @click.stop="handleOpenAccedted"
              >
                <i class="fa-regular fa-envelope-dot ml-3 text-xs" />
                {{ $t('org.invited.label') }}
              </span>
            </el-tooltip>
          </template>
        </div>
        <ProfileSettingDialogOrgMenuIAMComponentsUserNameAddressItem
          :data="item.profile?.address"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  searchValue: {
    type: String,
    default: '',
  },
  from: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['rowClick']);
const isSelect = ref(false);

const userName = computed(() => {
  if (props.item.profile?.firstName) {
    return `${props.item.profile.firstName} ${props.item.profile.lastName}`;
  }
  return props.item.email || $t('org.invited.none');
});

const onSelect = () => {
  isSelect.value = !isSelect.value;
};

const handleOpenAccedted = () => {
  console.log('--------------↓↓↓↓↓---------------------');
  console.log(11);
  console.log('--------------↑↑↑↑↑---------------------');
};
</script>
