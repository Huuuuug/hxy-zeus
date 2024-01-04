import { Local } from './storage'
/**
 * 获取主题
 * @returns 从localStroage获取主题
 */
export const getTheme = () => {
  return Local.get('theme')
}

/**
 * 设置主题
 * @param isThemeDark 主题模式 true为夜间模式，false为日间模式
 */
export const changeTheme = async (isThemeDark?: boolean) => {
  const htmlDom = document.getElementsByTagName('html')[0]
  const theme =
    isThemeDark === undefined
      ? (getTheme() as unknown as { state: { isDarkMode: boolean } }).state.isDarkMode
      : isThemeDark
  htmlDom.setAttribute('class', theme ? 'dark' : 'light')
}

/**
 * 初始化主题
 */
export const initTheme = () => {
  changeTheme()
}

initTheme()
