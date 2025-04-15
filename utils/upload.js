import axios from 'axios';

import { createUploadUrl } from '~/api/v2/storage';

async function performUpload({ file, useGlobalBucket, onProgress }) {
  const processedFile = file;
  const { fileId, url } = await createUploadUrl({
    params: useGlobalBucket
      ? {
          'use-global-bucket': true,
        }
      : undefined,
  });

  await axios.put(url, processedFile, {
    headers: {
      'Content-Type': processedFile.type,
    },
    onUploadProgress: (event) => {
      const progress = Math.round((event.loaded / event.total) * 90);
      onProgress(progress, file);
    },
  });

  onProgress(100, file);
  return { fileId, file: processedFile };
}

export async function upload({
  file,
  useGlobalBucket = false,
  onProgress = () => {},
}) {
  let timer = null;
  let progress = 0;

  function simulateProgress() {
    if (progress >= 100) {
      return;
    }
    progress += 1;
    onProgress(progress, file);
    timer = setTimeout(simulateProgress, 1000);
  }

  simulateProgress();

  try {
    const result = await performUpload({
      file,
      useGlobalBucket,
      onProgress: (newProgress, file) => {
        clearTimeout(timer);
        progress = newProgress;
        onProgress(progress, file);
        if (progress < 100) {
          simulateProgress();
        }
      },
    });

    clearTimeout(timer);
    return result;
  } catch (error) {
    onProgress(0, file);
    clearTimeout(timer);
    throw error;
  }
}

// 上传多个文件
// 参数 files 是数组，包含多个文件项
// 如果文件项是 Blob URL，则先转换为 File 对象
export async function uploadMultiple(files) {
  if (!Array.isArray(files)) {
    files = [files];
  }
  const promises = files.map(async (file) => {
    if (file.startsWith('blob:')) {
      return await _blobUrlToFile(file); // Convert blob URL to a file
    }
    return file;
  });

  // Log files before uploading
  const processedFiles = await Promise.all(promises);

  // Upload files and capture results
  const uploadPromises = processedFiles.map((file) =>
    upload({ file }).then(
      (result) => result,
      (error) => {
        throw error; // Optionally rethrow to handle failure
      },
    ),
  );

  return Promise.all(uploadPromises);
}

// 把浏览器生成的 Blob URL 转换为 File 对象
// Blob URL 示例: blob:http://example.com/d3140583-00e1-48f6-b38b-4c1d0dc8833c
async function _blobUrlToFile(blobUrl) {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    // 从 Blob URL 中获取文件类型，如果无法获取则默认为 application/octet-stream
    const type = blob.type || 'application/octet-stream';

    // 从 Blob URL 中取出结尾的随机字符串
    const key = blobUrl.split('/').pop();
    // 通过文件类型获取文件扩展名
    const ext = (blob.type || '').split('/').pop();
    // 生成文件名
    const fileName = [key, ext].filter(Boolean).join('.');

    const file = new File([blob], fileName, { type });
    // console.log('blobUrl:', blobUrl);
    // console.log('file:', file);
    return file;
  } catch (error) {
    throw new Error(
      `Failed to convert Blob URL to a File object: ${error.message}`,
    );
  }
}
