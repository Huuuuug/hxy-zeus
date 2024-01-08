import { useEffect, useRef, useState } from 'react'

import { createStyles } from 'antd-style'

import { CodeMirror } from '@/utils/codemirror'
import type { TitleType } from '@/utils/codemirror'
import marked from '@/utils/markedjs'
import { renderBlockquote, renderCode, renderCodespan, renderHeading } from '@/utils/markedjs'

import ArticleEditorToolbar from './ArticleEditorToolbar'
import EditorTool from './EditorTool'
import Toc from './Toc'

import type { ArticleToc } from './type'
import type { RendererObject } from 'marked'

import { useResize } from '@/hooks/useResize'
import { debounce } from '@/utils'

let cm: CodeMirror
let previewFullScreen = false // 是否全屏展开预览
let editorFullScreen = false // 是否全屏展开编辑

const ArticleEditor: React.FC = () => {
  const { cx, styles } = useArticleEditorStyles()
  // 编辑框dom实例
  const editorRef = useRef<HTMLDivElement>(null)
  // 编辑框和预览框之间的间隔线实例
  const dividerRef = useRef<HTMLDivElement>(null)
  // toc框dom实例
  const previewRef = useRef<HTMLDivElement>(null)
  // 预览框dom实例
  const tocRef = useRef<HTMLDivElement>(null)
  // 编辑与预览框整体dom实例
  const codeAreaRef = useRef<HTMLDivElement>(null)
  // toc框与编辑框之间的分割线dom实例
  const tocDividerRef = useRef<HTMLDivElement>(null)

  // 预览框HTML内容
  const [articleHtml, setArticleHtml] = useState<string>('')

  useResize(editorRef, previewRef, dividerRef)
  useResize(tocRef, codeAreaRef, tocDividerRef)

  /**
   * 解析markdown
   */
  const parseMarkdown = () => {
    const mdContent = cm.getDocString()
    clearToc()
    marked.parse(mdContent, { async: true }).then((content: string) => {
      setArticleHtml(content)
    })
  }
  // 全屏预览
  const alt_3 = (): void => {
    previewFullScreen = !previewFullScreen
    if (previewFullScreen) editorFullScreen = false
    changeEditorPreviewStyle()
  }
  // 全屏编辑
  const alt_4 = (): void => {
    editorFullScreen = !editorFullScreen
    if (editorFullScreen) previewFullScreen = false
    changeEditorPreviewStyle()
  }

  /**
   * 编辑器和预览的展开收起
   */
  const changeEditorPreviewStyle = () => {
    if (previewFullScreen) {
      editorRef.current!.style.width = `0px`
      previewRef.current!.style.width = `100%`
      previewRef.current!.style.padding = '10px 20px 0 20px'
      return
    }
    if (editorFullScreen) {
      editorRef.current!.style.width = `100%`
      previewRef.current!.style.width = `0`
      previewRef.current!.style.padding = '0'
      return
    }

    editorRef.current!.style.width = `50%`
    previewRef.current!.style.width = `50%`
    previewRef.current!.style.padding = '10px 20px 0 20px'
  }

  //#region ----------------------------------------< toc >-------------------------------

  const [articleToc, setArticleToc] = useState<ArticleToc[]>([])
  /** 清除Toc目录 */
  const clearToc = () => {
    setArticleToc([])
  }

  //#endregion
  /**
   * 初始化编辑器
   */

  const initEditor = () => {
    cm = new CodeMirror(
      CodeMirror.newEditor(
        CodeMirror.newState(
          () => {
            debounce(parseMarkdown, true, 300)
          },
          () => {
            // TODO SAVE
          },
          () => {
            // TODO UPDATEfILE
          },
        ),
        editorRef.current!,
      ),
    )
    // 创建元素
    const editorHeightHolder = document.createElement('div')
    editorHeightHolder.addEventListener('click', () => {
      const length = cm.getDocLength()
      cm.editor.focus()
      cm.insert(length, length, '', length, length)
    })
    editorRef.current!.appendChild(editorHeightHolder)
  }

  //#region ----------------------------------------< marked/preview >-------------------------------
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
    codespan(code: string): string {
      return renderCodespan(code)
    },
    heading(text: any, level: number): string {
      setArticleToc((pre) => {
        return [...pre, { level, clazz: `toc-${level}`, index: pre.length, content: text }]
      })
      return renderHeading(text, level)
    },
  }

  marked.use({ renderer })
  //#endregion

  useEffect(() => {
    initEditor()
  }, [editorRef])

  return (
    <div className={cx('article-editor', styles.editorWrapper)}>
      {/* toolbar */}
      <ArticleEditorToolbar />
      <div className={`${styles.editorWrapper}-container`}>
        <div ref={tocRef} className={`${styles.editorWrapper}-container-toc`}>
          <Toc tocList={articleToc} />
        </div>
        <div ref={tocDividerRef} className={`${styles.editorWrapper}-container-divider`} />
        <div ref={codeAreaRef} className={`${styles.editorWrapper}-container-main`}>
          {/* 快捷工具 */}
          <div className={styles.editorTool}>
            <EditorTool
              bold={() => cm.commandBold()}
              italic={() => cm.commandItalic()}
              code={() => cm.commandCode()}
              preCode={() => cm.commandPre()}
              title={(type: TitleType) => cm.commandTitle(type)}
              blockquote={() => cm.commandQuote()}
              blockquoteBlack={() => cm.commandQuoteBlack()}
              blockquoteBlue={() => cm.commandQuoteBlue()}
              blockquoteGreen={() => cm.commandQuoteBlue()}
              blockquotePurple={() => cm.commandQuotePurple()}
              blockquoteYellow={() => cm.commandQuoteYellow()}
              blockquoteRed={() => cm.commandQuoteRed}
              link={() => cm.commandLink()}
              editorFullScreen={() => alt_3()}
              previewFullScreen={() => alt_4()}
            />
          </div>
          {/* 编辑区和预览区域 */}
          <div className={cx('editor-container', styles.editorContainer)}>
            <div ref={editorRef} className={`${styles.editorContainer}-edit`} />
            <div ref={dividerRef} className={`${styles.editorContainer}-divider`} />
            <div
              ref={previewRef}
              className={cx('zeus-preview', `${styles.editorContainer}-preview`)}
              dangerouslySetInnerHTML={{ __html: articleHtml }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleEditor

const useArticleEditorStyles = createStyles(({ css, token }) => ({
  editorWrapper: css`
    min-height: 100vh;
    padding-top: 30px;
    box-sizing: border-box;
    &-container {
      display: flex;

      &-toc {
        min-width: 200px;
        max-width: 600px;
      }
      &-divider {
        height: calc(100vh - 30px);
        border-left: 2px solid var(--zeus-border-color);
        border-right: 2px solid var(--zeus-border-color);
        cursor: ew-resize;
        &:hover {
          border-color: var(--zeus-border-color-light);
        }
      }
      &-main {
        flex: 1;
      }
    }
  `,

  editorTool: css`
    height: 40px;
    background-color: ${token.colorBgContainer};
  `,
  editorContainer: css`
    height: calc(100vh - 70px);
    display: flex;

    &-edit {
      width: 50%;
      background-color: ${token.colorBgContainer};
      border-right: 0;
      overflow: hidden;
      overflow-y: scroll;
      overflow-x: hidden;
      box-sizing: border-box;
    }
    &-divider {
      height: 100%;
      border-left: 1px solid var(--zeus-border-color);
      border-right: 1px solid var(--zeus-border-color);
      cursor: ew-resize;
      &:hover {
        border-color: var(--zeus-border-color-light);
      }
    }
    &-preview {
      width: 50%;
      background-color: var(--zeus-preview-bg-color);
      color: var(--zeus-preview-color);
      border-left: 0;
      overflow-y: scroll;
      overflow-x: hidden;
      padding: 10px 20px 0px 20px;
      box-sizing: border-box;
      .code-toolbar {
        height: 25px;
        background-color: #5f5757;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        padding: 0 15px;
        box-sizing: border-box;
      }
    }
  `,
}))
