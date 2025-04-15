<template>
  <div
    ref="ring"
    class="relative flex size-full items-end overflow-hidden rounded-full"
  >
    <svg
      :class="{
        '-translate-x-[1px] translate-y-[1px]': size === 'xl',
      }"
      xmlns="http://www.w3.org/2000/svg"
      :width="sizeConfig.width"
      :height="sizeConfig.height"
      :viewBox="sizeConfig.viewBox"
      fill="none"
    >
      <path :d="sizeConfig.path" :fill="`url(#${id})`" />
      <defs>
        <linearGradient
          :id="id"
          :x1="sizeConfig.gradient.x1"
          :y1="sizeConfig.gradient.y1"
          :x2="sizeConfig.gradient.x2"
          :y2="sizeConfig.gradient.y2"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            offset="0.0685854"
            :stop-color="colors.primary"
            stop-opacity="0"
          />
          <stop offset="0.336619" :stop-color="colors.primary" />
          <stop
            offset="0.67697"
            :stop-color="colors.primary"
            :stop-opacity="colors.midOpacity"
          />
          <stop
            offset="0.891602"
            :stop-color="colors.primary"
            stop-opacity="0"
          />
        </linearGradient>
      </defs>
    </svg>
    <svg
      class="absolute inset-0"
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="width"
      :viewBox="`0 0 ${width} ${width}`"
      :style="`transform: rotate(${sizeConfig.rotate}deg)`"
      fill="none"
    >
      <path :id="`textPath-${id}`" :d="computedTextPath" fill="none" />
      <text
        :style="{ fontSize: sizeConfig.fontSize, letterSpacing: '0.2em' }"
        fill="white"
      >
        <textPath :href="`#textPath-${id}`" startOffset="0">
          {{ statusText }}
        </textPath>
      </text>
    </svg>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  size: {
    type: String,
    default: 'sm',
  },
  work: {
    type: String,
    default: '',
  },
  width: {
    type: Number,
    default: 0,
  },
});
const { t } = useI18n();
const id = ref(Math.random().toString(36).substring(7));

const statusText = computed(() =>
  props.work === 'open-to-work'
    ? t('personal.profile.type.openToWork')
    : t('personal.profile.type.hiring'),
);

const colors = computed(() => ({
  primary: props.work === 'open-to-work' ? '#0CAD56' : '#3B0764',
  midOpacity: props.work === 'open-to-work' ? 0.85 : 1,
}));

const computedTextPath = computed(() => {
  if (!props.width) {
    return '';
  }
  const center = props.width / 2;
  const radius = props.width / 2.3;
  return `M ${center + radius} ${center} A ${radius} ${radius} 0 0 0 ${center - radius} ${center}`;
});

const sizeConfigs = computed(() => ({
  sm: {
    width: 17,
    height: 25,
    rotate: props.work === 'open-to-work' ? 200 : 170,
    viewBox: '0 0 17 25',
    fontSize: '2px',
    path: 'M16.1901 24.3279C13.2881 24.7875 10.315 24.3224 7.69193 22.9986C5.06888 21.6747 2.92885 19.5591 1.57493 16.9514C0.221017 14.3437 -0.278144 11.3761 0.148147 8.46903C0.574439 5.56191 1.90457 2.8626 3.95016 0.753418L6.17413 2.91033C6.96704 3.67933 6.96269 4.93785 6.38968 5.88216C5.77562 6.89413 5.36599 8.02429 5.19232 9.20869C4.92126 11.0572 5.23865 12.9441 6.09954 14.6022C6.96042 16.2603 8.32116 17.6055 9.98902 18.4473C11.0577 18.9867 12.2177 19.3018 13.3987 19.3818C14.5008 19.4564 15.5327 20.1769 15.7054 21.2679L16.1901 24.3279Z',
    gradient: {
      x1: -2.92812,
      y1: 6.81346,
      x2: 22.8728,
      y2: 12.8064,
    },
  },
  md: {
    width: 27,
    height: 42,
    rotate: props.work === 'open-to-work' ? 205 : 180,
    viewBox: '0 0 27 42',
    fontSize: '4px',
    path: 'M26.9249 41.3212C21.9255 41.935 16.8597 40.9604 12.445 38.5353C8.0303 36.1103 4.49047 32.3577 2.3269 27.8091C0.163327 23.2605 -0.514316 18.1465 0.389949 13.1914C1.29422 8.23635 3.73455 3.69135 7.36531 0.200195L12.0366 5.05831C12.8022 5.85452 12.7653 7.11352 12.076 7.9766C10.508 9.93976 9.44233 12.2685 8.98758 14.7604C8.4126 17.9111 8.84348 21.1629 10.2192 24.0551C11.5949 26.9473 13.8457 29.3334 16.6528 30.8753C18.8729 32.0949 21.352 32.7376 23.8644 32.7599C24.9689 32.7697 25.9689 33.5355 26.1035 34.6318L26.9249 41.3212Z',
    gradient: {
      x1: -4.8696,
      y1: 10.7397,
      x2: 38.2275,
      y2: 20.3119,
    },
  },
  lg: {
    width: 57,
    height: 59,
    rotate: props.work === 'open-to-work' ? 190 : 170,
    viewBox: '0 0 57 59',
    fontSize: '7px',
    path: 'M56.9048 55.2524C49.2964 58.8003 40.7647 59.8644 32.518 58.2941C24.2713 56.7239 16.7276 52.5988 10.9555 46.5032C5.18342 40.4075 1.47544 32.6504 0.356775 24.3304C-0.76189 16.0104 0.765472 7.54927 4.72253 0.145508L13.1592 4.65461C15.5946 5.95625 16.46 8.98102 15.6592 11.6238C14.6086 15.0906 14.3051 18.7611 14.7929 22.3894C15.5042 27.6796 17.8619 32.612 21.5321 36.4879C25.2023 40.3638 29.9989 42.9867 35.2426 43.9852C38.8389 44.67 42.5205 44.5668 46.0394 43.7067C48.7218 43.051 51.695 44.08 52.862 46.5827L56.9048 55.2524Z',
    gradient: {
      x1: -10.2917,
      y1: 15.1648,
      x2: 75.9302,
      y2: 43.5666,
    },
  },
  xl: {
    width: 143,
    height: 148,
    rotate: props.work === 'open-to-work' ? 195 : 170,
    viewBox: '0 0 143 148',
    fontSize: '18px',
    path: 'M142.262 138.631C123.241 147.5 101.912 150.161 81.295 146.235C60.6782 142.309 41.8191 131.996 27.3888 116.757C12.9586 101.518 3.6886 82.1254 0.891937 61.3254C-1.90472 40.5254 1.91368 19.3727 11.8063 0.863281L39.5125 15.6713C41.9479 16.9729 42.8473 19.9958 41.741 22.5259C37.0897 33.1631 35.4267 44.9038 36.9823 56.4729C38.7605 69.6986 44.6548 82.0296 53.8303 91.7193C63.0058 101.409 74.9973 107.966 88.1065 110.463C99.5736 112.646 111.387 111.625 122.262 107.56C124.849 106.593 127.818 107.656 128.985 110.159L142.262 138.631Z',
    gradient: {
      x1: -25.7293,
      y1: 38.4116,
      x2: 189.825,
      y2: 109.416,
    },
  },
}));

const sizeConfig = computed(() => sizeConfigs.value[props.size]);
</script>
