import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

import ErrorBoundary from '@/views/errorBoundary.tsx'
/* eslint-disable react-refresh/only-export-components */
const Home = lazy(() => import('@/views/home'))
const Login = lazy(() => import('@/views/login'))
const ArticleDetail = lazy(() => import('@/views/articleDetail'))
const ArticleEditor = lazy(() => import('@/views/articleEditor'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorBoundary></ErrorBoundary>,
    children: [],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/articleDetail/:id',
    element: <ArticleDetail />,
  },
  {
    path: '/articleEditor',
    element: <ArticleEditor />,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]

export default routes
