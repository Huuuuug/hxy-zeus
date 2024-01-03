import { createStyles } from 'antd-style'

export const useHomeStyles = createStyles(({ css, token }) => ({
  homeWrapper: css`
    min-height: 100vh;
    background-color: ${token.colorBgBase};
    padding-bottom: 10px;
  `,

  homeContainer: css`
    padding: 70px 400px 0 400px;
    min-height: calc(100vh - 90px);

    ul {
      width: 720px;
      li {
        width: 100%;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 20px;
        margin-bottom: 10px;
        background-color: ${token.colorBgContainer};
        cursor: pointer;

        color: ${token.colorText};
        &-text {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        img {
          width: 100px;
          height: 70px;
          margin-left: 20px;
        }
      }
    }
  `,
}))
