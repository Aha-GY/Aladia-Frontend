<template>
  <div
    class="relative shrink-0 rounded bg-white pt-6 text-center text-black"
    :style="{ border: '3rem solid #707070' }"
  >
    <svg
      width="150"
      height="112.5"
      viewBox="0 0 150 112.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute inset-0 h-full w-full translate-y-4"
    >
      <path
        d="M0 0.662668V17.377L4.30632 13.3855V5.2975L0 0.662668Z"
        :fill="brandColor"
      />
      <path
        d="M16.6607 0.675781L0 0.675781L4.3235 5.22323L12.6695 4.98237L16.6607 0.675781Z"
        :fill="brandColor"
      />
      <path
        d="M150.008 0.662668V17.377L145.701 13.3855V5.2975L150.008 0.662668Z"
        :fill="brandColor"
      />
      <path
        d="M133.339 0.675781L150 0.675781L145.677 5.22323L137.331 4.98237L133.339 0.675781Z"
        :fill="brandColor"
      />
      <path
        d="M0 107.951V91.2363L4.3069 95.2278V103.316L0 107.951Z"
        :fill="brandColor"
      />
      <path
        d="M16.6629 107.938H0L4.32408 103.39L12.6712 103.631L16.6629 107.938Z"
        :fill="brandColor"
      />
      <path
        d="M149.992 107.951V91.2363L145.685 95.2278V103.316L149.992 107.951Z"
        :fill="brandColor"
      />
      <path
        d="M133.329 107.938H149.992L145.668 103.39L137.321 103.631L133.329 107.938Z"
        :fill="brandColor"
      />
    </svg>
    <div class="relative z-10 h-full w-full">
      <div class="mb-8 flex w-full shrink-0 justify-between px-40">
        <div class="w-64" />
        <div
          class="relative flex size-20 items-center justify-center rounded-full border border-dashed border-white/30 bg-black text-sm text-white"
        >
          <div class="absolute z-0 text-sm">LOGO</div>
          <img :src="logo" class="relative z-10 h-12" />
        </div>
        <div class="w-64 text-right text-lg">
          Certificate ID: {{ certificateId }}
        </div>
      </div>
      <div class="mb-2 text-2xl font-medium">CERTIFICATE OF ACHIEVEMENT</div>
      <div class="mb-4 text-lg">{{ year }}</div>
      <div class="mb-4 font-['Merriweather'] text-[3.2rem]">{{ username }}</div>
      <div class="mb-4 text-lg">has successfully completed the</div>
      <div
        class="mb-6 px-60 font-['Merriweather'] text-[3.4rem] uppercase leading-[1.2]"
        :style="{
          color: accentColor,
        }"
      >
        {{ courseName }}
      </div>
      <div class="mb-4 px-36 text-lg">
        to certify the successful completion of {{ courseHours }} hours of the
        “{{ courseName }}” course and achieving the following capabilities:
      </div>
      <div class="text-lg">
        {{ skills.join(', ') }}
      </div>
      <div class="mb-6 font-semibold">Provided by: {{ providerName }}</div>
      <div class="mb-6 flex w-full shrink-0 items-end justify-between px-36">
        <div class="flex flex-col items-center gap-1">
          <div class="text-lg font-bold">August 26, 2022</div>
          <div class="h-[1px] w-36 bg-[#C7A050]" />
          <div class="h-10 text-lg">Release DATE</div>
        </div>
        <div class="flex flex-col items-center gap-1">
          <div
            class="whitespace-nowrap text-4xl font-light"
            :style="{
              'font-family': signatureFont,
            }"
          >
            {{ signatureName }}
          </div>
          <div class="h-[1px] w-36 bg-[#C6A24D]" />
          <div class="h-10 text-lg">{{ signatoryRole }}</div>
        </div>
      </div>
      <div class="flex shrink-0 items-center justify-center gap-1 text-lg">
        <img src="/logo/image.png" class="h-6" />
        Powered by Aladia.io
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logo: {
      type: String,
    },
    brandColor: {
      type: String,
    },
    accentColor: {
      type: String,
    },
    signatureName: {
      type: String,
      default: 'Signature Name',
    },
    signatoryRole: {
      type: String,
      default: 'Signatory Role',
    },
    signatureFont: {
      type: String,
    },
    certificateId: {
      type: String,
    },
    username: {
      type: String,
      default: 'user name',
    },
    courseName: {
      type: String,
      default: 'course Name',
    },
    year: {
      type: String,
      default: '2025',
    },
    courseHours: {
      type: String,
    },
    providerName: {
      type: String,
    },
    skills: {
      type: Array,
    },
  },
};
</script>
