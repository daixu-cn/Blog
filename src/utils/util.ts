/**
 * @description 获取静态资源地址
 * @param {string} fileName 文件名
 * @param {string} folder 文件夹
 * @return {string}
 */
export const getAssets = (fileName: string, folder = "image") => {
  return new URL(`../assets/${folder}/${fileName}`, import.meta.url).href
}
