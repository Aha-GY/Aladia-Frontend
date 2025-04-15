<template>
  <div
    class="group flex w-full flex-shrink-0 items-center justify-between overflow-hidden transition-all"
  >
    <div
      class="flex w-0 flex-1 items-center gap-2"
      data-cy="359f5e730cb752e2"
      @click.stop="handleClickCopy"
      @mouseenter.stop="handleOnHover(true)"
      @mouseleave.stop="handleOnHover(false)"
    >
      <div class="truncate">{{ item.id || '---' }}</div>
      <div>
        <i
          class="fa-solid fa-copy cursor-pointer text-sm text-white transition-all hover:scale-125 hover:opacity-80"
          :class="hover ? 'opacity-100' : 'opacity-0'"
        />
      </div>
    </div>

    <a
      v-if="downloadUrl"
      :href="downloadUrl"
      target="_blank"
      data-cy="7a4fb54734836d55"
      @click.stop
    >
      <i
        class="fa-thin fa-file-arrow-down px-8 transition-all hover:scale-125 hover:opacity-80"
      />
    </a>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps({
  item: Object,
  downloadUrl: {
    type: String,
  },
});

const { t } = useI18n();

const $toast = useToast();
const hover = ref(false);

async function handleClickCopy() {
  await navigator.clipboard.writeText(props.item.id);
  $toast.success(t('category.payout.copied'));
}

function handleOnHover(val) {
  hover.value = val;
}
</script>
