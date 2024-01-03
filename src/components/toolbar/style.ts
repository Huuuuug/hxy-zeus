import { createStyles } from 'antd-style'

export const useTopNavigationStyles = createStyles(({ css, token }) => ({
  toolbar: css`
    width: 100%;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    background-color: ${token.colorBgContainer};
    color: #fff;
    align-items: center;
    padding: 0 35px;
    box-shadow:
      0 1px 2px 0 rgba(0, 0, 0, 0.03),
      0 1px 6px -1px rgba(0, 0, 0, 0.02),
      0 2px 4px 0 rgba(0, 0, 0, 0.02);
    position: fixed;
    top: 0;
  `,
  toolbarLeft: css`
    color: ${token.colorText};
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
  `,
  toolbarMiddle: css`
    color: ${token.colorText};
  `,

  toolbarRight: css`
    display: flex;
    align-items: center;

    > * {
      margin: 0 8px;
      cursor: pointer;
    }

    &-item {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      color: ${token.colorText};
      &:hover {
        background-color: ${token.colorBgBlur};
      }
    }
  `,
}))
