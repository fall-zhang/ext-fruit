import { ChangeEvent, FC, KeyboardEvent, KeyboardEventHandler, useEffect, useState } from "react"

type SectionText = {
  text:string
  trans?:string
  no:number
}
export const DocSection:FC<SectionText> = ({text,trans})=>{
  const [inputText,setInputText] = useState(text) 
  const [doneState,setDoneState] = useState(false) 

  function onChangeInput(ev:ChangeEvent<HTMLTextAreaElement>){
    setInputText (ev.target.value)

  }
  function onChangeText(ev:KeyboardEvent<HTMLDivElement>){
    
    console.log("🚀 ~ onChangeText ~ ev:", ev.currentTarget.textContent)
    if(ev.currentTarget.textContent === text){
      setDoneState(true)
    }
    // setDoneState(ev.target.textContent)
  }
  
  return <div className="section-container relative">
    <div className="originText leading-20 align-text-top underline-offset-0 select-none">
      {text}
    </div>
    {
      !doneState && <div className="inputText absolute leading-20 top-8 outline-0" suppressContentEditableWarning contentEditable="true" onKeyUp={onChangeText}>
      {inputText}
    </div>
    }
    {
      doneState && '完成了'
    }
    {/* <textarea className="w-full outline-0 h-full"  value={inputText} onChange={onChangeInput} /> */}
  </div>
}