<template>
  <div
    data-cy="359f5e730cb752e2"
    class="item-center flex justify-self-end rounded-md border border-gray-800 bg-[#0C0C0C]"
  >
    <span class="ml-1 text-xs text-[#d9d9d9]">
      {{ $t('category.payout.id', { id: id }) }}
    </span>
    <i
      class="fa-sharp fa-solid fa-copy mx-1 cursor-pointer text-xs transition-all hover:scale-110 hover:opacity-80"
      @click.stop="handleClickCopy"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const { t } = useI18n();
const $toast = useToast();

async function handleClickCopy() {
  await navigator.clipboard.writeText(props.id);
  $toast.success(t('category.payout.copied'));
}
</script>
