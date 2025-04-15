<template>
  <div
    class="relative aspect-video w-full min-w-[16.8rem] shrink-0 rounded-md bg-[#060606] shadow-[0.25rem_0.25rem_0.25rem_0rem_rgba(0,0,0,0.25)] transition-all"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <div v-if="hover" class="h-full rounded-t-md">
      <MarketCardFloatPlayer :course="item" />
    </div>
    <div
      v-if="!hover"
      class="relative h-full rounded-t-md"
      :style="{
        backgroundImage: `url(${item.thumbnail?.url})`,
        backgroundSize: '100% 100%',
      }"
      data-cy="7dc054cd0f580b49"
      @click="gotoCourseDetail"
    >
      <i
        v-if="!item.thumbnail?.url"
        class="fa-solid fa-image absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-white/50"
      />
      <div
        class="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/60 px-1.5 py-1 shadow-[0rem_0.25rem_0.25rem_0rem_rgba(0,0,0,0.6)]"
      >
        <i v-if="item.type === 'on-demand'" class="fa-light fa-circle-play" />
        <i
          v-if="item.type === 'live'"
          class="inline-block h-4 w-4 rounded-[50%] bg-[#ED3C28]"
        />
        <span class="ml-1">{{ typeDesc(item.type) }}</span>
      </div>

      <div
        class="absolute bottom-2 right-0 flex items-center gap-1 rounded-l-md bg-black/60 px-2 py-2 shadow-[0.0625rem_0.25rem_0.25rem_0rem_rgba(0,0,0,0.4)]"
      >
        <i class="fa-light fa-cart-shopping" />
        <div class="ml-1 text-xs font-medium">
          {{ moneyFormat(item.billing.totalPrice) }} $
        </div>
      </div>
    </div>
    <div
      class="flex flex-col gap-3 p-3"
      data-cy="d9bbaea2c78216a7"
      @click="gotoCourseDetail"
    >
      <div class="flex gap-3">
        <div class="relative h-12 w-12">
          <el-progress
            type="circle"
            :percentage="item.completion"
            color="#9D50ED"
          >
            <img
              :src="item.owner.picture"
              class="ml-1 h-12 w-12 rounded-[50%] bg-white/80"
            />
            <div
              v-if="hover"
              class="absolute left-1 top-0 z-10 flex h-12 w-12 items-center justify-center rounded-[50%] bg-black/70 text-sm font-medium text-[#9D50ED]"
            >
              {{ item.completion }}%
            </div>
          </el-progress>
        </div>
        <div class="ml-2 flex w-0 flex-1 flex-col gap-1.5">
          <div class="text-xs text-[#D9D9D9]">{{ item.owner.name }}</div>
          <div
            class="line-clamp-2 text-sm font-medium leading-4 text-[#D9D9D9]"
          >
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});

const { t } = useI18n();

const typeDesc = (type) => {
  if (type === 'live') {
    return t('base.courses.type.onLive');
  }
  if (type === 'on-demand') {
    return t('base.courses.type.onDemand');
  }
  return type;
};
const hover = ref(false);

const gotoCourseDetail = () => {
  window.open(`/courses/${props.item.id}`, '_blank');
};
</script>
<style lang="scss" scoped>
:deep(.el-progress-circle) {
  width: 56px !important;
  height: 56px !important;
}
</style>
