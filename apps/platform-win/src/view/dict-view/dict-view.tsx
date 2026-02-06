import { NoteBook } from '@P/saladict-core/main'
export {
  NoteBook
}

/**
 * 保存到生词本
 */
export const DictView = () => {
  return <div className='w-100 h-100 relative'>
    <NoteBook/>
  </div>
}
