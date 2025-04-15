<template>
  <div
    class="group relative z-10 flex h-6 w-6 cursor-pointer items-center justify-center rounded shadow-[2px_4px_4px_rgba(0,0,0,0.4)] transition-all duration-300"
    @mouseenter="onMouseenter"
    @mouseleave="isHover && (reactHover = false)"
  >
    <img
      v-if="name"
      :src="reactHover ? getImgHover : getImg"
      class="h-4 w-4 cursor-pointer transition-all duration-300"
      :class="reactHover ? 'h-5 w-5 -translate-y-1 scale-[1.4]' : ''"
      :data-cy="`${dataCy}-emoji`"
      @click="!unHover && showReacPopup()"
    />
    <div
      v-if="!name"
      class="text-sm text-[#B0B0B0] underline-offset-2 hover:underline"
    >
      <span :data-cy="`${dataCy}-total-count`" @click="showReacPopup(true)">
        {{ numberFormat }}
      </span>
    </div>
    <div
      v-if="!unHover"
      class="absolute bottom-[1.375rem] left-1/2 max-h-0 -translate-x-1/2 cursor-pointer overflow-hidden text-xs opacity-100 transition-all duration-300 group-hover:max-h-[11rem] group-hover:opacity-100"
      :class="socialStore.reactionUsersLoading ? '' : 'w-[13.5rem]'"
      data-cy="f9d26e3f11c99418"
      @click="showReacPopup"
    >
      <div
        v-if="socialStore.reactionUsersLoading"
        class="mb-2 rounded-5 border-[1px] border-[white]/[0.1] bg-[#060606] p-2"
      >
        <i class="fa-solid fa-spinner animate-spin text-xs" />
      </div>
      <div
        v-else
        class="mb-2 rounded-5 border-[1px] border-[white]/[0.1] bg-[#060606] p-1"
      >
        <div
          v-for="user in users"
          :key="user.id"
          class="group/item rounded-xs relative flex cursor-pointer items-center gap-2 rounded-5 p-1 transition-all hover:bg-white/10"
          @click="handleUserClick(user?.owner)"
        >
          <div class="flex flex-1 items-center gap-2 truncate">
            <BaseAvatarNext
              :show-online="false"
              :picture="user.owner.picture"
              size="sm"
            />
            <div
              class="flex flex-1 items-center justify-between gap-2 truncate"
            >
              <div class="flex flex-1 flex-col truncate">
                <div
                  class="truncate text-sm leading-none text-white/60 hover:underline hover:underline-offset-2"
                  data-cy="c81d8308c233a3e0"
                  @click.stop="visit(user.userProfile)"
                >
                  {{ user.owner?.name }}
                </div>
                <div class="text-xs text-white/30">
                  <i class="fa-sharp fa-thin fa-check-double text-10" />
                  {{ seenTimeFormat(user.updatedAt) }}
                </div>
              </div>

              <BaseReactionItem
                v-if="user.type || user?.reaction"
                :name="user.type || user?.reaction"
                :is-image="true"
                :size="4"
              />
            </div>
          </div>
        </div>
        <div
          v-if="userTypeData.length > users.length"
          class="underline-offset-2 transition-all hover:underline active:scale-95"
          @click="showReacPopup"
        >
          {{
            $t('post.record.more', {
              record: userTypeData.length - users.length,
            })
          }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AngryGif from '~/assets/social/react/Angry.gif';
import Angry from '~/assets/social/react/Angry.svg';
import ClapGif from '~/assets/social/react/Clap.gif';
import Clap from '~/assets/social/react/Clap.svg';
import Frame from '~/assets/social/react/Frame.svg';
import FunnyGif from '~/assets/social/react/Funny.gif';
import Funny from '~/assets/social/react/Funny.svg';
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
    dataCy: {
      type: String,
      default: 'default',
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    return { socialStore, profileStore };
  },
  data() {
    return {
      reactHover: false,
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
    },
    getImg() {
      const imgs = {
        clap: Clap,
        love: Lovely,
        angry: Angry,
        funny: Funny,
        sad: Sad,
        Frame,
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
    userData() {
      return this.item[_REACT_USERLIST_CACHE] || [];
    },
    userTypeData() {
      return (
        this.userData.filter((user) =>
          !this.name ? true : user.reaction === this.name,
        ) || []
      );
    },
    users() {
      return this.userTypeData.slice(0, _MAXREACTCOUNT);
    },
    numberFormat() {
      const number = ~~this.number;
      if (number > 999) {
        return `${(number / 1000).toFixed(1)}k`;
      } else {
        return number;
      }
    },
  },
  methods: {
    onMouseenter() {
      if (this.isHover) {
        this.reactHover = true;
        this.$emit('reactHover');
      }
    },
    showReacPopup(isAll) {
      this.socialStore.reactId = this.id;
      this.socialStore.reactIdType = isAll ? '' : this.name;
    },
    handleUserClick(item) {
      event.stopPropagation();
      this.socialStore.reactId = null;
      this.socialStore.reactIdType = '';
      this.profileStore.gotoProfilePage(item);
    },
  },
};
</script>
