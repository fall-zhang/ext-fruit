import { AnimatePresence, motion } from 'motion/react'
import { ClockIcon, History, X, Trash2, BookmarkPlus, BookmarkIcon } from 'lucide-react'
import type { FC } from 'react'
import type { Word } from '@/types/word'
import { format } from 'date-fns'
// 将自动检测
export const HistoryPanel: FC<{
  open: boolean
  history: Word[],
  onClose(): void
  onSelect(item: Word): void
  onRemoveHistoryItem(id: string): void
  onClear(): void
}> = (props) => {
  const toggleWordMark = async (word: Word) => {
    // 切换当前单词是否为收藏
  }

  return <AnimatePresence>
    {props.open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={props.onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white dark:bg-neutral-900 shadow-2xl z-[70] border-l border-slate-100 dark:border-slate-800 flex flex-col"
        >
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClockIcon size={16} className="opacity-40" />
              {/* <span className="font-bold text-sm">History</span> */}
              <span className="font-bold text-sm">搜索历史</span>
            </div>
            <button
              onClick={props.onClose}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <X size={18} className="opacity-40" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {props.history.length === 0
              ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
                  <History size={32} />
                  {/* <span className="text-xs font-bold uppercase tracking-widest">No History</span> */}
                  <span className="text-xs font-bold uppercase tracking-widest">无历史记录</span>
                </div>
              )
              : (
                props.history.map((item) => (
                  <div
                    key={item.date}
                    onClick={() => props.onSelect(item)}
                    className="group p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold opacity-30  tracking-tighter">
                        {item.from || 'auto'} → {item.to || 'auto'}
                      </span>
                      <div className="grow"></div>
                      <div className="opt-group flex items-center" onClick={ev => ev.stopPropagation()}>
                        <span className='text-[11px] text-neutral-800 dark:text-neutral-300 '>{format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss')}</span>
                        <button
                          onClick={() => props.onRemoveHistoryItem(item.id)}
                          className="opacity-0 group-hover:opacity-40 hover:opacity-100! p-1 transition-opacity cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                        {/* 添加到收藏夹，等统一查询结果格式后实现 */}
                        {/* <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWordMark(item)
                          }}
                          className="opacity-0 group-hover:opacity-40 hover:opacity-100! p-1 transition-opacity cursor-pointer"
                        >
                          <BookmarkPlus size={16} />
                        </button> */}
                      </div>
                      {/* <BookmarkIcon size={16} fill='#ffffff'></BookmarkIcon> */}
                    </div>
                    <p className="text-sm line-clamp-2 leading-snug opacity-80">{item.text}</p>
                  </div>
                ))
              )}
          </div>

          {history.length > 0 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={props.onClear}
                className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              >
                {/* Clear All History */}
                清空历史
              </button>
            </div>
          )}
        </motion.div>
      </>
    )}
  </AnimatePresence>
}
