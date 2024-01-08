import { createStyles } from 'antd-style'

import type { ArticleToc } from './type'

interface TocProps {
  tocList: ArticleToc[]
}

const Toc: React.FC<TocProps> = ({ tocList }) => {
  const { cx, styles } = useTocStyles()
  /**
   * 预览界面滚动到指定的标题处
   * @param level H 等级
   * @param content H 内容
   */
  const handleTocHClick = (level: number, content: string) => {
    const id = level + '-' + content
    const elm: HTMLElement = document.getElementById(id) as HTMLElement
    ;(elm.parentNode as Element).scrollTop = elm.offsetTop - 70
  }

  return (
    <div className={cx('toc-wrapper', styles.tocWrapper)}>
      <ul className={cx('toc-container', styles.tocContainer)}>
        {tocList.map(({ index, content, clazz, level }) => (
          <li
            key={index}
            className={clazz}
            dangerouslySetInnerHTML={{ __html: content }}
            onClick={() => handleTocHClick(level, content)}
          ></li>
        ))}
      </ul>
    </div>
  )
}

export default Toc

const useTocStyles = createStyles(({ css, token }) => ({
  tocWrapper: css`
    height: 100%;
    background-color: var(--zeus-editor-bg-color);
    padding: 10px;
  `,
  tocContainer: css`
    overflow-y: overlay;
    padding-top: 10px;
    color: ${token.colorText};
    .toc-1,
    .toc-2,
    .toc-3,
    .toc-4,
    .toc-5,
    .toc-6 {
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      white-space: pre;

      &:hover {
        font-weight: bold;
      }
    }

    .toc-1 {
      margin-top: 5px;
      padding-top: 5px;

      &:first-child {
        margin: 0;
        padding: 0;
        border: 0;
      }
    }

    .toc-2 {
      &::before {
        content: '  ';
      }
    }

    .toc-3 {
      &::before {
        content: '    ';
      }
    }

    .toc-4 {
      &::before {
        content: '      ';
      }
    }

    .toc-5 {
      &::before {
        content: '        ';
      }
    }

    .toc-6 {
      &::before {
        content: '          ';
      }
    }
  `,
}))
