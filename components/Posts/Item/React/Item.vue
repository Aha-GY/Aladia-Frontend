<template>
  <div
    class="group relative z-10 flex h-6 w-6 cursor-pointer items-center justify-center transition-all duration-300"
    :style="{ background: unBackground ? '' : getBackgroundColor }"
    @mouseenter="onMouseenter"
    @mouseleave="isHover && (reactHover = false)"
  >
    <template v-if="name">
      <div v-if="name === 'Frame'">
        <span
          class="block text-[#B0B0B0] opacity-100 group-hover:hidden group-hover:opacity-0"
        >
          <i class="fa-regular fa-heart mr-2" />
        </span>
        <span
          class="hidden text-[#B0B0B0] opacity-0 group-hover:block group-hover:opacity-100"
        >
          <i class="fa-solid fa-heart mr-2" />
        </span>
      </div>
      <img
        v-else
        :src="reactHover ? getImgHover : getImg"
        class="h-4 w-4 cursor-pointer transition-all duration-300"
        :class="reactHover ? 'h-5 w-5 -translate-y-1 scale-[1.4]' : ''"
        alt=""
        data-cy="cc89af2ffa82d0ac"
        @click="!unHover && showReacPopup()"
      />
    </template>

    <div v-if="!name" class="italic underline-offset-2 hover:underline">
      <span data-cy="cea879842df81ecc" @click="showReacPopup(true)">
        {{ number }}
      </span>
    </div>
    <div
      v-if="!unHover"
      class="absolute bottom-[1.375rem] left-1/2 max-h-0 -translate-x-1/2 cursor-pointer overflow-hidden text-xs opacity-100 transition-all duration-300 group-hover:max-h-[11rem] group-hover:opacity-100"
      :class="socialStore.reactionUsersLoading ? '' : 'w-[7.5rem]'"
      data-cy="8333d6f9cdf875ac"
      @click="showReacPopup"
    >
      <div
        v-if="socialStore.reactionUsersLoading"
        class="mb-2 rounded p-2 backdrop-blur"
        :style="{ background: getHoverNumberBackgroundColor }"
      >
        <i class="fa-solid fa-spinner animate-spin text-xs" />
      </div>
      <div
        v-else
        class="mb-2 rounded p-2 backdrop-blur"
        :style="{ background: getHoverNumberBackgroundColor }"
      >
        <div class="mb-2 flex items-center">
          <div class="font-semibold capitalize">
            {{ name ? name : $t('post.reaction') }}
          </div>
          <div
            v-if="name"
            class="ml-1 flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded"
            :style="{ background: getHoverNumberColor }"
          >
            {{ users.length }}
          </div>
        </div>
        <div
          v-for="user in users"
          :key="user.id"
          class="mb-0.5 underline-offset-2 hover:underline"
        >
          {{ user.owner?.name }}
        </div>
        <div
          v-if="totalRecords > users.length"
          class="underline-offset-2 transition-all hover:underline active:scale-95"
          @click="showReacPopup"
        >
          {{ $t('post.record.more', { record: totalRecords - users.length }) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Frame from '~/assets/social/react/Frame.svg';
import AngryGif from '~/assets/social/react/Angry.gif';
import Angry from '~/assets/social/react/Angry.svg';
import ClapGif from '~/assets/social/react/Clap.gif';
import Clap from '~/assets/social/react/Clap.svg';
import FunnyGif from '~/assets/social/react/Funny.gif';
import Funny from '~/assets/social/react/Funny.svg';
import Like from '~/assets/social/react/Like.svg';
import LovelyGif from '~/assets/social/react/Lovely.gif';
import Lovely from '~/assets/social/react/Lovely.svg';
import SadGif from '~/assets/social/react/Sad.gif';
import Sad from '~/assets/social/react/Sad.svg';
import { _MAXREACTCOUNT, _REACT_USERLIST_CACHE } from '~/constant/social';

export default {
  props: {
    item: Object,
    name: String,
    number: [String, Number],
    id: String,
    unHover: Boolean,
    unBackground: Boolean,
  },
  setup() {
    const socialStore = useSocialStore();
    const fluxesStore = useFluxesStore();
    return { socialStore, fluxesStore };
  },
  data() {
    return {
      reactHover: false,
      users: [],
      totalRecords: 0,
      // reactionUsersLoading: false,
    };
  },
  computed: {
    getBackgroundColor() {
      const _colors = {
        Like: 'linear-gradient(90deg, #4080FF 0%, rgba(64, 128, 255, 0.00) 100%)',
        Lovely:
          'linear-gradient(90deg, #F44336 0%, rgba(244, 67, 54, 0.00) 100%)',
        Angry:
          'linear-gradient(90deg, #FC6A00 33.97%, rgba(0, 0, 0, 0.00) 93.18%)',
        Funny:
          'linear-gradient(90deg, #CCC518 0%, rgba(204, 197, 24, 0.00) 100%)',
        Sad: 'linear-gradient(90deg, #363636 0%, rgba(54, 54, 54, 0.00) 100%)',
      };
      return 'linear-gradient(90deg, #363636 0%, rgba(54, 54, 54, 0.00) 100%)';
      // return colors[this.name];
    },
    getHoverNumberColor() {
      const _colors = {
        Like: '#3C75E7',
        Lovely:
          'linear-gradient(90deg, #F44336 0%, rgba(244, 67, 54, 0.00) 100%)',
        Angry: 'linear-gradient(180deg, #D13F2C 0%, #C74F4F 100%)',
        Funny: '#CCC518',
        Sad: '#363636',
      };
      return '#363636';
      // return colors[this.name];
    },
    getHoverNumberBackgroundColor() {
      const _colors = {
        Like: 'rgba(56, 106, 204, 0.60)',
        Lovely:
          'linear-gradient(180deg, rgba(248, 45, 45, 0.60) 0%, rgba(227, 57, 48, 0.60) 100%)',
        Angry:
          'linear-gradient(180deg, rgba(199, 79, 78, 0.60) 0%, rgba(209, 63, 44, 0.60) 100%)',
        Funny: 'rgba(141, 136, 17, 0.60)',
        Sad: 'rgba(54, 54, 54, 0.60)',
      };
      return this.number ? 'rgba(0, 0, 0, 0.60)' : 'rgba(54, 54, 54, 0.60)';
      // return colors[this.name] || "rgba(0, 0, 0, 0.60)";
    },
    getImg() {
      const imgs = {
        clap: Clap,
        love: Lovely,
        angry: Angry,
        funny: Funny,
        sad: Sad,
        Frame: Like,
      };
      return imgs[this.name];
    },
    getImgHover() {
      const imgs = {
        clap: ClapGif,
        love: LovelyGif,
        angry: AngryGif,
        funny: FunnyGif,
        sad: SadGif,
      };
      return imgs[this.name];
    },
    isHover() {
      return !this.unBackground;
    },
  },
  methods: {
    async getReactionUsers() {
      if (this.unHover) {
        return;
      }
      if (this.socialStore.reactionUsersLoading) {
        return;
      }

      try {
        this.socialStore.reactionUsersLoading = true;
        await sleep(300);

        const userList = await this.getReactionUserData();
        const userFilterList = userList.filter((user) =>
          !this.name ? true : user.type === this.name,
        );
        this.users = userFilterList.slice(0, _MAXREACTCOUNT);
        this.totalRecords = userFilterList.length;

        this.socialStore.reactionUsersLoading = false;
      } catch (error) {
        this.socialStore.reactionUsersLoading = false;
      }
    },
    async getReactionUserData() {
      if (this.item[_REACT_USERLIST_CACHE]) {
        return this.item[_REACT_USERLIST_CACHE];
      }

      return new Promise(async (resolve) => {
        try {
          const { data } = await this.fluxesStore.getSocialReactionList({
            id: this.id,
            reaction: undefined,
            type: 'post',
            sortDirection: this.socialStore.sortDirection,
            limit: 0,
          });
          this.item[_REACT_USERLIST_CACHE] = data || [];
          resolve(data);
        } catch (error) {
          resolve([]);
        }
      });
    },
    onMouseenter() {
      if (this.isHover) {
        this.reactHover = true;
        this.getReactionUsers();
      }
    },
    showReacPopup(isAll) {
      if (this.socialStore.reactionUsersLoading) {
        return;
      }
      this.socialStore.reactId = this.id;
      this.socialStore.reactIdType = isAll ? '' : this.name;
    },
  },
};
</script>
