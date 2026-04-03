import { AnimatePresence, motion } from 'motion/react'
import { ClockIcon, History, X, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import type { Word } from '@/types/word'

export interface HistoryItem {
  id: string;
  text: string;
  from: string;
  to: string;
  timestamp: number;
}

export const HistoryPanel: FC<{
  open: boolean
  history: Word[],
  onClose(): void
  onSelect(item: Word): void
  onClear(): void
}> = (props) => {
  return <AnimatePresence>
    {props.open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={props.onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
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
                      <span className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">
                        {item.from} → {item.to}
                      </span>
                      {/* <button
                        onClick={(e) => deleteHistoryItem(e, item.id)}
                        className="opacity-0 group-hover:opacity-40 hover:!opacity-100 p-1 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button> */}
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
