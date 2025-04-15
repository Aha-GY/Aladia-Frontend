<template>
  <div v-if="props.data.length">
    <div v-if="props.title" class="py-1 text-[#707070] md:px-7">
      {{ $t(props.title) }}
    </div>
    <div
      v-for="(item, index) in props.data"
      :key="index"
      class="relative flex cursor-pointer items-center justify-between border-b-[1px] border-b-white/10 py-3 text-[#F1F1F1] last:rounded-b-md hover:bg-[#131313] md:px-7 [&:nth-child(2)]:rounded-t-md"
      :class="{
        '!cursor-default bg-[#131313]': value === getId(index),
      }"
      :data-cy="`${getId(index)}-list`"
      @click="onChange(index)"
    >
      <div class="flex w-full items-center">
        <template v-if="item.component">
          <component :is="item.component" />
        </template>
        <template v-else>
          <i v-if="item.iconClass" :class="`${item.iconClass} mr-2 text-xs`" />
          {{ $t(item.label) }}
        </template>
      </div>
      <i
        v-if="item.alertIcon"
        class="absolute right-16 h-2 w-2 rounded-full bg-[#E0B92C]"
      />
      <i
        v-if="!item.hideRightIcon"
        class="fa-solid fa-chevron-right text-xs !font-normal"
      />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  data: Array,
});
const emits = defineEmits(['change']);
const value = defineModel({ type: String });

const getId = (index) => props.data[index].id ?? props.data[index].label;
const onChange = (index) => {
  const id = getId(index);
  const data = { ...props.data[index], id };
  if (id === value.value) {
    return;
  }
  if (!data.hideRightIcon) {
    value.value = id;
  }
  emits('change', data);
};
</script>
