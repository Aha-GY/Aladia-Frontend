<template>
  <div class="group flex items-center gap-2 overflow-hidden pr-2">
    <div class="pl-2 pr-4">
      <BaseCheckboxStyle
        :state="isSelect ? 'checked' : 'unchecked'"
        data-cy="d6e2855692e3483d"
        @click="onSelect"
      />
    </div>
    <div class="flex flex-1 items-center" @click="emit('rowClick')">
      <div class="relative flex shrink-0 items-center justify-center">
        <BaseAvatarNext
          v-if="item.picture"
          :picture="item.picture"
          :show-online="false"
          :round="false"
          size="md"
        />
        <div v-else class="flex h-14 w-14 items-center justify-center">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-5 bg-[#2c2c2c]"
          >
            <i
              class="fa-light text-xl"
              :class="[item.icon ? item.icon : 'fa-envelope']"
              :style="{ color: item.color }"
            />
          </div>
        </div>
      </div>
      <div
        class="ml-1.5 flex h-12 w-0 flex-1 flex-col justify-between truncate"
      >
        <div
          class="text-[#f1f1f1]"
          v-html="highlightKeywords(item.name, [searchValue])"
        />
        <div class="flex items-center text-xs text-[#707070]">
          <i class="fa-regular fa-user" />
          <span class="ml-1.5">{{ item.numberOf?.members || 0 }} Members</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  searchValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['rowClick']);
const isSelect = ref(false);
const onSelect = () => {
  isSelect.value = !isSelect.value;
};
</script>
