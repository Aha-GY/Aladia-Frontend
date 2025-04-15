<template>
  <ProfileBox>
    <div class="flex items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('base.courses.filters') }}
      </div>
      <div
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-white/5 transition-all active:scale-95"
      >
        <i class="fa-light fa-refresh" />
      </div>
    </div>

    <div class="mb-4 mt-5 text-xs font-medium text-[#707070]">
      {{ $t('base.courses.sortBy.label') }}
    </div>

    <div class="flex flex-col gap-1.5">
      <div
        v-for="item in types"
        :key="item.id"
        class="flex h-6 items-center gap-6 rounded-md px-1.5 hover:bg-white/5"
      >
        <BaseCheckboxStyle
          :state="type === item.id ? 'checked' : 'unchecked'"
          data-cy="9663b01a19d2862e"
          @click="type = item.id"
        />
        <div class="text-xs">{{ $t(item.name) }}</div>
      </div>
    </div>

    <div class="mb-4 mt-5 text-xs font-medium text-[#707070]">
      {{ $t('base.courses.sortBy.price') }}
    </div>

    <div class="flex items-center gap-5">
      <BaseInput
        v-model="priceValue[0]"
        fixed
        number
        placeholder="From"
        class="pl-1"
      />
      <BaseInput
        v-model="priceValue[1]"
        fixed
        number
        :min="priceValue[0]"
        placeholder="To"
        class="pl-1"
      />
    </div>
    <el-slider
      v-model="priceValue"
      :max="2500"
      class="price-slider my-4 px-2"
      range
      :show-tooltip="false"
    />
    <div
      class="flex items-center justify-between text-11 font-medium text-[#707070]"
    >
      <span>0€</span>
      <span>2500€</span>
    </div>

    <div class="mb-4 mt-5 text-xs font-medium text-[#707070]">
      {{ $t('base.courses.sortBy.rating') }}
    </div>
    <div class="flex items-center justify-between">
      <div
        v-for="i in 5"
        :key="i"
        class="flex h-[3.875rem] w-[3.25rem] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border"
        :class="
          starActions.includes(i)
            ? 'border-[#E4B53D] bg-[#EAB308]/30'
            : 'border-[#707070]'
        "
        data-cy="b158290080c9d14f"
        @click="onStarChange(i)"
      >
        <i
          class="fa-star text-white"
          :class="starActions.includes(i) ? 'fa-solid' : 'fa-light'"
        />
        <div class="text-sm font-medium leading-4 text-white">
          {{ i }}
        </div>
      </div>
    </div>

    <div class="mb-4 mt-5 text-xs font-medium text-[#707070]">
      {{ $t('base.courses.sortBy.topic') }}
    </div>
    <div class="flex flex-wrap gap-2.5">
      <div
        v-for="item in topics"
        :key="item.id"
        class="flex h-9 cursor-pointer items-center rounded-md border px-2.5"
        :class="
          topicActions.includes(item.id)
            ? 'border-[#E4B53D] bg-[#EAB308]/30'
            : 'border-white/5 bg-white/5 text-[#707070]'
        "
        data-cy="6f4f72d880350636"
        @click="onTopicChange(item.id)"
      >
        <div class="text-xs font-medium">{{ item.name }}</div>
      </div>
    </div>
  </ProfileBox>
</template>

<script>
export default {
  data() {
    return {
      types: [
        {
          id: 1,
          name: 'base.courses.filter.new',
        },
        {
          id: 2,
          name: 'base.courses.filter.price.low',
        },
        {
          id: 3,
          name: 'base.courses.filter.price.high',
        },
        {
          id: 4,
          name: 'base.courses.filter.sales',
        },
      ],
      type: null,
      priceValue: [0, 2500],
      starActions: [],
      topics: [
        {
          id: 1,
          name: 'Engenieering Civilization',
        },
        {
          id: 2,
          name: 'English',
        },
        {
          id: 3,
          name: 'Maths',
        },
        {
          id: 4,
          name: 'Building Manager',
        },
        {
          id: 5,
          name: 'Philosophy',
        },
        {
          id: 6,
          name: 'Business Managing',
        },
        {
          id: 7,
          name: 'Business Managing',
        },
      ],
      topicActions: [],
    };
  },
  methods: {
    onStarChange(i) {
      if (this.starActions.includes(i)) {
        this.starActions = this.starActions.filter((item) => item !== i);
      } else {
        this.starActions.push(i);
      }
    },
    onTopicChange(id) {
      if (this.topicActions.includes(id)) {
        this.topicActions = this.topicActions.filter((item) => item !== id);
      } else {
        this.topicActions.push(id);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
:deep(.price-slider) {
  position: relative;
  --el-slider-runway-bg-color: #707070 !important;
  --el-slider-height: 4px !important;
  --el-slider-button-size: 10px !important;
  --el-slider-button-wrapper-size: 10px !important;
  --el-slider-button-wrapper-offset: -9px !important;
  .el-slider__bar {
    background-color: #fdcc1e !important;
  }
  .el-slider__button {
    background-color: #fdcc1e !important;
    border-color: #fdcc1e !important;
  }
  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 3px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #707070;
  }
  &::after {
    content: '';
    position: absolute;
    top: 5px;
    right: 3px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #707070;
  }
}
</style>
