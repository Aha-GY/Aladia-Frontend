<template>
  <div
    ref="cardContainer"
    class="relative"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 动态渲染卡片 -->
    <div
      v-for="(card, index) in props.cards"
      :key="index"
      class="absolute bottom-0 left-0 h-full w-full shadow-lg transition-all duration-500 ease-in-out"
      :style="getCardStyle(index)"
    >
      <img :src="card" class="h-full w-full rounded" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
});

// 定义鼠标悬停状态
const isHovered = ref(false);

// 根据卡片索引计算样式
const getCardStyle = (index) => {
  const totalCards = props.cards.length;
  const maxRotation = 25; // 最大旋转角度
  const maxTranslation = 0; // 最大平移距离

  // 计算每张卡片的旋转角度和平移距离
  const rotation = isHovered.value
    ? -((index - (totalCards - 1) / 2) * maxRotation) / (totalCards - 1) // 往上旋转
    : 0;
  const translation = isHovered.value
    ? ((index - (totalCards - 1) / 2) * maxTranslation) / (totalCards - 1)
    : 0;

  return {
    transform: `rotate(${rotation}deg) translate(${translation}px, ${-translation}px)`,
    transformOrigin: 'left bottom', // 以左下角为圆点
    zIndex: isHovered.value ? totalCards + index : index + 1,
  };
};
</script>
