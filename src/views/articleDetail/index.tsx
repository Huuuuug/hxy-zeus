import React, { useEffect, useRef, useState } from 'react'

import Toolbar from '@/components/toolbar'

import marked from '@/utils/markedjs'

import { useDetailStyles } from './style'

import { api } from '@/apis'

// interface Article {
//   id: number
//   title: string
//   content: string
//   img?: string
//   create_time: string
//   update_time: string
// }

// 测试数据
const test = `
  # 自定义代码块样式，基于marked与自定义指令动态增加语言显示与copy功能 \n
  ## 需求 \n
  在开发一个基于大模型的QA系统时，由于在回答编程相关问题时，模型会输出使用markdown形式表示的代码代码，如下图所示，不利于查看，故借助Marked.js将markdown形式的字符串转换为html形式，由于是需要实时渲染故选择marked.js,可以达到极致的轻量化，相对于mavon-editor（包太大），vue-marked（功能少）来说更加适合本项目。
  > ##green##
  > 一个功能齐全的markdown解析器和编译器，用JavaScript编写。 专为速度而设计。

  ## 单行代码 \n
  \` code \`
  ## 代码块 \n
  \`\`\`javascript
  /**
  * highlight 配置
  */
  const hljsConfig: SynchronousOptions = {
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }
  \`\`\`
  ## 代码块 \n
  \`\`\`javascript
  /**
  * highlight 配置
  */
  const hljsConfig: SynchronousOptions = {
    langPrefix: 'hljs language-',
    highlight(code: string, lang: string) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }
  \`\`\`
`

const ArticleDeatil: React.FC = () => {
  const { cx, styles } = useDetailStyles()

  const [parsedArticleDetail, setParsedArticleDetail] = useState<string>('')

  const ref = useRef(null)

  const getArticleDetail = async () => {
    const [_, res] = await api.getArticle({ page: 1, per_page: 10 })
    if (!_ && res) {
      const parseHtml = await marked.parse(test)
      setParsedArticleDetail(parseHtml)
    }
  }

  useEffect(() => {
    ;(async () => {
      await getArticleDetail()
    })()
  }, [])

  return (
    <div className={cx('detail-wrapper', styles.detailWrapper)}>
      <Toolbar />
      <div
        ref={ref}
        className={cx('zeus-preview', styles.detailConatiner)}
        dangerouslySetInnerHTML={{ __html: parsedArticleDetail }}
      ></div>
    </div>
  )
}

export default ArticleDeatil
