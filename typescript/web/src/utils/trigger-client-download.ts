export const triggerClientDownload = (fileData: Blob, fileName: string) => {
  const element = document.createElement("a");
  element.href = window.URL.createObjectURL(fileData);
  element.download = fileName;
  element.click();
};
