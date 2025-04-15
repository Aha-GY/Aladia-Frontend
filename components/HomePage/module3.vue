<template>
  <div class="flex w-full flex-col items-center">
    <div class="py-12 text-[40px] font-bold text-white">
      Boost Your Productivity with Powerful Tools
    </div>
    <HomePageCardTrans />
    <div class="flex w-full items-center justify-between">
      <HomePageBox
        v-for="(item, index) in data"
        :key="index"
        class="inline-flex h-[440px] w-[32%] flex-col items-center justify-end overflow-hidden rounded-xl bg-[#060606]"
      >
        <div class="flex w-full flex-1 items-center justify-center">
          <HomePageCardTrans
            :class="
              item.title !== 'Events'
                ? `h-[7.25rem] w-[10.3rem]`
                : `h-[7.65rem] w-[7.65rem]`
            "
            :cards="item.cards"
          />
        </div>
        <div
          class="inline-flex min-h-[8.125rem] flex-col items-start justify-start gap-3 overflow-hidden rounded-bl-xl rounded-br-xl bg-black/60 px-7 py-5 backdrop-blur-[5rem]"
        >
          <div class="self-stretch text-[1.375rem] font-semibold text-white">
            {{ item.title }}
          </div>
          <div class="self-stretch text-xs font-normal text-[#707070]">
            {{ item.description }}
          </div>
        </div>
      </HomePageBox>
    </div>
    <div class="mt-[5rem] h-[661px] w-full rounded-xl">
      <img :src="GeneralFeed" class="h-full w-full" />
    </div>
  </div>
</template>
<script setup>
import Calendar from '~/assets/images/homepage/Calendar.png';
import Course from '~/assets/images/homepage/Course.png';
import GeneralFeed from '~/assets/images/homepage/GeneralFeed.png';
import Space from '~/assets/images/homepage/Space.png';

const data = ref([
  {
    title: 'Spaces',
    description: `Create as many spaces as you'd like with no restrictions! Set up multiple spaces to organize your content`,
    cards: [Space, Space, Space],
  },
  {
    title: 'Courses',
    description: `Launch courses easily! Customize content, add videos, quizzes, and track progress on one platform. Share your expertise and grow your audience`,
    cards: [Course, Course, Course],
  },
  {
    title: 'Events',
    description: `Host interactive learning events, enabling engaging workshops, webinars, and training for students and professionals`,
    cards: [Calendar, Calendar, Calendar],
  },
]);
</script>
