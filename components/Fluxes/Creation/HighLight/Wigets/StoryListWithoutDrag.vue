<template>
  <div
    v-for="(element, index) in cardList"
    :key="index"
    class="group my-1 flex cursor-pointer items-center justify-between gap-2 rounded-5 p-[0.375rem] py-2 hover:bg-white/5"
    :class="{
      'bg-[#e2e2e208]': index === activeIndexComputed,
    }"
    @click="handleEdit(element, index)"
  >
    <div class="flex flex-1 items-center truncate">
      <div class="mx-2 w-[30px] shrink-0">
        <FluxesCreationHighLightWigetsNewCard :item="element" />
      </div>
      <div class="flex flex-col px-[0.25rem]">
        <p class="flex-1 truncate text-base font-normal leading-6 text-white">
          {{ $t('flux.highlight.story.singular') }} {{ index + 1 }}
        </p>
        <p class="text-xs font-normal leading-6 text-[#717170]/50">
          {{ timeAgo(element.createdAt) }}
        </p>
      </div>
    </div>
    <BaseButton
      type="tertiary"
      data-cy="c678504c1aa4e73b"
      icon="fa-regular fa-pen-to-square !w-auto"
      class="size-7 items-center justify-center rounded-5 text-xs"
      @click="handleEdit(element, index)"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  cardList: {
    type: Array,
    default: () => [],
  },
  activeIndex: Number,
});

const emit = defineEmits(['swap-end', 'edit']);

const { t } = useI18n();

const activeIndexComputed = ref(props.activeIndex);

watch(
  () => props.activeIndex,
  (newVal) => {
    activeIndexComputed.value = newVal;
  },
);

function handleEdit(item, index) {
  emit('edit', { item, index });
  activeIndexComputed.value = index;
}

function timeAgo(createdAt) {
  const now = new Date();
  const createdDate = new Date(createdAt);
  const differenceInMs = now - createdDate;

  const seconds = Math.floor(differenceInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) {
    return t('nav.header.time.now', { prefix: '' });
  } else if (minutes < 60) {
    return minutes > 1
      ? t('nav.header.time.minutes', { prefix: '', diffInMinutes: minutes })
      : t('nav.header.time.minute', { diffInMinutes: minutes });
  } else if (hours < 24) {
    return hours > 1
      ? t('nav.header.time.hours', { prefix: '', diffInHours: hours })
      : t('nav.header.time.hour', { diffInHours: hours });
  } else {
    const days = Math.floor(hours / 24);
    return days > 1
      ? t('nav.header.time.day', { days })
      : t('nav.header.time.days', { days });
  }
}
</script>
