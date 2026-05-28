import Speaker from '@/components/Speaker'
import type { WordResponse } from '@P/salad-api/src/types/res-type'
import type { FC } from 'react'

export const WordView: FC<WordResponse> = (props) => {
  return <div className=''>
    <div className="text-zone">
      {props.text}
      {
        props.infinitive &&
          <span>原型:{props.infinitive}</span>
      }
    </div>
    <div className="trans-zone">
      { props.translate.map((item, index) => {
        return <div key={index}>
          {item.translate}
        </div>
      }) }
    </div>
    <div className="pronounce-zone">
      { props.pronounce.map((item, index) => {
        return <div key={index}>
          {item.phoneticSymbols}
          <Speaker src={item.src}></Speaker>
        </div>
      }) }
    </div>
    {
      props.associateWord &&
        <div className="associate-zone">
          { props.associateWord?.map((item, index) => {
            return <div key={index}>
              {item.phoneticSymbol}
              {item.text}
              {item.translate}
              <Speaker src={item.pronounce}></Speaker>
            </div>
          }) }
        </div>
    }
    {
      props.commonDefinitions &&
        <div className="relative-zone">
          { props.associateWord?.map((item, index) => {
            return <div key={index}>
              {item.phoneticSymbol}
              {item.text}
              {item.translate}
              <Speaker src={item.pronounce}></Speaker>
            </div>
          }) }
        </div>
    }
    {
      props.antonymDefinitions &&
        <div className="antony-zone">
          { props.associateWord?.map((item, index) => {
            return <div key={index}>
              {item.phoneticSymbol}
              {item.text}
              {item.translate}
              <Speaker src={item.pronounce}></Speaker>
            </div>
          }) }
        </div>
    }
    {
      props.exampleParagraph &&
        <div className="example-zone">
          { props.associateWord?.map((item, index) => {
            return <div key={index}>
              {item.phoneticSymbol}
              {item.text}
              {item.translate}
              <Speaker src={item.pronounce}></Speaker>
            </div>
          })}
        </div>
    }
  </div>
}
