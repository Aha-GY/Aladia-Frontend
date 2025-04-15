<template>
  <NuxtLayout :footer="false" class="ml-36">
    <div>Options:</div>
    <div class="flex items-center gap-8 p-12">
      <el-select v-model="size" placeholder="select size" style="width: 120px">
        <el-option
          v-for="item in SIZES"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-checkbox v-model="withIcon" label="With Icon" size="large" />
      <el-checkbox v-model="loading" label="Loading" size="large" />
      <el-checkbox v-model="disabled" label="Disabled" size="large" />
    </div>
    <div>Current ones:</div>
    <div class="flex items-center gap-10 p-12">
      <BaseButton
        v-for="buttonItem in TYPES"
        :key="buttonItem.type"
        :label="buttonItem.label"
        :type="buttonItem.type"
        :icon="withIcon ? buttonItem.icon : ''"
        :loading="loading"
        :disabled="disabled"
        :size="size"
      />
    </div>

    <!-- new added -->
    <div class="mb-6">New add outline:</div>
    <div class="flex gap-10 pl-12">
      <BaseButton
        label="Outline Basic"
        type="outline"
        :icon="withIcon ? 'fa-folder-plus' : ''"
        :loading="loading"
        :disabled="disabled"
        :size="size"
      />

      <BaseButton type="outline" :disabled="disabled" :size="size">
        <span v-if="withIcon" class="group-hover/btn:hidden">
          <i
            v-if="withIcon"
            :class="
              loading
                ? 'fa-light fa-spinner animate-spin'
                : 'fa-light fa-folder-plus'
            "
          />
        </span>
        <div v-if="withIcon" class="hidden group-hover/btn:flex">
          <i class="fa-solid fa-folder-plus" />
        </div>
        Outline animated icon
      </BaseButton>
    </div>

    <div class="my-6">Compared with the current design in pages</div>

    <div class="flex items-center gap-10 p-4 pl-12">
      <div>
        <div class="mb-2">From the space page</div>
        <div
          class="group/btn flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded border border-white/30 px-3 transition-all hover:border-white/0 hover:bg-white/5"
          data-cy="new-folder-button"
        >
          <span class="group-hover/btn:hidden">
            <i class="fa-light fa-folder-plus" />
          </span>
          <span class="hidden group-hover/btn:flex">
            <i class="fa-solid fa-folder-plus" />
          </span>
          {{ $device.isMobile ? $t('space.folder') : $t('space.new.folder') }}
        </div>
      </div>

      <div>
        <div class="mb-2">From the Calendar page</div>
        <div class="flex">
          <div
            class="group/btn flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded border border-white/30 px-3 text-xs font-semibold transition-all hover:border-white/0 hover:bg-white/5"
            data-cy="new-calendar-icon"
          >
            <span class="group-hover/btn:hidden">
              <i class="fa-light fa-plus" />
            </span>
            <span class="hidden group-hover/btn:flex">
              <i class="fa-solid fa-plus" />
            </span>
            {{ $t('event.new') }}
          </div>
        </div>
      </div>

      <div>
        <div class="mb-2">From the Profile.Review page</div>
        <div class="flex">
          <div
            class="cursor-pointer rounded-5 border border-[#292929] px-2 py-1 text-sm font-medium text-[#FAFAFA] hover:bg-white/5"
            @click="isShow = true"
          >
            <i class="fa-regular fa-filter-list mr-2" />
            <span>{{ $t('reviews.filters') }}</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const TYPES = [
  {
    label: 'Primary',
    type: 'primary',
    icon: 'fa-plus',
  },
  {
    label: 'Secondary',
    type: 'secondary',
    icon: 'fa-table-layout',
  },
  {
    label: 'Tertiary',
    type: 'tertiary',
    icon: 'fa-filter-list',
  },
  {
    label: 'Quaternary',
    type: 'quaternary',
    icon: 'fa-pen-to-square',
  },
  {
    label: 'Error',
    type: 'error',
    icon: 'fa-exclamation-circle',
  },
  {
    label: 'Error Outline',
    type: 'error-outline',
    icon: 'fa-exclamation-circle',
  },
  {
    label: 'Cancel',
    type: 'red-cancel',
    icon: 'fa-arrow-turn-left',
  },
];
// small render height 24px;
// medium render height 30px;
const SIZES = ['small', 'large', 'medium'];

const loading = ref(false);
const withIcon = ref(true);
const disabled = ref(false);
const size = ref('medium');
</script>
