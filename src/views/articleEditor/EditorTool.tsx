import { createStyles } from 'antd-style'

import { IconFont } from '@/conf'

interface EditorToolProps {
  bold: () => void
  italic: () => void
  blockquote: () => void
}

const EditorTool: React.FC<EditorToolProps> = ({ bold, italic, blockquote }) => {
  const { cx, styles } = useEditorToolStyles()
  return (
    <div className={cx('editor-tool', styles.editorTool)}>
      <div className={`${styles.editorTool}-container`}>
        {/*  */}
        <IconFont type="icon-save" className={`${styles.editorTool}-container-item`} />
        <IconFont type="icon-preview" className={`${styles.editorTool}-container-item`} />
        <IconFont type="icon-fullscan" className={`${styles.editorTool}-container-item`} />

        {/*  */}
        <IconFont type="icon-title" className={`${styles.editorTool}-container-item`} />
        <IconFont type="icon-bold" className={`${styles.editorTool}-container-item`} onClick={bold} />
        <IconFont type="icon-italic" className={`${styles.editorTool}-container-item`} onClick={italic} />
        <IconFont type="icon-quote" className={`${styles.editorTool}-container-item`} onClick={blockquote} />
        <IconFont type="icon-code" className={`${styles.editorTool}-container-item`} />
        <IconFont type="icon-codeblock" className={`${styles.editorTool}-container-item`} />
        <IconFont type="icon-link" className={`${styles.editorTool}-container-item`} />
      </div>
    </div>
  )
}

export default EditorTool

const useEditorToolStyles = createStyles(({ css, token }) => ({
  editorTool: css`
    height: 100%;
    display: block;
    padding: 3px 10px;
    box-sizing: border-box;

    &-container {
      height: 100%;
      display: flex;
      align-items: center;
      background-color: var(--zeus-bg-lighter);
      border-radius: 5px;
      &-item {
        width: 24px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #000;
        font-size: 16px;
        border-radius: 2px;
        margin-left: 8px;
        cursor: pointer;
        color: var(--zeus-base-text);
        &:hover {
          background-color: ${token.colorPrimary};
        }
      }
    }
  `,
}))
