export function getMediaUrl(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function () {
      resolve(this.result);
    };
  });
}
export function getImageDimensions(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = function () {
      resolve({ width: img.width, height: img.height });
    };
    img.src = URL.createObjectURL(file);
  });
}
export function getVideoDimensions(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = function () {
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };
    video.src = URL.createObjectURL(file);
  });
}

export async function generateGifFile(gif) {
  try {
    const response = await fetch(gif.images.fixed_height.url);
    const blob = await response.blob();
    const file = new File([blob], `${gif.title}.gif`, { type: 'image/gif' });
    file.src = URL.createObjectURL(file);
    file.dimensions = {
      width: parseInt(gif.images.fixed_height.width),
      height: parseInt(gif.images.fixed_height.height),
    };
    return file;
  } catch (error) {
    console.error(error);
  }
}
