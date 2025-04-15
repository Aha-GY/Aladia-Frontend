<template>
  <div
    class="relative mb-4 flex items-center justify-between py-2 text-sm text-[#707070]"
  >
    <div
      class="flex flex-1 cursor-pointer items-center justify-center"
      :class="tab === 1 ? 'text-[#E4B53D]' : ''"
      data-cy="7b929a45fec4dac5"
      @click="tab = 1"
    >
      <i class="fa-sharp fa-solid fa-timer text-xs" />
      <div
        class="overflow-hidden whitespace-nowrap transition-all duration-300"
        :class="tab === 1 ? 'ml-2 max-w-36' : 'ml-0 max-w-0 opacity-0'"
      >
        {{ $t('org.status.inProgress') }}
      </div>
    </div>
    <div
      class="flex flex-1 cursor-pointer items-center justify-center"
      :class="tab === 2 ? 'text-[#62ab3b]' : ''"
      data-cy="99a19a682e036f9a"
      @click="tab = 2"
    >
      <i class="fa-solid fa-check text-xs" />
      <div
        class="overflow-hidden whitespace-nowrap transition-all duration-300"
        :class="tab === 2 ? 'ml-2 max-w-36' : 'ml-0 max-w-0 opacity-0'"
      >
        {{ $t('org.status.completed') }}
      </div>
    </div>
    <div
      class="flex flex-1 cursor-pointer items-center justify-center"
      :class="tab === 3 ? 'text-[#d9d9d9]' : ''"
      data-cy="1a7a06eacaad077b"
      @click="tab = 3"
    >
      <i class="fa-light fa-spinner text-xs" />
      <div
        class="overflow-hidden whitespace-nowrap transition-all duration-300"
        :class="tab === 3 ? 'ml-2 max-w-36' : 'ml-0 max-w-0 opacity-0'"
      >
        {{ $t('org.status.toDo') }}
      </div>
    </div>
    <div class="absolute bottom-0 h-[1px] w-full bg-white/20">
      <div
        class="absolute top-0 inline-block h-[1px] w-1/3 transition-all"
        :class="{
          'left-0 bg-[#E4B53D]': tab === 1,
          'left-1/3 bg-[#62ab3b]': tab === 2,
          'left-2/3 bg-[#d9d9d9]': tab === 3,
        }"
      />
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const analyticsStore = useHubAnalyticsStore();
    return { analyticsStore };
  },
  data() {
    return {
      tab: 1,
    };
  },
};
</script>
