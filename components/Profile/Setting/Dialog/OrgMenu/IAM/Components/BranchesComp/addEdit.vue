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
    class="create-brnach !w-[30rem]"
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
              editData
                ? $t('org.branches.editBranch')
                : $t('org.branches.addBranch')
            }}
          </div>
        </div>
      </div>
    </template>
    <div class="flex h-full flex-col justify-between overflow-hidden">
      <div class="hide-scrollbar mb-4 flex-1 overflow-auto px-3">
        <ProfileSettingDialogCompsBox>
          <div class="text-xs text-[rgba(176,176,176,0.50)]">
            Attach your organization page (optional)
          </div>
          <div class="mt-4 flex items-center">
            <img
              v-if="brand?.picture"
              :src="brand?.picture"
              class="mr-3 h-4 w-4 rounded-sm"
            />
            <i
              v-else
              class="fa-regular fa-globe mr-3 text-base text-white/20"
            />
            <el-popover
              v-model:visible="showBrands"
              trigger="click"
              width="88%"
              :teleported="false"
              :trigger-keys="[]"
            >
              <template #reference>
                <BaseInput
                  v-model="brand.name"
                  fixed
                  :title="$t('org.branches.orgName')"
                />
              </template>
              <BaseSelectBrands
                class="w-full"
                :name="brand.name"
                @select="handleChangeBrands"
              />
            </el-popover>
          </div>
          <div class="mt-6 flex items-center">
            <i class="fa-regular fa-text mr-3 text-base text-white/20" />
            <BaseInput
              v-model="branchName"
              fixed
              :title="$t('org.branches.branchName')"
            />
          </div>
          <ProfileSettingDialogCompsLocation
            ref="addressLocation"
            :draggable="false"
            :value="sites"
          />
        </ProfileSettingDialogCompsBox>
      </div>
      <div class="flex w-full items-center justify-end px-3 py-2">
        <BaseButton
          :disabled="!branchName"
          type="secondary"
          icon="fa-light fa-floppy-disk"
          :loading="loading"
          label="$t:org.branches.save"
          @click="onSave"
        />
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { createOrSites } from '~/api/v2/org';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
  editData: {
    type: Object,
    default: () => null,
  },
});
const emit = defineEmits(['update:modelValue', 'reference']);
const profileStore = useProfileStore();
const showBrands = ref(false);
const loading = ref(false);
const addressLocation = ref(null);
const sites = ref({});
const brand = ref({
  name: '',
  domain: '',
  picture: '',
});
const branchName = ref('');
const show = computed(() => props.modelValue);
// const branchesList = computed(() => {
//   const list = profileStore.myProfileDetail.sites || [];
//   return list;
// });

watch(
  () => props.editData,
  () => {
    sites.value = props.editData || {};
    branchName.value = props.editData?.name || '';
  },
  { immediate: true, deep: true },
);

const handleChangeBrands = (item) => {
  showBrands.value = false;
  brand.value = {
    name: item.name || '',
    domain: item.domain || '',
    picture: item.picture || '',
  };
};

const handleClose = () => {
  emit('update:modelValue', false);
  branchName.value = '';
  brand.value = {
    name: '',
    domain: '',
    picture: '',
  };
};

const onSave = async () => {
  const addressLocationAddress = addressLocation.value.getLocationInfo();
  const params = {
    ...addressLocationAddress,
    organizationId: profileStore.myProfileDetail.id,
    name: branchName.value,
    organizationPageLink: brand.value.domain,
    isHeadquarter: false,
  };
  try {
    if (loading.value) {
      return;
    }
    loading.value = true;
    await createOrSites(params);
    emit('reference');
    handleClose();
  } finally {
    loading.value = false;
  }
};
</script>
<style lang="scss">
.ProfileMenuDrawer {
  .create-brnach {
    .el-drawer__body {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
}
.create-brnach {
  .el-drawer__body {
    border-width: 0;
  }
}
</style>
