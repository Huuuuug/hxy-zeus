import hljs from 'highlight.js'
import katex from 'katex'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import 'katex/dist/katex.min.css'

import { randomInt } from './utils'

import type { RendererObject } from 'marked'
import type { SynchronousOptions } from 'marked-highlight'

//#region ----------------------------------------< markedjs 配置 >--------------------------------------

/**
 * markedjs 配置
 */
marked.use({
  async: true,
  pedantic: false, // 只解析符合Markdown定义的，不修正Markdown的错误
  gfm: true, // 启动类似Github样式的Markdown,
  breaks: false, // 支持Github换行符，必须打开gfm选项
})

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

marked.use(markedHighlight(hljsConfig))

//#endregion

//#region ----------------------------------------< renderer >--------------------------------------

/**
 * 标记标识
 */
export const grammar = '##'
/** 匹配一个 $ 符, 来自于 markedjs 的官方例子 */
export const singleDollar = /^\$+([^$\n]+?)\$+/
export const doubleDollar = /(?<=\$\$).*?(?=\$\$)/
export const doubleWell = /(?<=##).*?(?=##)/

/**
 * 标题解析为 TOC 集合, 增加锚点跳转
 * @param text  标题内容
 * @param level 标题级别
 */
export const renderHeading = (text: any, level: number) => {
  const realLevel = level
  return `<h${realLevel} id="${realLevel}-${text}">${text}</h${realLevel}>`
}

/**
 * 表格 header/body
 */
export const renderTable = (header: string, body: string) => {
  const arr = header.match(doubleWell)
  const isContainer: boolean = arr != null && arr[0] === 'container'
  if (isContainer) {
    return `<table class="bl-table-container"><thead>${header}</thead><tbody>${body}</tbody></table>`
  }
  return `<table><thead>${header}</thead><tbody>${body}</tbody></table>`
}
/**
 * 自定义代码块内容解析
 * @param code 解析后的HTML代码
 * @param language 语言
 * @returns
 */
export const renderCode = (code: string, language: string | undefined): string => {
  const id = 'pre-' + Date.now() + '-' + randomInt(1, 1000000)

  return `<pre><div class="code-toolbar"><span>${language}</span><span class="pre-copy" onclick="onHtmlEventDispatch(this,'click',event,'copyPreCode','${id}')">复制代码</span></div><code id="${id}" class="hljs language-${language}">${code}</code></pre>`
}

/**
 * 单行代码块的解析拓展
 * 1. katex `$内部写表达式$`
 * @param src
 * @returns
 */
export const renderCodespan = (src: string) => {
  const arr = src.match(singleDollar)
  if (arr != null && arr.length > 0) {
    try {
      return katex.renderToString(arr[1], {
        throwOnError: true,
        output: 'html',
      })
    } catch (error) {
      console.error(error)
      return `<div class='bl-preview-analysis-fail-inline'>
          Katex 语法解析失败! 你可以尝试前往<a href='https://katex.org/#demo' target='_blank'> Katex 官网</a> 来校验你的公式。
          </div>`
    }
  }
  return `<code>${src}</code>`
}

/**
 * 引用扩展，为引用指定颜色
 * @param quote 引用内部文字的内容
 */
export const renderBlockquote = (quote: string) => {
  let finalQuote = quote
  let clazz = 'zeus-blockquote-'
  const colors = ['green', 'yellow', 'red', 'blue', 'purple', 'black']
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i]
    const target = `<p>${grammar}${color}${grammar}`
    if (quote.startsWith(target)) {
      clazz = 'zeus-blockquote-' + color
      finalQuote = quote.replaceAll(target, '<p>')
      break
    }
  }

  /**
   * 支持了新的语义化引用
   *
   * https://github.com/orgs/community/discussions/16925#discussioncomment-3192118
   * https://learn.microsoft.com/en-us/contribute/content/markdown-reference#alerts-note-tip-important-caution-warning
   */
  if (quote.startsWith('<p>[!NOTE]')) {
    clazz = 'zeus-blockquote-blue'
    finalQuote = quote.replaceAll('<p>[!NOTE]', '<p>')
  } else if (quote.startsWith('<p>[!TIP]')) {
    clazz = 'zeus-blockquote-blue'
    finalQuote = quote.replaceAll('<p>[!TIP]', '<p>')
  } else if (quote.startsWith('<p>[!IMPORTANT]')) {
    clazz = 'zeus-blockquote-purple'
    finalQuote = quote.replaceAll('<p>[!IMPORTANT]', '<p>')
  } else if (quote.startsWith('<p>[!WARNING]')) {
    clazz = 'zeus-blockquote-yellow'
    finalQuote = quote.replaceAll('<p>[!WARNING]', '<p>')
  } else if (quote.startsWith('<p>[!CAUTION]')) {
    clazz = 'zeus-blockquote-red'
    finalQuote = quote.replaceAll('<p>[!CAUTION]', '<p>')
  }
  return `<blockquote class="${clazz}">${finalQuote}</blockquote>`
}

/**
 * 自定义渲染
 */
const renderer: RendererObject = {
  code(code: string, infostring: string | undefined): string {
    return renderCode(code, infostring)
  },
  blockquote(quote: string): string {
    return renderBlockquote(quote)
  },
}

marked.use({ renderer })
//#endregion

export default marked
