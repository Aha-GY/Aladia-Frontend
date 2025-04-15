<template>
  <div class="flex items-center gap-4">
    <div
      ref="toggleRef"
      class="group/input relative flex flex-1 items-center justify-between pb-1 pr-6 font-light"
    >
      <div
        class="flex-1 cursor-pointer hover:text-white"
        :class="[members.length === 0 ? 'text-[#707070]' : 'text-[#d9d9d9]']"
        data-cy="6be89a3c022cf592"
        @click="handleClickMembers"
      >
        {{
          members.length
            ? $t('category.transaction.selectUsersCount', {
                count: members.length,
              })
            : text
        }}
      </div>
      <BaseMemberPreview
        :open="open"
        :members="members"
        :add="true"
        :remove="true"
        width="1.875rem"
        gap="0.375rem"
        class="absolute -top-3 right-0"
        add-icon-size-class="text-base"
        @open="handleClickAdd"
        @remove="onRemoveClick"
      />
      <BaseLine :active="open" />
    </div>
  </div>
  <el-popover
    width="26.5rem"
    :visible="open"
    :virtual-ref="toggleRef"
    placement="bottom-start"
    :show-arrow="false"
    :popper-options="{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }"
  >
    <div ref="popupRef" v-loading="sidebarFilterLoading" class="h-96 pt-2">
      <BaseMemberInvite
        v-if="add"
        class="pb-2"
        :is-enter="false"
        :actives="members"
        :exclude="[]"
        :type="paymentType"
        :use-popover="false"
        not-save-when-remove-user
        @close="open = false"
        @save="onSave"
      />
      <BaseMemberInvitePureList
        v-else
        :members="members"
        @close="open = false"
        @add="add = true"
        @remove="onRemoveClick"
      />
    </div>
  </el-popover>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'Users',
  },
  filterParams: {
    type: Object || null,
  },
  type: {
    type: String,
    required: true,
  },
  filterKey: {
    type: String, // customerIds || supplierIds
    required: true,
  },
});
const emits = defineEmits(['change']);

const hubPaymentStore = useHubPaymentStore();
const paymentType = computed(() => props.type);
const open = ref(false);
const add = ref(true);
const toggleRef = ref(null);
const popupRef = ref(null);
const members = ref([]);
const sidebarFilterLoading = computed(
  () => hubPaymentStore.sidebarFilterLoading,
);

onClickOutside(
  popupRef,
  () => {
    open.value = false;
  },
  { ignore: ['.el-popper'] },
);

watch(
  () => props.filterParams,
  (value) => {
    if (value && value[props.filterKey]) {
      members.value = value[props.filterKey];
    } else {
      members.value = [];
    }
  },
  { immediate: true },
);

function handleClickAdd() {
  open.value = true;
  add.value = true;
}

function handleClickMembers() {
  open.value = true;
  add.value = false;
}

function onSave(user) {
  members.value = user;
  emits('change', {
    [props.filterKey]: user,
  });
  open.value = false;
  add.value = false;
}

function onRemoveClick(member) {
  const newMembers = members.value.filter((item) => item.id !== member.id);
  members.value = newMembers;
  emits('change', {
    [props.filterKey]: newMembers,
  });
}
</script>
