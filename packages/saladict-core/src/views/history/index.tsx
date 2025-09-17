import './env'
import '@/selection'

import { WordPage } from '@/components/WordPage'
import { initAntdRoot } from '@/components/AntdRoot'

initAntdRoot(() => <WordPage area="history" />, '/wordpage/history')
