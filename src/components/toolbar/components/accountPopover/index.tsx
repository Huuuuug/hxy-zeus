import React from 'react'

import { Popover, Avatar, Divider } from 'antd'

import { useAccountPopoverStyles } from './style'

import { AccountPopoverList } from '@/conf/constants'
import { useAccountStore } from '@/store'

export interface AccountPopoverProps {
  list: AccountPopoverList[]
}

const AccountPopover: React.FC<AccountPopoverProps> = ({ list }) => {
  const { username, signOut } = useAccountStore()
  const { styles } = useAccountPopoverStyles()

  const handleExitCLick = async () => {
    await signOut()
  }

  const sliceAccountName = username.charAt(0)
  return (
    <Popover
      title={
        <>
          <div className={styles.popoverHeader}>{username}</div>
          <Divider />
        </>
      }
      content={
        <ul className={styles.popoverContainer}>
          {list.map(({ key, label }) =>
            key === 'exit' ? (
              <li key={key} onClick={handleExitCLick}>
                {label}
              </li>
            ) : (
              <li key={key}>{label}</li>
            ),
          )}
        </ul>
      }
    >
      <Avatar style={{ backgroundColor: '#722ED1', verticalAlign: 'middle' }}>{sliceAccountName}</Avatar>
    </Popover>
  )
}

export default AccountPopover
