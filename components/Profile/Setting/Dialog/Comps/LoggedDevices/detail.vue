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
      <div class="flex items-center justify-between px-2 pr-6 text-[#b0b0b0]">
        <div class="flex items-center">
          <div
            class="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center"
            @click="handleClose"
          >
            <i class="fa-sharp fa-solid fa-arrow-left text-lg" />
          </div>
          <div class="text-lg">
            {{ $t('personal.profile.logged.detail.label') }}
          </div>
        </div>
      </div>
    </template>
    <div
      v-loading="loading"
      class="relative flex h-full flex-col overflow-hidden pt-4"
      :class="{
        'p-4': !isLeftDrawer,
      }"
    >
      <div class="flex-1">
        <div class="rounded-5 border-l border-[#EB4937] bg-white/5 p-3">
          <div class="text-base text-[#D9D9D9]">
            {{ $t('personal.profile.logged.detail.title') }}
          </div>
          <div class="mt-3 text-xs text-[#B0B0B0]">
            {{ $t('personal.profile.logged.detail.content') }}
          </div>
        </div>
        <BaseGoogleMaps
          class="mt-4 rounded-5"
          :center="{
            lat: props.detail?.latitude || 0,
            lng: props.detail?.longitude || 0,
          }"
          :zoom="1"
          :draggable="false"
        />
      </div>
      <div class="mb-7 flex w-full items-center justify-end">
        <BaseButton
          label="$t:base.upload.cancel"
          type="secondary"
          @click="handleClose"
        />
        <BaseButton
          class="ml-7 !bg-[#B91C1C] !text-[#0A0A0A] hover:opacity-90"
          label="$t:personal.profile.logged.detail.logout"
          :loading="props.isLoading"
          :disabled="props.isLoading"
          @click="props.onLogout"
        />
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  isLeftDrawer: {
    type: Boolean,
    default: false,
  },
  detail: {
    type: Object,
    default: () => ({}),
  },
  onLogout: {
    type: Function,
    default: () => ({}),
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'reference']);
const loading = ref(false);
const show = computed(() => props.modelValue);

const handleClose = () => {
  emit('update:modelValue', false);
};

// watch(
//   () => props.modelValue,
//   (value) => {

//   },
//   { immediate: true, deep: true },
// );
</script>
