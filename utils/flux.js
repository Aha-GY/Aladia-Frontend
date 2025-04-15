// "Flux" refers to the creation or editing flow of Story/Reel/Highlight in this repo
// Flux 在本仓库中特指 Story/Reel/Highlight 的创建或编辑流程

import * as _ from 'lodash';

// 把 imageState 中的 Blob URL 处理为一个映射表，以便后端处理
// 返回一个对象，key 是 Blob URL，value 是 fileId
export async function generateMapFromImageState(imageState) {
  const blobUrls = _extractBlobUrls(imageState);
  const emojiUrls = _extractEmojiUrls(imageState);
  const nuxtAssetUrls = _extractNuxtAssetUrls(imageState);

  // Convert emoji URLs to blobs
  const emojiBlobs = await _convertEmojiUrlsToBlobs(emojiUrls);
  // Convert Nuxt asset URLs to blobs
  const nuxtAssetBlobs = await _convertNuxtAssetUrlsToBlobs(nuxtAssetUrls);

  // Create object URLs for emoji and Nuxt asset blobs
  const emojiBlobUrls = emojiBlobs.map((blob) => URL.createObjectURL(blob));
  const nuxtAssetBlobUrls = nuxtAssetBlobs.map((blob) =>
    URL.createObjectURL(blob),
  );

  // Map each emoji Blob URL to its original Data URL
  const emojiUrlMap = _.zipObject(emojiBlobUrls, emojiUrls);
  // Map each Nuxt asset Blob URL to its original URL
  const nuxtAssetUrlMap = _.zipObject(nuxtAssetBlobUrls, nuxtAssetUrls);

  // Combine all URLs (blob, emoji, and Nuxt assets)
  const allBlobUrls = [...blobUrls, ...emojiBlobUrls, ...nuxtAssetBlobUrls];
  const uploadedFiles = await uploadMultiple(allBlobUrls);

  // Create a map using the original backgroundImage values as keys
  const fileIdMap = {};
  uploadedFiles.forEach((file, index) => {
    const originalUrl = allBlobUrls[index];

    // Replace blob URLs with original URLs
    const key =
      emojiUrlMap[originalUrl] || nuxtAssetUrlMap[originalUrl] || originalUrl;

    fileIdMap[key] = file.fileId;
  });

  return fileIdMap;
}

function _extractBlobUrls(imageState) {
  return (
    imageState?.annotation
      ?.filter((item) => item.backgroundImage?.startsWith('blob:'))
      .map((item) => item.backgroundImage) || []
  );
}

function _extractEmojiUrls(imageState) {
  return (
    imageState?.annotation
      ?.filter((item) => item.backgroundImage?.startsWith('data:image/svg+xml'))
      .map((item) => item.backgroundImage) || []
  );
}

async function _convertEmojiUrlsToBlobs(emojiUrls) {
  return Promise.all(
    emojiUrls.map(async (dataUrl) => {
      const response = await fetch(dataUrl);
      return await response.blob();
    }),
  );
}

async function _convertNuxtAssetUrlsToBlobs(nuxtAssetUrls) {
  return Promise.all(
    nuxtAssetUrls.map(async (url) => {
      const response = await fetch(url);
      return await response.blob();
    }),
  );
}

function _extractNuxtAssetUrls(imageState) {
  return (
    imageState?.annotation
      ?.map((item) => {
        const url = item.backgroundImage;
        if (!url) {
          return null;
        }

        // Check for both local and full URLs
        if (url.startsWith('/_nuxt/assets/icons/') || url.includes('/_nuxt/')) {
          return url;
        }

        return null;
      })
      .filter(Boolean) || []
  );
}
