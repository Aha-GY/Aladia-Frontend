export async function compressImageIfPossible(file, options = {}) {
  const { default: Compressor } = await import('compressorjs');
  return new Promise((resolve) => {
    if (file.type.startsWith('image/')) {
      new Compressor(file, {
        quality: 0.8,
        convertSize: 512 * 1024,
        ...options,
        success(result) {
          const compressedFile = new File([result], file.name, {
            type: 'image/webp',
            lastModified: new Date().getTime(),
          });
          console.log(
            getFileSize(file.size),
            getFileSize(compressedFile.size),
            getFileSize(file.size - compressedFile.size),
            compressedFile.type,
          );
          resolve(compressedFile);
        },
        error(err) {
          console.error('Compression failed:', err.message);
          resolve(file);
        },
      });
    } else {
      resolve(file);
    }
  });
}
