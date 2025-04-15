<template>
  <div
    class="relative shrink-0 rounded bg-white px-6 pb-4 pt-6 text-center text-black"
  >
    <svg
      width="153"
      height="118"
      viewBox="0 0 153 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute inset-0 h-full w-full"
    >
      <rect
        width="50.8146"
        height="15.7264"
        transform="matrix(0.718901 -0.695113 0.718901 0.695113 -14.7656 23.1406)"
        :fill="brandColor"
      />
      <line
        y1="-0.689548"
        x2="60.3492"
        y2="-0.689548"
        transform="matrix(0.718901 -0.695113 0.718901 0.695113 -8.71875 36.4551)"
        :stroke="accentColor"
        stroke-width="1.3791"
      />
      <rect
        width="50.8146"
        height="15.7264"
        transform="matrix(-0.718901 0.695113 -0.7189 -0.695113 166.828 95.2324)"
        :fill="brandColor"
      />
      <line
        y1="-0.689548"
        x2="60.3492"
        y2="-0.689548"
        transform="matrix(-0.718901 0.695113 -0.7189 -0.695113 160.789 81.918)"
        :stroke="accentColor"
        stroke-width="1.3791"
      />
    </svg>
    <div class="relative z-10 h-full w-full">
      <div class="mb-8 flex w-full shrink-0 items-center justify-between">
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
      <div class="mb-6 text-lg">{{ year }}</div>
      <div class="mb-6 font-['Merriweather'] text-[3.2rem]">{{ username }}</div>
      <div class="mb-4 text-lg">has successfully completed the</div>
      <div
        class="mb-8 px-72 font-['Merriweather'] text-[3.4rem] uppercase leading-[1.2]"
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
      <div class="mb-12 font-semibold">Provided by: {{ providerName }}</div>
      <div class="mb-12 flex w-full shrink-0 items-end justify-between px-36">
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
