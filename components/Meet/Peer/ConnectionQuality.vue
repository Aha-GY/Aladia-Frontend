<template>
  <div class="z-20 ml-1 h-3 w-3 shrink-0">
    <svg
      v-if="networkScore > 0"
      :width="12"
      :height="12"
      viewBox="0 0 14 12"
      xmlns="http://www.w3.org/2000/svg"
      :style="{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 2,
      }"
    >
      <!-- 定义阴影效果 -->
      <defs>
        <filter id="text-shadow" x="0" y="0">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="1"
            flood-color="rgba(0, 0, 0, 0.6)"
          />
        </filter>
      </defs>
      <path
        d="M6.875 0c2.549.035 4.679.902 6.445 2.648.366.362.45.796.216 1.096-.239.306-.714.34-1.142.072a2.28 2.28 0 0 1-.341-.271C9.24.862 4.924.775 1.992 3.346c-.284.249-.594.419-.983.393-.272-.019-.49-.135-.613-.388-.125-.261-.05-.498.114-.713.073-.092.156-.177.245-.254C2.516.804 4.591.039 6.875 0Z"
        :fill="getColor(4, networkScore)"
        transform="translate(-.333)"
        :filter="isShow ? 'url(#text-shadow)' : ''"
      />
      <path
        d="M7.056 2.964c1.756.035 3.208.7 4.499 1.763.162.134.277.315.354.512.098.251.114.503-.075.72-.193.222-.452.259-.725.198-.293-.066-.518-.247-.738-.443a4.859 4.859 0 0 0-6.198-.26c-.166.127-.318.271-.475.409-.242.211-.513.343-.843.317-.43-.034-.679-.397-.561-.81.062-.211.181-.4.345-.546 1.265-1.162 2.733-1.836 4.417-1.86Z"
        :fill="getColor(3, networkScore)"
        transform="translate(-.333)"
        :filter="isShow ? 'url(#text-shadow)' : ''"
      />
      <path
        d="M7.384,6.052C8.293,6.068 9.157,6.449 9.783,7.108C10.005,7.339 10.157,7.6 10.07,7.942C9.959,8.377 9.435,8.581 9.071,8.243C7.935,7.191 6.356,7.183 5.152,8.183C4.816,8.462 4.6,8.485 4.332,8.27C4.063,8.055 3.998,7.691 4.177,7.358C4.273,7.179 4.414,7.038 4.57,6.911C5.26,6.349 6.149,6.05 7.384,6.052L7.384,6.052Z"
        :fill="getColor(2, networkScore)"
        :filter="isShow ? 'url(#text-shadow)' : ''"
      />
      <path
        d="M8.214,9.941C8.214,10.234 8.097,10.515 7.888,10.721C7.68,10.928 7.398,11.042 7.104,11.039C6.471,11.036 5.982,10.541 5.993,9.912C6.004,9.259 6.499,8.766 7.133,8.779C7.744,8.791 8.22,9.301 8.214,9.941Z"
        :fill="getColor(1, networkScore)"
        :filter="isShow ? 'url(#text-shadow)' : ''"
      />
    </svg>
    <!-- Disconnected - not connected to the server, the peer might be in reconnection phase -->
    <svg
      v-else
      class="text-[#ed4c5a]"
      width="12px"
      height="12px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- 定义阴影效果 -->
      <defs>
        <filter id="text-shadow" x="0" y="0">
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="1"
            flood-color="rgba(0, 0, 0, 0.6)"
          />
        </filter>
      </defs>
      <path
        d="M3.046 3.046a.75.75 0 000 1.06l16.847 16.848a.75.75 0 101.06-1.06L4.108 3.045a.75.75 0 00-1.06 0zm.256 6.303a13.888 13.888 0 012.175-1.432l1.356 1.356c-.847.401-1.65.902-2.391 1.497a.91.91 0 01-1.14-1.42zm2.066 3.625A9.79 9.79 0 018.57 11.01l1.451 1.451a7.969 7.969 0 00-3.42 1.854.91.91 0 11-1.233-1.34zm7.503-2.543l2.563 2.563a7.968 7.968 0 011.927 1.297.91.91 0 101.227-1.346 9.79 9.79 0 00-5.717-2.514zm2.391 7.271L12.05 14.49h-.057a5.698 5.698 0 00-1.752.277c-.852.276-1.63.75-2.267 1.386a.91.91 0 101.286 1.29 3.878 3.878 0 013.66-1.019c.683.17 1.308.521 1.807 1.019.15.15.34.236.535.259zM9.048 6.608l1.582 1.583a12.07 12.07 0 018.928 2.584.91.91 0 001.14-1.42 13.89 13.89 0 00-11.65-2.747z"
        fill="currentColor"
        :filter="isShow ? 'url(#text-shadow)' : ''"
      />
    </svg>
  </div>
</template>
<script>
import { selectConnectionQualityByPeerID } from '@100mslive/hms-video-store';

import { hmsStore } from '~/utils/hms';

export default {
  props: {
    peerId: {
      type: String,
      required: true,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      // a number between -1 to 5 representing the connection score, -1 meaning undefined
      networkScore: -1,
      unsub: null,
    };
  },
  mounted() {
    this.init();
  },
  unmounted() {
    if (this.unsub) {
      this.unsub();
    }
  },
  methods: {
    init() {
      this.unsub = hmsStore.subscribe((score) => {
        this.networkScore = score?.downlinkQuality || -1;
      }, selectConnectionQualityByPeerID(this.peerId));
    },
    getColor(position, connectionScore) {
      const defaultColor = '#303740';
      // for e.g. for score = 2 only the initial 2 arcs will be colored
      const shouldBeColored = position <= connectionScore;
      if (!shouldBeColored) {
        return defaultColor;
      }
      if (connectionScore >= 4) {
        // good connection
        return '#37F28D'; // green color
      } else if (connectionScore >= 3) {
        // moderate connection
        return '#FAC919'; // yellow color
      } else {
        // poor connection
        return '#ED4C5A'; // red color
      }
    },
  },
};
</script>
