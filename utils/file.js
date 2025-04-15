// "File" here refers to attachments of a post, such as PDF files, etc.
// 文件是指帖子的附件，比如 pdf 文件等

import { filesize } from 'filesize';

import { icons } from '~/constant/files';

// 把文件字节大小转换为人类可读的格式
// TODO: 有很多重复的 formatFileSize() 函数（注意函数名是以 format- 开头），需要统一为以下实现
// TODO: getFileSize() 这个名字有歧义，需要改为 formatFileSize()
export function getFileSize(size) {
  return filesize(size, { base: 10, standard: 'jedec', round: 2 });
}

// 根据文件名获取文件类型（实际上返回的是 Font Awesome 的图标类名）
// TODO: 有很多重复的 getFileType() 函数，需要统一为以下实现
export function getFileType(url = '') {
  const type = url.split('.').pop().toLowerCase();
  return icons[type] || 'fa-file-image';
}

// 下载文件（注意它的参数是一个文件对象）
// TODO: 有很多重复的 onDownloadFile() 函数，需要统一为以下实现
export async function downloadFile(file) {
  const blob = await (await fetch(file.url)).blob();
  const url = URL.createObjectURL(blob);
  download(url, file.name);
  URL.revokeObjectURL(url);
}

// 下载文件（注意它的参数，与上面的 downloadFile() 函数不同）
export function download(url, name) {
  const elink = document.createElement('a');
  elink.style.display = 'none';
  elink.href = url;
  elink.download = name;
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
}
