export function getFileSrcById(fileId) {
  return process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + fileId;
}
