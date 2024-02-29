import React from 'react'

import { useArticleCardStyles } from './style'

export interface ArticleCardProps {
  title: string
  desc: string
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, desc }) => {
  const { cx, styles } = useArticleCardStyles()
  return (
    <div className={cx('article-card-wrapper', styles.articleCard)}>
      <p>{title}</p>
      <p>{desc}</p>
    </div>
  )
}

export default ArticleCard
