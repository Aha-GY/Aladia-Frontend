<template>
  <div
    class="__story-image flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-5"
    :style="{
      backgroundImage: backgroundGradient || 'rgba(255,255,255,0.1)',
    }"
  >
    <img
      v-if="imageSrc"
      ref="image"
      :src="imageSrc"
      alt="background"
      crossorigin="anonymous"
      class="h-full w-full object-contain transition-all duration-300"
      @load="extractBackgroundColor"
    />

    <slot />
  </div>
</template>

<script setup>
defineProps({
  imageSrc: {
    type: String,
    required: true,
  },
  isPreviewActive: {
    type: Boolean,
    default: false,
  },
});

const backgroundGradient = ref(null);
const image = ref(null);

const extractBackgroundColor = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (image.value) {
    canvas.width = image.value.width;
    canvas.height = image.value.height;

    // Draw image to canvas
    ctx.drawImage(image.value, 0, 0, canvas.width, canvas.height);

    // Get image data
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Compute average color
    let r = 0,
      g = 0,
      b = 0,
      count = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    // Average the colors
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    // Generate gradient colors
    const mainColor = `rgb(${r}, ${g}, ${b})`;
    const lighterColor = `rgba(${Math.min(r + 50, 255)}, ${Math.min(g + 50, 255)}, ${Math.min(b + 50, 255)}, 0.6)`;

    backgroundGradient.value = `linear-gradient(135deg, ${mainColor}, ${lighterColor})`;
  }
};
</script>
