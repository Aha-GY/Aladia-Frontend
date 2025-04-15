<template>
  <div
    class="my-2 flex cursor-pointer items-center justify-between rounded-5 bg-[rgba(226,226,226,0.03)] p-1.5 text-xs font-medium text-[#707070] hover:bg-[rgba(226,226,226,0.05)]"
    @click="handlerClick()"
  >
    <BaseAvatarNext
      :picture="data?.picture"
      :story="data?.story"
      :size="'md'"
      :online="data.online"
      :round="opType === 'members'"
      :show-online="opType === 'members'"
      :default-icon="
        opType === 'members' ? 'fa-solid fa-user' : 'fa-light fa-buildings'
      "
    />
    <div class="ml-2 flex h-12 flex-1 flex-col justify-around text-xs">
      <div
        class="font-normal text-[#F1F1F1]"
        v-html="highlightKeywords(data.name, [searchName])"
      />
      <div>
        <i class="fa-regular fa-location-dot mr-2 text-xs" />
        <span
          v-if="
            !data?.address?.city &&
            !data?.address?.state &&
            !data?.address?.country
          "
        >
          unknown
        </span>
        <span>{{ data?.address?.city || data?.address?.state }}</span>
        <span
          v-if="
            (data?.address?.city || data?.address?.state) &&
            data?.address?.country
          "
          class="px-1"
        >
          |
        </span>
        <span v-if="data?.address?.country">{{ data?.address?.country }}</span>
      </div>
    </div>
    <div class="mr-2">
      {{ data?.timezone?.match(/UTC[+-]\d{2}:\d{2}/)?.[0] || data?.timezone }}
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  opType: {
    type: String,
    default: '',
  },
  searchName: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['onClick']);
const handlerClick = () => {
  emit('onClick', props.data);
};
</script>
