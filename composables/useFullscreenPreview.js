/*
Purpose: Control the behavior and data of the `FullscreenPreview` component
用途：控制全屏预览组件的行为和数据

使用说明：
- 调用 open() 方法，传入参数：(1) 媒体列表，(2) 需要定位到的 fileId（不传则默认定位到第一项）。
- “媒体列表” 的类型定义参见 `utils/formatter.ts` 文件。
*/

import { loomToMediaItem, fileToMediaItem } from '@/utils/formatter';

const $mediaList = ref([]);
const $shouldOpen = ref(false);
const $activeIndex = ref(0);

export function useFullscreenPreview() {
  // 只在客户端执行
  if (!import.meta.client) {
    return;
  }

  const open = (mediaList, activeFileId = '') => {
    $mediaList.value = mediaList;
    $activeIndex.value = getActiveIndex(activeFileId);
    $shouldOpen.value = true;
  };

  const close = () => {
    $shouldOpen.value = false;
    $mediaList.value = [];
    $activeIndex.value = 0;
  };

  // utils
  function getActiveIndex(fileId) {
    return $mediaList.value.findIndex((item) => item.fileId === fileId);
  }

  // formatter
  function post2MediaList(post) {
    // 从 post.files 中提取出图片、视频
    const mediaList = (post.files || [])
      .filter((file) =>
        ['image/', 'video/'].some((type) =>
          file?.metadata?.mimetype?.includes(type),
        ),
      )
      .map(fileToMediaItem);

    // 从 post.loomUrls 中提取出 loom
    const looms = (post.loomUrls || []).map(loomToMediaItem);

    return [...mediaList, ...looms];
  }

  const exports = {
    $shouldOpen,
    $mediaList,
    $activeIndex,
    open,
    close,
    post2MediaList,
  };
  // debug
  window.__fullscreenPreview = exports;

  return exports;
}
