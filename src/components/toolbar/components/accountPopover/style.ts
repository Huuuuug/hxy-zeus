import { createStyles } from 'antd-style'

export const useAccountPopoverStyles = createStyles(({ css }) => ({
  popoverHeader: css`
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 20px;
  `,

  popoverContainer: css`
    display: flex;
    flex-direction: column;
    li {
      display: flex;
      align-items: center;
      height: 40px;

      cursor: pointer;
      user-select: none;

      &:hover {
        background-color: aliceblue;
      }
    }
  `,
}))
