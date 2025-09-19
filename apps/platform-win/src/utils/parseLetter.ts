/**
 * 一段文本
 */
type SectionText = {
  text:string
  trans?:string
  no:number
}

export function parseLetter(str:string){
  let index = 0
  const sectionTextList = str.split('\n').filter(item=>item.length)
  
  const result = sectionTextList.map((item)=>{
    const result:SectionText = {
      text: item,
      no: index
    }
    index++
    return result
  })
  return  result
}