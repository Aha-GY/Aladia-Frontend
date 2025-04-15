<template>
  <div class="mt-4 flex flex-1 flex-col overflow-hidden">
    <div class="flex items-center gap-2">
      <div
        v-for="menu in menus"
        :key="menu"
        class="flex h-12 min-w-24 cursor-pointer items-center justify-center border-b px-4 text-base transition-all"
        :class="
          action === menu.type
            ? 'border-[#E9C238] font-semibold text-[#E9C238]'
            : 'hover:font-meduim border-transparent text-[#D9D9D9]/80 hover:border-[#D9D9D9] hover:text-[#D9D9D9]'
        "
        data-cy="49232f8babcd5b5a"
        @click="handleMenu(menu.type)"
      >
        {{ menu.label }}
      </div>
    </div>
    <ProfileSettingDialogOrgMenuIAMComponentsEditRole
      v-if="action === 'roles'"
      :invites="invites"
      @comfirm="handleComfirm"
    />
    <div v-if="action === 'log'" class="pt-20">
      <BaseNoData />
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  memberDetail: {
    type: Object,
    default: () => ({}),
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['comfirm']);
const { t } = useI18n();

const invites = computed(() => [{ ...props.memberDetail }]);
const menus = computed(() => {
  let menus = [];
  if (props.isOwner) {
    menus = [
      {
        label: t('org.activity.log'),
        type: 'log',
      },
    ];
  } else {
    menus = [
      {
        label: t('org.activity.roles'),
        type: 'roles',
      },
      {
        label: t('org.activity.log'),
        type: 'log',
      },
    ];
  }
  return menus;
});
const action = ref('');
const handleMenu = (type) => {
  action.value = type;
};
const handleComfirm = () => {
  emit('comfirm');
};

watch(
  () => props.isOwner,
  () => {
    action.value = menus.value[0].type;
  },
  { immediate: true },
);
</script>
