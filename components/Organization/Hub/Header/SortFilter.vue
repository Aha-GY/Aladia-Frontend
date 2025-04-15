<template>
  <div class="flex flex-col gap-6 px-3 py-2 text-[#D9D9D9]/80">
    <div class="flex gap-8">
      <div class="flex flex-col gap-4">
        <div class="flex h-9 items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center">
            <i class="fa-solid fa-dollar-sign" />
          </div>
          <div class="font-semibold">
            {{ $t('filter.sort.price') }}
          </div>
        </div>

        <div class="mx-9 w-[22.1875rem]">
          <div class="text-[#707070]">
            {{ $t('course.select.price') }}
          </div>
          <div class="my-6 flex items-center justify-between">
            <div class="flex items-center gap-2 text-base">
              {{ $t('course.select.from') }}
              <BaseInput
                v-model="priceValue[0]"
                fixed
                number
                class="!w-24 pl-2"
                placeholder="write here"
              />
              $
            </div>
            <div class="flex items-center gap-2 text-base">
              {{ $t('course.select.to') }}
              <BaseInput
                v-model="priceValue[1]"
                fixed
                number
                class="!w-24 pl-2"
                placeholder="write here"
              />
              $
            </div>
          </div>

          <div class="mb-5 mt-3 text-[#707070]">
            {{ $t('filter.choose.range.price') }}
          </div>
          <div
            class="mb-2 flex items-center justify-between text-base font-medium"
          >
            <span>0$</span>
            <span>2500$</span>
          </div>
          <el-slider
            v-model="priceValue"
            class="price-slider"
            :max="2500"
            range
            :show-tooltip="false"
          />
        </div>
      </div>

      <div class="flex-1">
        <div class="mb-4 flex h-9 items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center">
            <i class="fa-solid fa-book" />
          </div>
          <div class="font-semibold">
            {{ $t('filter.sort.category') }}
          </div>
        </div>
        <div class="flex h-60 flex-col gap-1.5 overflow-y-auto">
          <div
            v-for="item in dataList"
            :key="item.id"
            class="flex items-center gap-2 rounded-md p-1.5 hover:bg-white/5"
          >
            <BaseCheckboxStyle
              :state="actions.includes(item.id) ? 'checked' : 'unchecked'"
              data-cy="f2ab6dfa7559ef4a"
              @click="onClick(item.id)"
            />
            <div class="w-0 flex-1 truncate leading-4">{{ item.name }}</div>
            <div class="text-xs text-[#707070]">
              {{ $t('filter.detail') }}
            </div>
          </div>
        </div>
        <div
          class="flex cursor-pointer items-center justify-between px-1.5 py-3 text-[#D9D9D9]/50 transition-all hover:text-[#D9D9D9]/80"
        >
          {{ $t('filter.load.more') }}
          <i class="fa-light fa-chevron-right" />
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div class="flex h-9 items-center gap-2">
          <div class="flex h-7 w-7 items-center justify-center">
            <i class="fa-solid fa-star" />
          </div>
          <div class="font-semibold">
            {{ $t('filter.sort.rating') }}
          </div>
        </div>

        <div class="ml-9 w-[22.1875rem]">
          <div class="text-[#707070]">
            {{ $t('course.select.rating') }}
          </div>
          <div class="mb-6 mt-3 flex items-center justify-around">
            <div
              v-for="i in 5"
              :key="i"
              class="flex h-16 w-[2.625rem] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-[#707070]/60"
              :class="starActions.includes(i) ? 'border-[#E4B53D]' : ''"
              data-cy="ca3f272ff0ba90b3"
              @click="onStarChange(i)"
            >
              <i class="fa-solid fa-star text-[#E4B53D]" />
              <div class="text-base font-medium leading-4 text-[#D9D9D9]/60">
                {{ i }}
              </div>
            </div>
          </div>

          <!-- <div class="text-[#707070] mt-3 mb-5">Choose a range</div>
          <div class="flex items-center justify-between font-medium mb-2">
            <div class="flex items-center gap-1">
              1<i class="fa-solid fa-star text-[#E4B53D] text-xs"></i>
            </div>
            <div class="flex items-center gap-1">
              5<i class="fa-solid fa-star text-[#E4B53D] text-xs"></i>
            </div>
          </div>
          <el-slider
            v-model="starValue"
            :min="1"
            :max="5"
            class="star-slider"
            :show-tooltip="false"
          /> -->
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end gap-3">
      <BaseButton
        type="secondary"
        class="px-4"
        label="$t:base.upload.cancel"
        data-cy="b8dbc434b01d94e9"
        @click="$emit('close')"
      />
      <BaseButton
        icon="fa-solid fa-circle-check"
        class="px-4"
        label="$t:base.upload.apply"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startPrice: null,
      endPrice: null,
      priceValue: [0, 2500],
      dataList: [
        { id: 1, name: 'Adobe photoshop' },
        { id: 2, name: 'Art' },
        { id: 3, name: 'Communication' },
        { id: 4, name: 'Engeneering Civilization' },
        { id: 5, name: 'English' },
        { id: 6, name: 'Management' },
        { id: 7, name: 'Philosophy' },
      ],
      actions: [],
      starActions: [],
    };
  },
  methods: {
    onClick(id) {
      if (this.actions.includes(id)) {
        this.actions = this.actions.filter((item) => item !== id);
      } else {
        this.actions.push(id);
      }
    },
    onStarChange(i) {
      if (this.starActions.includes(i)) {
        this.starActions = this.starActions.filter((item) => item !== i);
      } else {
        this.starActions.push(i);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.star-slider {
  --el-slider-main-bg-color: #e4b53d !important;
}
</style>
