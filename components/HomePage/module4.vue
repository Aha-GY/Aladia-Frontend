<template>
  <div class="mt-[5rem] flex w-full flex-col items-center">
    <div
      class="m-auto w-full text-center text-[32px] font-bold leading-8 text-white md:text-[3.125rem] md:leading-[3.5rem] md:[max-inline-size:50rem]"
    >
      Your learning journey, on the go
    </div>
    <div
      class="mt-10 flex w-full flex-col items-center justify-around md:flex-row"
    >
      <img :src="mobile" class="mb-4 h-[411px] w-[27.43rem]" />
      <div class="flex flex-col">
        <div
          v-for="(item, index) in list"
          :key="index"
          class="flex flex-col md:mt-[3rem]"
        >
          <div class="inline-flex h-12 items-center justify-start gap-2">
            <img class="h-12 w-12" :src="item.img" />
            <div class="font-['Inter'] text-2xl font-normal text-[#d9d9d9]">
              {{ item.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import message from '~/assets/images/homepage/message-notification.png';
import mobile from '~/assets/images/homepage/mobile.png';
import tablet from '~/assets/images/homepage/tablet.png';
import task from '~/assets/images/homepage/task.png';

const list = [
  {
    img: tablet,
    text: 'Access Anywhere, Anytime',
  },
  {
    img: message,
    text: 'Push Notifications for Real-Time Engagement',
  },
  {
    img: task,
    text: 'Task Management & To-Do Lists on the Go',
  },
];
</script>
