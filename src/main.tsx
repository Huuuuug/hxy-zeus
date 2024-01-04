import ReactDOM from 'react-dom/client'

import { onHtmlEventDispatch } from '@/utils/utils'

import 'highlight.js/styles/github-dark.css'
import '@/assets/styles/theme.css'
import '@/assets/styles/zeus-preview.css'

import './index.scss'
import App from '@/app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<App />)

// 挂载全局事件
window.onHtmlEventDispatch = onHtmlEventDispatch
