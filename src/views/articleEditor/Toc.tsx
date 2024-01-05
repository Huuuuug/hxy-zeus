import { createStyles } from 'antd-style'
const Toc: React.FC = () => {
  const { cx, styles } = useTocStyles()
  return <div className={cx('toc-wrapper', styles.tocWrapper)}>Toc</div>
}

export default Toc

const useTocStyles = createStyles(({ css }) => ({
  tocWrapper: css`
    height: 100%;
    background-color: var(--zeus-editor-bg-color);
  `,
}))
