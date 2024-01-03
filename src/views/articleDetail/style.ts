import { createStyles } from 'antd-style'

export const useDetailStyles = createStyles(({ css, token }) => ({
  detailWrapper: css`
    min-height: 100vh;
    background-color: ${token.colorBgBase};
    color: ${token.colorText};
  `,
  detailConatiner: css`
    padding: 70px 400px;
    /* 代码块 */
    pre {
      position: relative;
      overflow: hidden;
      font-size: 16px;
    }

    /* 复制按钮 */
    .pre-copy {
      position: absolute;
      color: #eee;
      font-size: 14px;
      top: 5px;
      right: 5px;
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
  `,
}))
