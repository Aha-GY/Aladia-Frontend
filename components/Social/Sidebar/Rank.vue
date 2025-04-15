<template>
  <div class="relative z-10 flex gap-4 overflow-hidden px-5 pb-3">
    <div class="relative z-10 w-[4.625rem] pt-3 text-center">
      <img src="~/assets/social/sidebar/Trophy2.svg" class="m-auto" alt="" />
      <div
        class="group mt-1.5 cursor-pointer rounded bg-black pb-0.5 pt-1.5 text-center"
        :class="isCategory ? '' : 'tag'"
        data-image="https://storage.googleapis.com/testing_uploads/MariaMaschio.jpeg"
      >
        <div
          v-if="isCategory"
          class="relative m-auto flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
        >
          <img src="~/assets/social/sidebar/Google.svg" alt="" />
        </div>
        <img
          v-else
          src="~/assets/social/sidebar/rank2.png"
          class="m-auto h-8 w-8 rounded"
          alt=""
        />
        <div class="text-white underline-offset-4 group-hover:underline">
          {{ data[1]?.lastName }}
        </div>
        <div class="text-white underline-offset-4 group-hover:underline">
          {{ data[1]?.firstName }}
        </div>
        <div v-if="data[1]?.isQuestion" class="text-[#707070]">
          {{ data[1]?.number }} {{ $t('post.question.label') }}
        </div>
        <div v-else class="text-[#707070]">({{ data[1]?.number }})</div>
      </div>
    </div>
    <div class="relative z-10 flex-1 text-center">
      <img src="~/assets/social/sidebar/Trophy.svg" class="m-auto" alt="" />
      <div
        class="group mt-1.5 cursor-pointer rounded bg-black pb-1 pt-2 text-center"
        :class="isCategory ? '' : 'tag'"
        data-image="https://storage.googleapis.com/testing_uploads/MariaMaschio.jpeg"
      >
        <div
          v-if="isCategory"
          class="relative m-auto flex h-10 w-10 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
        >
          <img src="~/assets/social/sidebar/Google.svg" alt="" />
        </div>
        <img
          v-else
          src="~/assets/social/sidebar/rank1.png"
          class="m-auto h-10 w-10 rounded-lg"
          alt=""
        />
        <div
          class="text-sm text-white underline-offset-4 group-hover:underline"
        >
          {{ data[0]?.lastName }}
        </div>
        <div
          class="text-sm text-white underline-offset-4 group-hover:underline"
        >
          {{ data[0]?.firstName }}
        </div>
        <div v-if="data[0]?.isQuestion" class="mt-2 text-[#707070]">
          {{ data[0]?.number }} {{ $t('post.question.label') }}
        </div>
        <div v-else class="mt-2 text-[#707070]">({{ data[0]?.number }})</div>
      </div>
    </div>
    <div class="relative z-10 w-[4.625rem] pt-3 text-center">
      <img src="~/assets/social/sidebar/Trophy3.svg" class="m-auto" alt="" />
      <div
        class="group mt-1.5 cursor-pointer rounded bg-black pb-0.5 pt-1.5 text-center"
        :class="isCategory ? '' : 'tag'"
        data-image="https://storage.googleapis.com/testing_uploads/MariaMaschio.jpeg"
      >
        <div
          v-if="isCategory"
          class="relative m-auto flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
        >
          <img src="~/assets/social/sidebar/Google.svg" alt="" />
        </div>
        <img
          v-else
          src="~/assets/social/sidebar/rank3.png"
          class="m-auto h-8 w-8 rounded pb-0.5"
          alt=""
        />
        <div class="text-white underline-offset-4 group-hover:underline">
          {{ data[2]?.lastName }}
        </div>
        <div class="text-white underline-offset-4 group-hover:underline">
          {{ data[2]?.firstName }}
        </div>
        <div v-if="data[2]?.isQuestion" class="text-[#707070]">
          {{ data[2]?.number }} Question
        </div>
        <div v-else class="text-[#707070]">({{ data[2]?.number }})</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    isCategory: Boolean,
  },
};
</script>
