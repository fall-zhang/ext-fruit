import type { ReactNode } from 'react'
import { createContext, useContext, useRef, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@salad/ui/components/ui/dialog'
import { Button } from '@salad/ui/components/ui/button'
// 外部系统提供的 context
interface DialogContextType {
  confirm(opt:{
    title: string,
    description?: string,
    onConfirm?():void
    onCancel?():void
  }):void
}
// 默认
const ConfirmContext = createContext<DialogContextType>({
  confirm (opt) {
    throw new Error('you should register the dialog context in your DOM.')
  },
})

export function useConfirmContext () {
  const context = useContext(ConfirmContext)
  return context
}

interface CalendarProviderProps {
  children: ReactNode;
}

export function ConfirmProvider ({ children }: CalendarProviderProps) {
  // const
  const [dialogOpen, setDialogOpen] = useState(false)
  const [description, setDescription] = useState<ReactNode>('')
  const [title, setTitle] = useState('')
  const useFunRef = useRef<{
    onConfirm?():void
    onCancel?():void
  }>({ })
  const onCancelDialog = () => {
    useFunRef.current.onCancel?.()
  }
  const onConfirmDialog = () => {
    useFunRef.current.onConfirm?.()
  }

  const props:DialogContextType = {
    confirm (opt) {
      setDialogOpen(true)
      setDescription(opt.description)
      setTitle(opt.title)
      useFunRef.current.onConfirm = opt.onConfirm
      useFunRef.current.onCancel = opt.onCancel
    },
  }


  return (
    <ConfirmContext.Provider value={props}>
      {children}
      <Dialog open={dialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onCancelDialog}>取消</Button>
            <Button onClick={onConfirmDialog}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  )
}
