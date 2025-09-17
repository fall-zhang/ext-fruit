import './env'
import '@/selection'

import { WordPage } from './WordPage/index'
import { initAntdRoot } from '@/components/AntdRoot'

document.title = 'Saladict Notebook'

initAntdRoot(() => <WordPage area="notebook" />, '/wordpage/notebook')
