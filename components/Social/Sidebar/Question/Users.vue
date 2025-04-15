<template>
  <div class="relative mb-4 text-xs">
    <div class="relative overflow-hidden">
      <div
        class="relative z-10 pb-1 text-center text-xs text-[rgba(112,112,112,0.47)]"
      >
        {{ $t('category.contribute.users') }}
      </div>
      <SocialSidebarDate class="mb-1" />

      <SocialSidebarRank :data="rankList" />

      <div
        class="absolute bottom-0 left-1/2 h-[23rem] w-[41rem] -translate-x-1/2 overflow-hidden rounded-[50%] bg-[#0C0C0C]"
      >
        <div
          class="absolute bottom-[1px] left-0 h-full w-full rounded-[50%] border border-[#f1f1f1]/40"
        />
        <div
          class="absolute bottom-0 left-1/2 z-10 h-8 w-[10rem] bg-gradient-to-r from-transparent to-[#0C0C0C]"
        />
        <div
          class="absolute bottom-0 right-1/2 z-10 h-8 w-[10rem] bg-gradient-to-l from-transparent to-[#0C0C0C]"
        />
      </div>
    </div>

    <div class="-mt-1">
      <div
        class="group mb-1.5 flex cursor-pointer items-center justify-between pl-4 pr-6 text-xs text-[#707070]"
      >
        <div class="flex items-center">
          <div class="mr-2 w-5 text-right">4</div>
          <img
            src="~/assets/social/sidebar/rank2.png"
            class="mr-3 h-8 w-8 rounded"
            alt=""
          />
          <div class="text-[#f1f1f1] underline-offset-4 group-hover:underline">
            Erin Dokodis
          </div>
        </div>
        <div>23</div>
      </div>
      <div
        class="group mb-1.5 flex cursor-pointer items-center justify-between pl-4 pr-6 text-xs text-[#707070]"
      >
        <div class="flex items-center">
          <div class="mr-2 w-5 text-right">5</div>
          <img
            src="~/assets/social/sidebar/rank2.png"
            class="mr-3 h-8 w-8 rounded"
            alt=""
          />
          <div class="text-[#f1f1f1] underline-offset-4 group-hover:underline">
            Kadin Bergunson
          </div>
        </div>
        <div>11</div>
      </div>

      <div
        class="group relative flex cursor-pointer items-center justify-between pl-4 pr-6 pt-1.5 text-xs text-[#707070]"
      >
        <div class="flex items-center">
          <div class="mr-2 w-5 text-right">137</div>
          <img
            src="~/assets/social/sidebar/rank2.png"
            class="mr-3 h-8 w-8 rounded"
            alt=""
          />
          <div class="text-[#f1f1f1] underline-offset-4 group-hover:underline">
            You
          </div>
        </div>
        <div>1</div>
        <div class="bg-gradient-top absolute left-0 top-0 h-[1px] w-full" />
      </div>
    </div>
  </div>

  <SocialSidebarQuestionStats />
</template>
<script>
export default {
  setup() {
    const socialStore = useSocialStore();
    return { socialStore };
  },
  data() {
    return {
      rankList: [
        {
          firstName: 'Dias',
          lastName: 'Lindsey',
          number: 46,
          isQuestion: false,
        },
        {
          firstName: 'Carder',
          lastName: 'Marley',
          number: 24,
          isQuestion: false,
        },
        {
          firstName: 'Geidt',
          lastName: 'Leo',
          number: 28,
          isQuestion: false,
        },
      ],
    };
  },
};
</script>
