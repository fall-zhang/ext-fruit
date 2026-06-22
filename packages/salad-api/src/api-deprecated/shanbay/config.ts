import type { ApiInfo } from '../../types/api-info'


export const getPreference = (): ApiInfo => ({
  from: ['en'],
  to: ['en'],
  enName: 'Shanbay Dictionary',
  zhName: '扇贝词典',
  type: 'paragraph-trans',
  maxWord: 5,
  minWord: 1,
  needAuth: true,
})

export default getPreference

