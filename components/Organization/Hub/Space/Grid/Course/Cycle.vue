<template>
  <el-popover
    ref="cycle"
    trigger="click"
    :width="editable ? 208 : 240"
    placement="bottom-start"
    :disabled="cycles.length <= 1"
    :offset="5"
    :hide-after="0"
    :show-after="0"
    @show="open = true"
    @hide="open = false"
  >
    <template #reference>
      <div
        v-if="showLicenses || showCycles"
        class="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-black/80 px-2 text-xs shadow-md backdrop-blur"
        @click.stop
        @pointerdown.stop
        @pointerup.stop
      >
        <div
          v-if="showLicenses"
          class="flex items-center gap-1.5 py-1.5 text-[#E0B92C]"
        >
          <i class="fa-regular fa-file-certificate text-xs" />
          ✕
          {{ course.availableLicenses }}
        </div>
        <div v-if="showCycles" class="cursor-pointer py-1.5">
          <!-- 组织的 -->
          <template v-if="isOrg">
            <!-- 购物空间: TODO ??? -->
            <div v-if="isShopping" class="flex items-center gap-2">
              <div class="text-[#E0B92C]">Show Cycles</div>
              <i
                v-if="cycles.length > 1"
                class="fa-light fa-chevron-down text-[#E0B92C] transition-all"
                :class="open ? 'rotate-180' : ''"
              />
            </div>
            <!-- 其它空间 -->
            <div v-else class="flex items-center gap-2">
              <!-- 自己的 -->
              <template v-if="editable">
                <i class="fa-light fa-calendar-days" />
                <div>
                  {{ formatDate(cycles[0].dates.startDate) }} -
                  {{ formatDate(cycles[0].dates.endDate) }}
                </div>
                <i
                  v-if="cycles.length > 1"
                  class="fa-light fa-chevron-down transition-all"
                  :class="open ? 'rotate-180' : ''"
                />
              </template>
              <!-- 分配的 -->
              <template v-else>
                <div class="text-[#E0B92C]">Show Cycles</div>
                <i
                  v-if="cycles.length > 1"
                  class="fa-light fa-chevron-down text-[#E0B92C] transition-all"
                  :class="open ? 'rotate-180' : ''"
                />
              </template>
            </div>
          </template>
          <!-- 非组织的 -->
          <template v-else>
            <!-- 购物空间: TODO ??? -->
            <div v-if="isShopping" class="flex items-center gap-2">
              <i class="fa-light fa-calendar-days" />
              <div>
                {{ formatDate(cycles[0].dates.startDate) }} -
                {{ formatDate(cycles[0].dates.endDate) }}
              </div>
            </div>
            <!-- 其它空间 -->
            <div v-else class="flex items-center gap-2">
              <i class="fa-light fa-calendar-days" />
              <div>
                {{ formatDate(cycles[0].dates.startDate) }} -
                {{ formatDate(cycles[0].dates.endDate) }}
              </div>
              <i
                v-if="cycles.length > 1"
                class="fa-light fa-chevron-down transition-all"
                :class="open ? 'rotate-180' : ''"
              />
            </div>
          </template>
        </div>
      </div>
    </template>
    <div
      class="flex max-h-72 flex-col gap-0.5 overflow-y-auto px-0.5 py-1 text-xs"
    >
      <!-- 自己的 -->
      <template v-if="editable">
        <div
          v-for="item in cycles.slice(1)"
          :key="item.id"
          class="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-white/10"
        >
          <i class="fa-light fa-calendar-days" />
          {{ formatDate(item.dates.startDate) }} -
          {{ formatDate(item.dates.endDate) }}
        </div>
      </template>
      <!-- 分配/购买的: TODO???? -->
      <template v-else>
        <div
          v-for="item in cycles"
          :key="item.id"
          class="flex cursor-pointer items-center gap-2 rounded px-1 py-1 hover:bg-white/10"
        >
          <div class="flex items-center gap-1.5 text-[#E0B92C]">
            <i class="fa-regular fa-file-certificate text-xs" />
            ✕
            {{ course.availableLicenses }}
          </div>
          <i class="fa-light fa-calendar-days" />
          {{ formatDate(item.dates.startDate) }} -
          {{ formatDate(item.dates.endDate) }}
        </div>
      </template>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
    },
    editable: {
      type: Boolean,
    },
    isShopping: {
      type: Boolean,
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    isOrg() {
      return this.authStore.isOrg;
    },
    cycles() {
      return this.course.cycles || [];
    },
    showLicenses() {
      // 组织身份，且非自己的课程
      return this.course.availableLicenses && !this.editable && this.isOrg;
    },
    showCycles() {
      return this.cycles.length > 0;
    },
  },
};
</script>
