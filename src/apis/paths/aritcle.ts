import { Delete, Get, Post, Put } from '../server.ts'

const ARTICLE_BASE_URL = '/manage/articles'

/**
 * create an article
 * @param params
 *         classification_id? (number): classification id
 *         title (string): article title
 *         content (string): article content
 */
export const createArticle = (params: { classification_id?: number; title: string; content: string }) => {
  return Post(ARTICLE_BASE_URL, params)
}
/**api
 * query articles
 * @param params
 *          page (number): current page
 *          per_page (number): articles count per page
 */
export const getArticle = (params: { page: number; per_page: number }) => {
  return Get<{
    articles: { id: number; title: string; content: string; create_time: string; update_time: string }[]
    page: number
    per_page: number
    total: number
  }>(ARTICLE_BASE_URL, { ...params })
}
/**
 * delete article(s)
 * @param id (number | number[]): article id
 */
export const deleteArticle = (id: number | number[]) => {
  return Delete(ARTICLE_BASE_URL, { id })
}

/**
 * update article
 * @param params
 *          article_id (number): article id
 *          title? (string): article title
 *          content? (string): article content
 *          classification_id? (number | number[]) article classification id
 */
export const updateArticle = (params: {
  article_id: number
  title?: string
  content?: string
  classification_id?: number[]
}) => {
  return Put(ARTICLE_BASE_URL, params)
}
export const articleApi = {
  createArticle,
  getArticle,
  deleteArticle,
  updateArticle,
}
