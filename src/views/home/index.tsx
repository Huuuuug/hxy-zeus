import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import dayjs from 'dayjs'

import Toolbar from '@/components/toolbar'

import { api } from '@/apis'
import { useHomeStyles } from '@/views/home/style.ts'

interface Article {
  id: number
  title: string
  content: string
  img?: string
  create_time: string
  update_time: string
}

const Index: React.FC = () => {
  const navigate = useNavigate()
  const { cx, styles } = useHomeStyles()
  // article list
  const [articles, setArticles] = useState<Article[]>([])

  // get articles
  const getArticles = async () => {
    const [_, res] = await api.getArticle({ page: 1, per_page: 10 })
    if (!_ && res) {
      setArticles(res.data.articles)
    }
  }
  /**
   * 跳转到文章详情页
   * @param id article id
   */
  const handleArticleItemClick = (id: number) => {
    navigate(`/articleDetail/${id}`)
  }

  useEffect(() => {
    ;(async () => {
      await getArticles()
    })()
  }, [])

  return (
    <div className={cx('home-wrapper', styles.homeWrapper)}>
      <Toolbar />
      <div className={styles.homeContainer}>
        {articles.length > 0 ? (
          <ul>
            {articles.map(({ id, title, content, img: imgSrc, create_time }) => (
              <li key={id} onClick={() => handleArticleItemClick(id)}>
                <div>
                  <p>{title}</p>
                  <p>{content}</p>
                  <span>{dayjs(create_time).format('YYYY-MM-DD')}</span>
                </div>
                {imgSrc ? <img src={imgSrc} /> : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
export default Index
