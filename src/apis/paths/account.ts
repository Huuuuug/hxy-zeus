import { Post } from '../server.ts'

/**
 * login
 * @param params
 *          username (string): username
 *          password (string): password
 */
export const login = (params: { username: string; password: string }) => {
  return Post<{ username: string; token: string; refresh_token: string }>('/manage/account/login', params)
}

export const accountApi = {
  login,
}
