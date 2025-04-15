<template>
  <div class="group/input el-select-box relative flex h-10 w-full items-end">
    <div
      class="mb-1.5 flex h-6 w-full items-center gap-1"
      data-cy="open-multiple-skills-select-button"
    >
      <el-select
        ref="selectRef"
        v-model="currentValue"
        class="h-full w-0 flex-1 bg-transparent text-white outline-none placeholder:text-[#505050]"
        :placeholder="focus || !title ? placeholder : ''"
        popper-class="multiple-skills-select"
        multiple
        allow-create
        :suffix-icon="null"
        :loading="initLoading"
        @focus="focus = true"
        @blur="focus = false"
        @change="onChange"
        @visible-change="handleDropdownVisibleChange"
      >
        <el-option
          v-for="item in skillListHighlight"
          :key="item.value"
          :value="item.value"
          :data-cy="`${item.value ? item.value.toLowerCase().split(' ').join('-') : ''}-multiple-skills-option`"
        >
          <span v-html="item.highlight || item.label" />
        </el-option>
        <div v-if="loading" class="w-full px-4">
          <BaseSkeleton :length="3" height="1.5rem" class="w-full" />
        </div>
        <template #loading>
          <div class="w-full px-4">
            <BaseSkeleton :length="5" height="1.5rem" class="w-full" />
          </div>
        </template>
        <template #header>
          <BaseInput
            ref="searcInputhRef"
            v-model="searchVal"
            :placeholder="$t('base.search.item.hint')"
            class="h-8 text-sm"
            data-cy="search-multiple-skills"
            @enter="onEnter"
          />
        </template>
        <template #tag>
          <div class="pl-2">
            <el-tag
              v-for="(item, index) in currentValue.slice(0, maxCollapseTags)"
              :key="item"
              closable
              color="#202121"
              effect="dark"
              class="mr-1.5"
              @close.stop="removeTag(index)"
            >
              {{ truncateString(item, maxtextLength) }}
            </el-tag>
          </div>
          <template v-if="currentValue.length - maxCollapseTags > 0">
            <el-popover
              placement="bottom"
              :popper-style="{
                width: $device.isMobile ? '14rem' : '20rem',
                padding: '8px',
              }"
              trigger="click"
            >
              <template #reference>
                <el-tag
                  color="#202121"
                  class="-ml-1.5"
                  effect="dark"
                  data-cy="8b1785cf14341976"
                  @click.stop
                >
                  +{{ currentValue.length - maxCollapseTags }}
                </el-tag>
              </template>
              <div>
                <el-tag
                  v-for="(item, index) in currentValue.slice(
                    maxCollapseTags,
                    currentValue.length,
                  )"
                  :key="item"
                  closable
                  color="#202121"
                  effect="dark"
                  @close.stop="removeTag(index + maxCollapseTags)"
                >
                  {{ truncateString(item, $device.isMobile ? 26 : 38) }}
                </el-tag>
              </div>
            </el-popover>
          </template>
        </template>
      </el-select>
    </div>
    <div
      class="pointer-events-none absolute bottom-0 left-0 flex items-center text-sm transition-all duration-300"
      :class="{
        'text-[#b0b0b0] group-hover/input:text-[#c0c0c0]': !focus,
        'text-[#A88300]': focus,
        'bottom-7 !text-13': focus || currentValue.length,
      }"
    >
      <span
        :class="{
          '!text-[#ED3C28]': showValidateError,
        }"
      >
        {{ title }}
      </span>
      <span v-if="required" class="ml-1 text-red-600">*</span>
    </div>
    <div
      class="absolute -bottom-1 left-0 right-0 flex h-[1px] justify-center bg-white/10 transition-all duration-300 group-hover/input:bg-white/30"
    >
      <div
        class="h-full bg-[#a2842a] transition-all duration-300"
        :class="{
          'w-full': focus || showValidateError,
          'w-0': !focus && !showValidateError,
          '!bg-[#ED3C28]': showValidateError,
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { searchSkills } from '~/api/v2/global';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  autoFocusSearchInput: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  showValidateError: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['focus', 'update:modelValue']);
const { isMobile } = useDevice();
const focus = ref(false);
const currentValue = ref([]);

watch(
  () => props.modelValue,
  (newVal) => {
    currentValue.value = newVal;
  },
  { immediate: true },
);

watch(
  () => focus.value,
  (newVal) => {
    emit('focus', newVal);
  },
);

const onChange = () => {
  emit('update:modelValue', currentValue.value);
};
const maxCollapseTags = ref(isMobile ? 2 : 3);
const maxtextLength = computed(() =>
  currentValue.value.length >= 2 ? 10 : 35,
);
const selectRef = ref(null);
const loading = ref(false);
const initLoading = ref(false);
const skillList = ref([]);
const skillsNext = ref(undefined);
const searchVal = ref(undefined);
const searcInputhRef = ref(null);
let dropdownScrollContainer = null; // 保存下拉菜单的 DOM 元素

const uniqByLabelCaseInsensitive = (array) =>
  uniqBy(array, (item) => item.label.toLowerCase());

const skillListHighlight = computed(() => {
  const result = skillList.value.map((item) => ({
    ...item,
    highlight: highlightKeywords(item.label, [searchVal.value || '']),
  }));
  return uniqByLabelCaseInsensitive(result);
});

const handleDropdownVisibleChange = (visible) => {
  if (visible) {
    initLoading.value = true;
    skillsNext.value = '';
    searchVal.value = undefined;
    skillList.value = [];
    getSkillList();

    if (props.autoFocusSearchInput) {
      setTimeout(() => {
        searcInputhRef.value.setSelectionRange();
      }, 200);
    }

    nextTick(() => {
      dropdownScrollContainer = document.querySelector(
        '.el-select-dropdown__wrap.el-scrollbar__wrap',
      );
      if (dropdownScrollContainer) {
        dropdownScrollContainer.addEventListener(
          'scroll',
          handleSkillOptionsScroll,
        );
      }
    });
  } else {
    // 移除滚动事件监听器
    if (dropdownScrollContainer) {
      dropdownScrollContainer.removeEventListener(
        'scroll',
        handleSkillOptionsScroll,
      );
    }
  }
};

const handleSkillOptionsScroll = () => {
  if (
    dropdownScrollContainer.scrollTop + dropdownScrollContainer.clientHeight >=
      dropdownScrollContainer.scrollHeight &&
    skillsNext.value
  ) {
    getSkillList();
  }
};

const getSkillList = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const { data, cursor } = await searchSkills({
      name: searchVal.value || undefined,
      next: skillsNext.value || undefined,
    });
    const resData = data.map((item) => ({
      label: item.name,
      value: item.name,
      id: item.id,
    }));
    skillsNext.value = cursor.next;
    skillList.value = [...skillList.value, ...resData];
  } finally {
    loading.value = false;
    initLoading.value = false;
  }
};

const removeTag = (index) => {
  currentValue.value.splice(index, 1);
};

const onEnter = () => {
  if (searchVal.value) {
    currentValue.value.push(searchVal.value);
    searchVal.value = '';
  }
};

const debouncedLoadData = debounce(() => {
  initLoading.value = true;
  skillsNext.value = '';
  skillList.value = searchVal.value
    ? [
        {
          name: searchVal.value,
          label: searchVal.value,
          value: searchVal.value,
          id: 0,
        },
      ]
    : [];
  getSkillList();
}, 500);

watch(
  () => searchVal.value,
  () => {
    debouncedLoadData();
  },
);
</script>

<style lang="scss" scoped>
:deep(.el-select__wrapper) {
  padding-left: 0;
  box-shadow: none;
  &.is-focused,
  &:hover,
  &:active,
  &.is-hovering:not(.is-focused),
  &:focus {
    box-shadow: none !important;
  }
}
</style>
<style lang="scss">
.el-select-dropdown {
  .el-select-dropdown__header {
    // height: 24px;
    border: none !important;
    .relative.flex.w-full.items-end {
      height: 32px;
    }
  }
}
.el-select-box {
  .el-select {
    .el-select__wrapper {
      background-color: transparent;
    }
  }
}
</style>
