export const saveBlobToFile = (blob: Blob, filename: string) => {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};

export const arrayBufferToFile = (buffer: ArrayBuffer, filename: string) => {
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const file = new File([blob], filename);
  return file;
};
