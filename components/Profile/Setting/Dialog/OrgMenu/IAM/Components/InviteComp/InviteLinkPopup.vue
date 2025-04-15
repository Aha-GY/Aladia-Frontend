<template>
  <client-only>
    <el-dialog
      :model-value="modelValue"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      destroy-on-close
      width="30rem"
    >
      <div v-loading="loading">
        <div
          class="mb-4 flex h-12 items-center justify-between rounded-t-sm bg-white/5 px-4"
        >
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-link" />
            {{ $t('base.member.invite.link') }}
          </div>
          <BaseIconClose data-cy="0299834f805649a1" @click="close()" />
        </div>
        <div class="mb-4 flex items-center justify-between px-4">
          <div>
            {{ $t('org.select.role') }}
          </div>
          <el-select
            v-model="activeRole"
            style="width: 8rem"
            placeholder="Role"
          >
            <template #label="{ label }">
              <i
                :class="roleList.find((item) => item.label === label)?.icon"
                class="mr-2"
              />
              <span>{{ $t(label) }}</span>
            </template>
            <el-option
              v-for="item in roleList"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            >
              <i :class="item.icon" class="mr-2" />
              <span>{{ $t(item.label) }}</span>
            </el-option>
          </el-select>
        </div>
        <div class="px-4 pb-4">
          <div class="mb-4 w-full border-b border-white/10 pb-2 text-[#eacb5b]">
            {{ link }}
          </div>
          <div
            class="flex cursor-pointer items-center justify-center rounded bg-white/5 py-1 hover:bg-white/10"
            data-cy="836b6e33d149dac2"
            @click="copyLink"
          >
            {{ $t('index.copy.title') }}
          </div>
        </div>
      </div>
    </el-dialog>
  </client-only>
</template>
<script setup>
import { useToast } from 'vue-toastification';

import { invitationLink } from '~/api/v2/org';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  organizationId: {
    type: String,
    default: '',
  },
  roleList: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits('update:modelValue');
const $toast = useToast();
const close = () => {
  emit('update:modelValue', false);
};
const loading = ref(false);
const activeRole = ref('');
const link = ref('');
const { copy } = useClipboard();
const copyLink = () => {
  if (!link.value) {
    return;
  }
  copy(link.value);
  $toast.success('Link copied');
  // close();
};
watch(
  () => activeRole.value,
  async () => {
    if (!activeRole.value || loading.value) {
      return;
    }
    loading.value = true;
    try {
      const data = await invitationLink({
        organizationId: props.organizationId,
        role: activeRole.value,
      });
      link.value = data.link;
    } catch (error) {
      $toast.error(error.message);
    } finally {
      loading.value = false;
    }
  },
);
</script>
