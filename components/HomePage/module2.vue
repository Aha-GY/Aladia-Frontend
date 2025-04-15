<template>
  <div class="flex w-full flex-col items-center">
    <div
      class="mt-[2.5rem] w-[44rem] text-center text-[2.5rem] font-semibold text-white"
    >
      Your Complete Solution: Events, Chats, Courses, and More
    </div>
    <div class="text-center text-base font-normal text-[#b0b0b0]">
      Streamline your experience with events, courses, and collaborative spaces
      — all in one place.
    </div>
    <div class="mt-[4.375rem] flex w-full justify-between">
      <HomePageBox
        class="flex h-[740px] flex-col items-center justify-center rounded-xl max-lg:mr-4 max-lg:w-[22rem] lg:mr-6 lg:w-[26rem] min-[1150px]:mr-8 min-[1150px]:w-[28.75rem]"
      >
        <div class="pb-2 text-center text-2xl font-semibold text-white">
          Buy Expert-Led Courses
        </div>
        <div
          class="w-[20.75rem] text-center text-sm font-normal text-[#b7b7b7]"
        >
          Purchase high-quality, expert-led courses to boost your skills and
          achieve your goals. Start learning today!
        </div>
      </HomePageBox>
      <div class="flex-1 overflow-hidden">
        <HomePageBox
          class="mb-8 flex h-[354px] w-full flex-col items-center justify-center rounded-xl bg-[#060606] px-5"
        >
          <div>
            <div class="pb-2 text-start text-2xl font-semibold text-white">
              Chat Your Way to Better Collaboration
            </div>
            <div
              class="w-[25.5rem] text-start text-sm font-normal text-[#b7b7b7]"
            >
              Say goodbye to chaos. Keep everything organized and save time each
              week.
            </div>
          </div>
        </HomePageBox>
        <HomePageBox
          class="flex h-[354px] w-full flex-col items-center justify-center rounded-xl bg-[#060606] px-5"
        >
          <div>
            <div class="pb-2 text-start text-2xl font-semibold text-white">
              Assigning roles keeps you structured
            </div>
            <div
              class="w-[25.5rem] text-start text-sm font-normal text-[#b7b7b7]"
            >
              Create and launch your courses with ease! Assign and organize
              roles inside your workspace.
            </div>
          </div>
        </HomePageBox>
      </div>
    </div>
    <HomePageBox
      class="mt-8 flex h-[354px] w-full flex-col items-center justify-center rounded-xl bg-[#060606] px-8"
    >
      <div class="mb-3 text-center text-xl font-normal text-white">
        The power of AI in your fingertips
      </div>
      <div class="w-[20.75rem] text-center text-sm font-normal text-[#b7b7b7]">
        Create courses effortlessly with the power of AI. Our AI tools help you
        build engaging, high-quality courses in no time.
      </div>
      <div
        class="mt-6 inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[5px] border border-neutral-800 bg-gradient-to-r from-[#6616b5] via-[#b0308c] to-[#4c52d8] px-4 py-1.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[15px]"
      >
        <i class="fa-light fa-sparkles" />
        <div
          class="cursor-pointer text-center text-sm font-light text-neutral-50"
          @click="handleGenerate"
        >
          Generate with AI
        </div>
      </div>
    </HomePageBox>
  </div>
</template>
<script setup>
const authStore = useAuthStore();
const handleGenerate = () => {
  if (!authStore.logged) {
    authStore.popup = true;
  }
};
</script>
