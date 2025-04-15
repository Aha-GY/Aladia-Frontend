<template>
  <div
    class="group/input el-select-box relative flex w-full items-end"
    :class="{
      'h-10': !fixed,
    }"
  >
    <div
      class="flex h-6 w-full items-center gap-1"
      :data-cy="`${dataCy}-select-toggle`"
    >
      <i
        v-if="prefixIconClass"
        class="ml-1 mr-2 cursor-pointer text-xs"
        :class="[focus ? 'text-[#a2842a]' : 'text-[#707070]', prefixIconClass]"
      />
      <img
        v-if="prefixImgSrc"
        :src="prefixImgSrc"
        alt="icon flag"
        class="mb-1 h-4 w-6"
      />
      <el-select-v2
        ref="selectRef"
        v-model="currentValue"
        :options="filterList"
        :props="fields"
        placement="bottom-start"
        :fit-input-width="false"
        class="hidden_suffix mb-[0.625rem] h-full w-full flex-1 bg-transparent text-white outline-none"
        :placeholder="focus || !title ? placeholder : ''"
        :loading="loading"
        clearable
        :disabled="disabled"
        @focus="focus = true"
        @blur="focus = false"
        @change="onChange"
        @visible-change="handleDropdownVisibleChange"
      >
        <template v-if="search" #header>
          <BaseInput
            ref="searcInputhRef"
            v-model="searchVal"
            placeholder="Please enter a search term"
            class="h-8"
            :data-cy="`search-${dataCy}`"
          />
        </template>
        <template #default="{ item }">
          <slot
            v-if="$slots.custom"
            name="custom"
            :data-cy="`${dataCy}-${item[fields.value]}-option`"
            :row="{ ...item, searchVal: searchVal }"
          />
          <template v-else>
            <div class="flex items-center justify-between">
              <div
                :data-cy="`${dataCy}-${item[fields.value]}-option`"
                v-html="highlightKeywords(item[fields.label], [searchVal])"
              />
              <slot name="suffix" :row="{ ...item, searchVal: searchVal }" />
            </div>
          </template>
        </template>
      </el-select-v2>
    </div>
    <div
      class="pointer-events-none absolute bottom-1 left-0 flex items-center gap-1.5 text-sm transition-all duration-300"
      :class="{
        'text-[#b0b0b0] group-hover/input:text-[#c0c0c0]': !focus,
        'text-[#A88300]': focus && !fixed,
        'text-[#b0b0b0]': focus && fixed,
        'opacity-0': currentValue?.length && fixed,
        'bottom-6 !text-13': (focus || currentValue?.length) && !fixed,
        // 'mt-4': (focus || currentValue?.length) && fixed,
        'scale-90': (focus || currentValue?.length) && fixed,
        'left-6': fixed && prefixIconClass,
      }"
    >
      <i
        v-if="titleIcon"
        class="cursor-pointer text-xs"
        :class="[focus ? 'text-[#A88300]' : 'text-[#707070]', titleIcon]"
      />
      {{ title }}
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center bg-white/10 transition-all duration-300 group-hover/input:bg-white/30"
      :class="{
        // '!-bottom-2': currentValue?.length,
      }"
    >
      <div
        class="h-full bg-[#a2842a] transition-all duration-300"
        :class="focus ? 'w-full' : 'w-0'"
      />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: () => '',
  },
  prefixIconClass: {
    type: String,
    default: '',
  },
  prefixImgSrc: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  titleIcon: {
    type: String,
    default: '',
  },
  list: {
    type: Array,
    default: () => [],
  },
  fields: {
    type: Object,
    default: () => ({
      label: 'label',
      value: 'value',
      searchKey2: '',
    }),
  },
  title: {
    type: String,
    default: '',
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  search: {
    type: Boolean,
    default: true,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  remoteMethod: {
    type: Function,
    default: () => {},
  },
  autoFocusSearchInput: {
    type: Boolean,
    default: false,
  },
  dataCy: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['focus', 'update:modelValue', 'change']);
const focus = ref(false);
const searcInputhRef = ref(null);
const currentValue = ref(props.modelValue || []);
const searchVal = ref(undefined);
const selectRef = ref(null);
const loading = ref(false);
const next = ref(undefined);
let dropdownScrollContainer = null; // 保存下拉菜单的 DOM 元素

watch(
  () => props.modelValue,
  async (newVal) => {
    currentValue.value = newVal;
  },
);

watch(
  () => focus.value,
  (newVal) => {
    emit('focus', newVal);
  },
);
const filterList = computed(() => {
  if (props.remote) {
    return props.list;
  } else if (searchVal.value) {
    const value = searchVal.value.toUpperCase();
    const newData = props.list.filter(
      (item) =>
        item[props.fields?.label].toUpperCase()?.includes(value) ||
        item[props.fields?.searchKey2]?.toUpperCase()?.includes(value),
    );
    return newData;
  } else {
    return props.list;
  }
});

const handleDropdownVisibleChange = async (visible) => {
  if (visible) {
    searchVal.value = undefined;
    next.value = '';
    if (props.autoFocusSearchInput) {
      setTimeout(() => {
        searcInputhRef.value.setSelectionRange();
      }, 200);
    }

    if (props.remote) {
      loading.value = true;
      const res = await props.remoteMethod();
      next.value = res?.cursor?.next || null;
      loading.value = false;
    }
    nextTick(() => {
      // 获取 el-scrollbar 的滚动容器
      dropdownScrollContainer = document.querySelector(
        '.el-select-dropdown__list',
      );
      if (dropdownScrollContainer) {
        dropdownScrollContainer.addEventListener('scroll', handleOptionsScroll);
      }
    });
  } else {
    // 移除滚动事件监听器
    if (dropdownScrollContainer) {
      dropdownScrollContainer.removeEventListener(
        'scroll',
        handleOptionsScroll,
      );
    }
  }
};

const handleOptionsScroll = () => {
  const { scrollTop, clientHeight, scrollHeight } = dropdownScrollContainer;
  if (scrollTop + clientHeight >= scrollHeight && next.value) {
    props.remoteMethod({
      next: next.value,
      name: searchVal.value,
    });
  }
};

const onChange = () => {
  emit('update:modelValue', currentValue.value);
  const result = props.list.find(
    (i) => i[props.fields.label] === currentValue.value,
  );
  emit('change', result);
};

const timer = ref(null);
watch(
  () => searchVal.value,
  async (newVal) => {
    if (props.remote) {
      clearTimeout(timer.value);
      timer.value = setTimeout(async () => {
        loading.value = true;
        next.value = '';
        const res = await props.remoteMethod({ name: newVal || undefined });
        next.value = res?.cursor?.next;
        loading.value = false;
      }, 500);
    }
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
