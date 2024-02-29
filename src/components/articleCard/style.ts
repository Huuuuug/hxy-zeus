import { createStyles } from 'antd-style'

export const useArticleCardStyles = createStyles(({ css }) => ({
  articleCard: css`
    width: 100%;
    box-shadow: 0px 0px 20px 1px rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    padding: 16px;
  `,
}))
