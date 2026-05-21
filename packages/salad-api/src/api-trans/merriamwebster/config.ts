import type { ApiInfo } from '../../types/api-info'

export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Merriam-Webster\'s Dictionary',
  zhName: '韦氏词典',
  type: 'paragraph-trans',
  maxWord: 5,
  minWord: 1,
})

export default getPreference

