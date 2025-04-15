<template>
  <div class="relative text-xs">
    <div class="relative overflow-hidden">
      <div
        class="relative z-10 pb-1 text-center text-xs text-[rgba(112,112,112,0.47)]"
      >
        {{ $t('category.question.more') }}
      </div>
      <SocialSidebarDate />

      <div class="relative z-10 px-6 pb-2 pt-4">
        <div
          class="group mb-1.5 flex cursor-pointer items-center justify-between text-xs text-[#707070]"
        >
          <div class="flex items-center">
            <div class="mr-2 w-4 text-right">
              <img
                src="~/assets/social/sidebar/categoryRank1.svg"
                class="translate-x-1"
                alt=""
              />
            </div>
            <div
              class="relative mr-3 flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
            >
              <img src="~/assets/social/sidebar/Google.svg" alt="" />
            </div>
            <div
              class="w-[9.375rem] truncate pb-[1px] text-[#f1f1f1] underline-offset-4 group-hover:underline"
            >
              Javascript and framework
            </div>
          </div>
          <div>123</div>
        </div>
        <div
          class="group mb-1.5 flex cursor-pointer items-center justify-between text-xs text-[#707070]"
        >
          <div class="flex items-center">
            <div class="mr-2 w-4 text-right">
              <img
                src="~/assets/social/sidebar/categoryRank2.svg"
                class="translate-x-1"
                alt=""
              />
            </div>
            <div
              class="relative mr-3 flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
            >
              <img src="~/assets/social/sidebar/Google.svg" alt="" />
            </div>
            <div
              class="w-[9.375rem] truncate pb-[1px] text-[#f1f1f1] underline-offset-4 group-hover:underline"
            >
              Python and machine lear...
            </div>
          </div>
          <div>123</div>
        </div>
        <div
          class="group mb-1.5 flex cursor-pointer items-center justify-between text-xs text-[#707070]"
        >
          <div class="flex items-center">
            <div class="mr-2 w-4 text-right">
              <img
                src="~/assets/social/sidebar/categoryRank3.svg"
                class="translate-x-1"
                alt=""
              />
            </div>
            <div
              class="relative mr-3 flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
            >
              <img src="~/assets/social/sidebar/Google.svg" alt="" />
            </div>
            <div
              class="w-[9.375rem] truncate pb-[1px] text-[#f1f1f1] underline-offset-4 group-hover:underline"
            >
              Python
            </div>
          </div>
          <div>123</div>
        </div>
        <div
          class="group mb-1.5 flex cursor-pointer items-center justify-between text-xs text-[#707070]"
        >
          <div class="flex items-center">
            <div class="mr-2 w-4 text-right">4</div>
            <div
              class="relative mr-3 flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
            >
              <img src="~/assets/social/sidebar/Google.svg" alt="" />
            </div>
            <div
              class="w-[9.375rem] truncate pb-[1px] text-[#f1f1f1] underline-offset-4 group-hover:underline"
            >
              Node.js
            </div>
          </div>
          <div>123</div>
        </div>
        <div
          class="group mb-1.5 flex cursor-pointer items-center justify-between text-xs text-[#707070]"
        >
          <div class="flex items-center">
            <div class="mr-2 w-4 text-right">5</div>
            <div
              class="relative mr-3 flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
            >
              <img src="~/assets/social/sidebar/Google.svg" alt="" />
            </div>
            <div
              class="w-[9.375rem] truncate pb-[1px] text-[#f1f1f1] underline-offset-4 group-hover:underline"
            >
              Indian Cuisine
            </div>
          </div>
          <div>111</div>
        </div>
        <div
          class="group flex cursor-pointer items-center justify-between text-xs text-[#707070]"
        >
          <div class="flex items-center">
            <div class="mr-2 w-4 text-right">6</div>
            <div
              class="relative mr-3 flex h-8 w-8 items-center justify-center rounded bg-[url(~/assets/icons/category-frame.svg)] transition-all duration-300 group-hover:scale-125"
            >
              <img src="~/assets/social/sidebar/Google.svg" alt="" />
            </div>
            <div
              class="w-[9.375rem] truncate pb-[1px] text-[#f1f1f1] underline-offset-4 group-hover:underline"
            >
              Math
            </div>
          </div>
          <div>92</div>
        </div>
      </div>
      <div
        class="absolute bottom-0 left-1/2 h-[32rem] w-[97rem] -translate-x-1/2 overflow-hidden rounded-[50%] border border-[#f1f1f1]/40 bg-[#0C0C0C]"
      >
        <!-- <div
            class="w-full h-full absolute bottom-[1px] left-0 rounded-[50%] border border-[#f1f1f1]/40"
          ></div>
          <div
            class="w-[10rem] h-8 bg-gradient-to-r from-transparent to-[#0C0C0C] absolute z-10 bottom-0 left-1/2"
          ></div>
          <div
            class="w-[10rem] h-8 bg-gradient-to-l from-transparent to-[#0C0C0C] absolute z-10 bottom-0 right-1/2"
          ></div> -->
      </div>
    </div>

    <div class="pb-3 pt-5 text-center text-base font-semibold">
      {{ $t('category.used.most') }}
    </div>
    <SocialSidebarRank :data="rankList" :is-category="true" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      rankList: [
        {
          firstName: 'Analytics',
          lastName: 'Google',
          number: 23,
          isQuestion: true,
        },
        {
          firstName: 'Research',
          lastName: 'Google',
          number: 12,
          isQuestion: false,
        },
        {
          firstName: 'SEO',
          lastName: 'Google',
          number: 15,
          isQuestion: false,
        },
      ],
    };
  },
};
</script>
