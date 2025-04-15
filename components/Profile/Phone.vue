<template>
  <div class="relative flex h-56 flex-col gap-1 overflow-y-auto">
    <div
      class="sticky top-0 z-10 mb-1.5 flex h-[4rem] items-center bg-[#000] px-1.5"
    >
      <BaseInput
        v-model="query"
        placeholder="Please enter a search term"
        class="pb-1"
        open
        :auto-focus="autoFocus"
      />
    </div>
    <div
      v-for="item in countries"
      :key="item.originAlpha2"
      class="flex cursor-pointer items-center gap-2 rounded-md p-1.5 transition-all hover:bg-white/5 active:scale-95"
      :class="value === item.phonePrefix ? 'bg-white/5' : ''"
      data-cy="763c060f7662e464"
      @click="onClick(item)"
    >
      <CountryFlag v-if="item.originAlpha2" :country="item.originAlpha2" />
      <div class="mt-2 flex w-0 flex-1 items-center text-sm">
        <span class="flex w-[3.2rem] text-xs text-[#707070]">
          (+{{ item.phonePrefix }})
        </span>
        <div v-html="highlightKeywords(item.name, [query])" />
      </div>
    </div>
    <div
      v-if="!countries.length"
      class="flex h-full w-full items-center justify-center text-xs text-[#b0b0b0]"
    >
      No data
    </div>
  </div>
</template>

<script setup>
import CountryFlag from 'vue-country-flag-next';

const props = defineProps({
  value: {
    type: [String, Number],
    default: 0,
  },
});

const emit = defineEmits(['select', 'update:length']);

const searchStore = useSearchStore();
const query = ref('');
const autoFocus = ref(true);

const onClick = (item) => {
  emit('select', { ...item });
};
const countries = computed(() =>
  searchStore.countries.filter((item) =>
    item.name.toLowerCase().includes(query.value.toLowerCase()),
  ),
);
watch(
  () => props.value,
  (value) => {
    const findCountry = countries.value.find(
      (item) => +item.phonePrefix === +value,
    );
    emit('update:length', findCountry?.phonelength || 13);
  },
  { immediate: true },
);
</script>
