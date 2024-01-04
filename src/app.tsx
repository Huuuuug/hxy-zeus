import React from 'react'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'

import { ConfigProvider } from 'antd'

import router from './router'

import { useThemeState } from '@/store'

const App: React.FC = () => {
  const { isDarkMode } = useThemeState()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#722ED1',
          colorBgContainer: isDarkMode ? '#232324' : '#ffffff',
          colorBgBase: isDarkMode ? '#000000' : '#f2f3f5',
          colorText: isDarkMode ? '#ffffff' : '#232324',
          colorBgBlur: isDarkMode ? '#722ED1' : '#eeeeee',
        },
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router}></RouterProvider>
      </Suspense>
    </ConfigProvider>
  )
}

export default App
