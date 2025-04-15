// 轮播图的媒体项
// 目前用于全屏预览组件，后续会把 Post 内的附件轮播数据也转换过来
interface MediaItem {
  type: 'image' | 'video' | 'loom' | 'location';
  fileId?: string; // loom 和 location 没有 fileId
  url?: string; // location 没有 url
  location?: Location; // 仅 location 有
}

interface AttachmentFile {
  fileId: string;
  metadata: {
    mimetype: string; // 文件类型, e.g. 'image/jpeg', 'video/mp4'
    size: number; // 文件体积，单位：字节
    name: string; // 原始文件名
    videoDuration?: number; // 可选字段，仅视频文件包含
  };
  url: string;
}

type LoomURL = string;

interface Location {
  latitude: string;
  longitude: string;
  name: string;
  city: string;
  country: string;
  displayMap: boolean;
}

export function fileToMediaItem(file: AttachmentFile): MediaItem {
  return {
    type: file.metadata.mimetype.split('/')[0] as 'image' | 'video',
    ...file,
  };
}

export function loomToMediaItem(loomUrl: LoomURL): MediaItem {
  return {
    type: 'loom',
    url: loomUrl,
  };
}

export function locationToMediaItem(location: Location): MediaItem {
  return {
    type: 'location',
    ...location,
  };
}
