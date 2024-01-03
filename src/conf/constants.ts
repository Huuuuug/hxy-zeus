export const ICONFONT_URL = '//at.alicdn.com/t/c/font_4387724_yli2rb6i82q.js'
import { createFromIconfontCN } from '@ant-design/icons'
export interface AccountPopoverList {
  key: string
  label: string
  icon?: any
  needSeparate?: boolean
}

export const ACCOUNT_POPOVER_LIST: AccountPopoverList[] = [
  {
    key: 'information',
    label: '个人信息',
    needSeparate: false,
  },
  {
    key: 'self_articles',
    label: '我的文章',
    needSeparate: false,
  },
  {
    key: 'exit',
    label: '退出',
    needSeparate: true,
  },
]

export const IconFont = createFromIconfontCN({
  scriptUrl: ICONFONT_URL,
})
