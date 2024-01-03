import { useEffect, useRef, useState } from 'react'

import { createStyles } from 'antd-style'

import { CodeMirror } from '@/utils/codemirror'
import marked from '@/utils/markedjs'

import ArticleEditorToolbar from './ArticleEditorToolbar'

let cm: CodeMirror

const ArticleEditor: React.FC = () => {
  const { cx, styles } = useArticleEditorStyles()
  // 编辑框dom实例
  const editorRef = useRef<HTMLDivElement>(null)
  // 编辑框和预览框之间的间隔线实例
  const dividerRef = useRef<HTMLDivElement>(null)
  // 预览框HTML内容
  const [articleHtml, setArticleHtml] = useState<string>('')

  const parseMarkdown = () => {
    // const begin = Date.now()
    const mdContent = cm.getDocString()
    marked.parse(mdContent, { async: true }).then((content: string) => {
      setArticleHtml(content)
    })
  }

  const initEditor = () => {
    cm = new CodeMirror(
      CodeMirror.newEditor(
        CodeMirror.newState(
          () => {
            // TODO UPDATE
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

  useEffect(() => {
    initEditor()
  }, [])
  return (
    <div className={cx('article-editor', styles.editorWrapper)}>
      {/* toolbar */}
      <ArticleEditorToolbar />
      <div className={`${styles.editorWrapper}-container`}>
        <div className={`${styles.editorWrapper}-container-toc`}>toc</div>
        <div className={`${styles.editorWrapper}-container-main`}>
          {/* 快捷工具 */}
          <div className={styles.editorTool} onClick={parseMarkdown}>
            tool
          </div>
          {/* 编辑区和预览区域 */}
          <div className={cx('editor-container', styles.editorContainer)}>
            <div ref={editorRef} className={`${styles.editorContainer}-edit`} />
            <div ref={dividerRef} className={`${styles.editorContainer}-divider`} />
            <div
              className={`${styles.editorContainer}-preview`}
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
    background-color: ${token.colorBgBase};
    padding-top: 30px;
    box-sizing: border-box;
    &-container {
      display: flex;
      &-toc {
        min-width: 300px;
      }
      &-main {
        flex: 1;
      }
    }
  `,

  editorTool: css`
    background-color: #3d3d3d;
    height: 35px;
  `,
  editorContainer: css`
    height: calc(100vh - 65px);
    display: flex;

    &-edit {
      width: 50%;
      background-color: ${token.colorBgContainer};
      border: 1px solid var(--zeus-border-color);
      border-right: 0;
      overflow: hidden;
      overflow-y: scroll;
    }
    &-divider {
      height: 100%;
      border-left: 2px solid var(--zeus-border-color);
      /* margin-left: 1px; */
      cursor: ew-resize;
      &:hover {
        border-left: 2px dashed var(--zeus-border-color);
      }
    }
    &-preview {
      width: 50%;
      background-color: ${token.colorBgContainer};
      border: 1px solid var(--zeus-border-color);
      border-left: 0;
      overflow: hidden;
      overflow-y: scroll;
    }
  `,
}))
