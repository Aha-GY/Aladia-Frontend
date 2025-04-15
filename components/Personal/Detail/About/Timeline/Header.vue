<template>
  <div class="mb-3 flex h-10 items-center justify-between">
    <div class="text-base font-medium text-[#B0B0B0]">
      {{ $t('personal.experience.timeline') }}
    </div>
    <div class="flex h-full items-center gap-1.5">
      <div
        v-for="(item, index) in typeList"
        :key="index"
        class="group flex h-full cursor-pointer items-center gap-1 rounded-md border px-1.5 transition-all active:scale-95"
        :class="[
          actions.includes(item.type)
            ? 'border-white/25 bg-white/5'
            : 'border-transparent hover:bg-white/5',
          disabledClick(item.type)
            ? 'hover:cursor-not-allowed active:!scale-100'
            : '',
        ]"
        data-cy="075ca505d53989a7"
        @click="onChange(item.type)"
      >
        <div class="flex h-6 w-6 items-center justify-center rounded-full">
          <i
            class="fa-solid text-xs"
            :class="[
              item.iconClass,
              actions.includes(item.type) ? item.iconColor : 'text-[#B0B0B0]',
            ]"
          />
        </div>
        <div
          class="hidden text-xs group-hover:text-white md:flex"
          :class="[
            actions.includes(item.type)
              ? 'text-[#D9D9D9B2]'
              : 'text-[#D9D9D999]',
          ]"
        >
          <span>{{ $t(item.label) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { useI18n } from 'vue-i18n';
// import { useToast } from 'vue-toastification';

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['change']);
// const { t } = useI18n();
// const $toast = useToast();
const typeList = ref([
  {
    label: 'personal.work',
    iconClass: 'fa-briefcase',
    iconColor: 'text-[#9747FF]',
    type: 'work',
  },
  {
    label: 'personal.education',
    iconClass: 'fa-graduation-cap',
    iconColor: 'text-[#FD7542]',
    type: 'study',
  },
  {
    label: 'personal.certificate.label',
    iconClass: 'fa-file-certificate',
    iconColor: 'text-[#EAB308]',
    type: 'certificate',
  },
]);
const hasDataType = ref([]);
const actions = ref([]);

const disabledClick = (type) =>
  !hasDataType.value.includes(type) ||
  (actions.value.length === 1 && actions.value.includes(type));

const onChange = (type) => {
  if (disabledClick(type)) {
    return;
  }
  if (actions.value.includes(type)) {
    actions.value = actions.value.filter((item) => item !== type);
  } else {
    actions.value = [...actions.value, type];
  }
  emit('change', actions.value);
};

watch(
  () => props.data,
  (value) => {
    const type = value.map((item) => item.type) || [];
    hasDataType.value = [...new Set(type)];
    actions.value = hasDataType.value;
    emit('change', actions.value);
  },
  { immediate: true },
);
</script>
