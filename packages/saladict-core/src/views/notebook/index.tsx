import './env'
// import '@/selection'

import { WordPage } from './WordPage/index'
// import { initAntdRoot } from '@/components/AntdRoot'
import { initAntdRoot } from '../../components/AntdRoot'
import { FC } from 'react'


export const NoteBook:FC = () => {
  return <WordPage area="notebook" />
}

