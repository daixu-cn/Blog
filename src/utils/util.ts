/**
 * @description 获取静态资源地址
 * @param {string} fileName 文件名
 * @param {string} folder 文件夹
 * @return {string}
 */
export const getAssets = (fileName: string, folder = "image") => {
  return new URL(`../assets/${folder}/${fileName}`, import.meta.url).href
}

/**
 * @description 获取两个数之间的随机整数（包含最大值和最小值）
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number}
 */
export const getRandomIntInclusive = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @description 获取两个数之间的随机数【min<= r < max】
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @return {number}
 */
function getRandomDouble(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min
}
