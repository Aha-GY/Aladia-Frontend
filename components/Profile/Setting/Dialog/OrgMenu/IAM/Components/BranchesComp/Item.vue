<template>
  <div
    class="group flex w-full items-center justify-between overflow-hidden rounded-5 rounded-b-none border-b-[1px] border-b-white/10 px-3 py-1.5 transition-all duration-200 hover:border-b-white/40 hover:bg-[#1c1c1c]"
  >
    <div class="group flex flex-1 items-center overflow-hidden">
      <div class="pr-4">
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
            :round="item.isHeadquarter"
            size="md"
          />
          <div v-else class="flex h-14 w-14 items-center justify-center">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-5 bg-[#2c2c2c]"
              :class="{
                'rounded-full': item.isHeadquarter,
              }"
            >
              <i class="fa-regular fa-buildings text-xl" />
            </div>
          </div>
        </div>
        <div
          class="ml-1.5 flex h-12 w-0 flex-1 flex-col justify-between truncate"
        >
          <div
            class="text-[#f1f1f1]"
            v-html="
              highlightKeywords(
                item.name || profileStore.myProfileDetail.fullName,
                [searchValue],
              )
            "
          />
          <ProfileSettingDialogOrgMenuIAMComponentsUserNameAddressItem
            :data="addressData(item)"
          />
        </div>
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center justify-end text-xs font-medium text-[#FAFAFA]"
      @click="emit('rowClick')"
    >
      <span class="pr-2 capitalize hover:opacity-70">More</span>
      <div
        class="flex cursor-pointer items-center justify-center rounded-5 px-2 py-2 group-hover:bg-white/5"
        data-cy="3e47b872904dc73e"
      >
        <i class="fa-regular fa-arrow-right" />
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
  from: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['rowClick']);
const profileStore = useProfileStore();
const isSelect = ref(false);
const onSelect = () => {
  isSelect.value = !isSelect.value;
};
const addressData = (item) => {
  const data = {
    ...item.address,
    ...item.location,
  };
  return data;
};
</script>
