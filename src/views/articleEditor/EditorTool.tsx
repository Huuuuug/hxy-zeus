import { Dropdown } from 'antd'
import { createStyles } from 'antd-style'

import type { TitleType } from '@/utils/codemirror'

import type { MenuProps } from 'antd'

import { IconFont } from '@/conf'

interface EditorToolProps {
  bold: () => void
  italic: () => void
  code: () => void
  preCode: () => void
  title: (type: TitleType) => void
  blockquote: () => void
  blockquoteBlack: () => void
  blockquoteGreen: () => void
  blockquoteYellow: () => void
  blockquoteBlue: () => void
  blockquotePurple: () => void
  blockquoteRed: () => void
  link: () => void
  editorFullScreen: () => void
  previewFullScreen: () => void
}

const EditorTool: React.FC<EditorToolProps> = (props) => {
  const { title } = props
  const { cx, styles } = useEditorToolStyles()
  // 引用功能列表
  const quoteList: MenuProps['items'] = [
    {
      key: 'normal',
      label: '⚪ Normal',
      onClick: () => props.blockquote(),
    },
    {
      key: 'black',
      label: '⚫ Black',
      onClick: () => props.blockquoteBlack(),
    },
    {
      key: 'green',
      label: '🟢 Green',
      onClick: () => props.blockquoteGreen(),
    },
    {
      key: 'yellow',
      label: '🟡 Yellow',
      onClick: () => props.blockquoteYellow(),
    },
    {
      key: 'red',
      label: '🔴 Red',
      onClick: () => props.blockquoteRed(),
    },
    {
      key: 'blue',
      label: '🔵 Blue',
      onClick: () => props.blockquoteBlue(),
    },
    {
      key: 'purple',
      label: '🟣 Purple',
      onClick: () => props.blockquotePurple(),
    },
  ]
  // 标题功能列表
  const hList: MenuProps['items'] = [
    {
      key: 'h1',
      label: 'H1',
      onClick: () => title('h1'),
    },
    {
      key: 'h2',
      label: 'H2',
      onClick: () => title('h2'),
    },
    {
      key: 'h3',
      label: 'H3',
      onClick: () => title('h3'),
    },
    {
      key: 'h4',
      label: 'H4',
      onClick: () => title('h4'),
    },
    {
      key: 'h5',
      label: 'H5',
      onClick: () => title('h5'),
    },
    {
      key: 'h6',
      label: 'H6',
      onClick: () => title('h6'),
    },
  ]

  return (
    <div className={cx('editor-tool', styles.editorTool)}>
      <div className={`${styles.editorTool}-container`}>
        {/*  */}
        <IconFont type="icon-save" className={`${styles.editorTool}-container-item`} />
        <IconFont
          type="icon-preview"
          className={`${styles.editorTool}-container-item`}
          onClick={props.previewFullScreen}
        />
        <IconFont
          type="icon-fullscan"
          className={`${styles.editorTool}-container-item`}
          onClick={props.editorFullScreen}
        />

        {/*  */}
        <Dropdown menu={{ items: hList }}>
          <IconFont
            type="icon-title"
            className={`${styles.editorTool}-container-item`}
            onClick={() => props.title('h3')}
          />
        </Dropdown>
        <IconFont type="icon-bold" className={`${styles.editorTool}-container-item`} onClick={props.bold} />
        <IconFont type="icon-italic" className={`${styles.editorTool}-container-item`} onClick={props.italic} />
        <Dropdown menu={{ items: quoteList }}>
          <IconFont type="icon-quote" className={`${styles.editorTool}-container-item`} onClick={props.blockquote} />
        </Dropdown>
        <IconFont type="icon-code" className={`${styles.editorTool}-container-item`} onClick={props.code} />
        <IconFont type="icon-codeblock" className={`${styles.editorTool}-container-item`} onClick={props.preCode} />
        <IconFont type="icon-link" className={`${styles.editorTool}-container-item`} onClick={props.link} />
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
