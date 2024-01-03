import React from 'react'
import { useNavigate } from 'react-router-dom'

import { GithubOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { useTopNavigationStyles } from '@/components/toolbar/style'

import AccountPopover from './components/accountPopover'

import { ACCOUNT_POPOVER_LIST, IconFont } from '@/conf/'
import { useThemeState } from '@/store'

const Toolbar: React.FC = () => {
  const { styles, cx } = useTopNavigationStyles()
  const { isDarkMode, setTheme } = useThemeState()
  const navigate = useNavigate()

  const handleGithubIconClick = () => {
    window.open('https://github.com/Huuuuug')
  }
  /**
   * 切换主题
   * @param isDark 是否为黑暗主题
   */
  const handleSwitchTheme = (isDark: boolean) => {
    setTheme(isDark)
  }
  /**
   * 跳转文章编辑界面
   */
  const handleSubmitClick = () => {
    navigate('/articleEditor')
  }

  return (
    <nav className={cx('toolbar', styles.toolbar)}>
      <div
        className={styles.toolbarLeft}
        onClick={() => {
          navigate('/')
        }}
      >
        Huuuuug
      </div>
      <div className={styles.toolbarMiddle}>toolbar Search</div>
      <div className={styles.toolbarRight}>
        {/*account avatar*/}
        <AccountPopover list={ACCOUNT_POPOVER_LIST} />
        {/* github icon */}
        <span className={`${styles.toolbarRight}-item`} onClick={handleGithubIconClick}>
          <GithubOutlined style={{ fontSize: '16px' }} />
        </span>
        {/* dark & ligth switch button */}
        <span className={`${styles.toolbarRight}-item`} onClick={() => handleSwitchTheme(!isDarkMode)}>
          <IconFont type={isDarkMode ? 'icon-moon' : 'icon-sun'} style={{ fontSize: '18px' }} />
        </span>
        {/* bell icon */}
        <span className={`${styles.toolbarRight}-item`} onClick={() => handleSwitchTheme(!isDarkMode)}>
          <IconFont type="icon-lingdang" style={{ fontSize: '18px' }} />
        </span>
        {/* release article button */}
        <Button
          type="primary"
          shape="round"
          icon={<PlusCircleOutlined />}
          style={{
            boxShadow: 'none',
          }}
          onClick={handleSubmitClick}
        >
          发布
        </Button>
      </div>
    </nav>
  )
}

export default Toolbar
