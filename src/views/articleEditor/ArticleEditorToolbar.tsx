import { createStyles } from 'antd-style'

import { IconFont } from '@/conf'
import { useThemeState } from '@/store'

const ArticleEditorToolbar: React.FC = () => {
  const { cx, styles } = useArticleEditorToolbarStyles()
  const { isDarkMode, setTheme } = useThemeState()
  /**
   * 切换主题
   * @param isDark 是否为黑暗主题
   */
  const handleSwitchTheme = (isDark: boolean) => {
    setTheme(isDark)
  }
  return (
    <div className={cx('article-editor-toolbar', styles.articleEditorToolbarWrapper)}>
      {/* dark & ligth switch button */}
      <span className={`${styles.articleEditorToolbarWrapper}-item`} onClick={() => handleSwitchTheme(!isDarkMode)}>
        <IconFont type={isDarkMode ? 'icon-moon' : 'icon-sun'} style={{ fontSize: '14px' }} />
      </span>
    </div>
  )
}

export default ArticleEditorToolbar

const useArticleEditorToolbarStyles = createStyles(({ css, token }) => ({
  articleEditorToolbarWrapper: css`
    width: 100%;
    height: 30px;
    line-height: 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-end;
    background-color: ${token.colorBgContainer};
    align-items: center;
    padding: 0 25px;
    box-shadow:
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02);
    position: fixed;
    top: 0;
    &-item {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
      color: ${token.colorText};
      cursor: pointer;
      &:hover {
        background-color: ${token.colorBgBlur};
      }
    }
  `,
}))
