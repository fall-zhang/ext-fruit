import Speaker from '@/components/Speaker'
import type { WordResponse } from '@P/salad-api/src/types/res-type'
import { StarIcon } from 'lucide-react'
import type { FC } from 'react'

export const WordView: FC<WordResponse> = (props) => {
  return <div className=''>
    <div className="text-zone">
      <div className="flex">
        <span className='text-2xl'>
          {props.text}
        </span>
        {
          props.wordStars &&
            <span>
              {Array(5).fill('').map((_, index) => {
                let fillColor = 'none'
                if (props.wordStars! < index) {
                  fillColor = '#ffd330'
                }
                return <StarIcon key={index} fill={fillColor} />
              })}
            </span>
        }

      </div>
      {
        props.infinitive && (
          <span>原型 {props.infinitive}</span>
        )
      }
    </div>
    <div className="trans-zone">
      {/* 翻译 */}
      { props.translate.map((item, index) => {
        return <div key={index} className='flex'>
          <div className='w-16 text-right text-orange-400'>
            {item.type}
          </div>
          <div className='w-2'></div>
          {item.translate}
        </div>
      }) }
    </div>
    {
      props.origin && <div>
        单词起源 {props.origin}
      </div>
    }
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
        <div className="associate-zone flex gap-2 text-xs pl-4 text-neutral-400">
          词形
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
          { props.commonDefinitions.map((item, index) => {
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
          { props.antonymDefinitions.map((item, index) => {
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
        <div className="example-zone text-sm px-2 flex flex-col gap-3 pt-2">
          { props.exampleParagraph.map((item, index) => {
            return <div key={index}>
              <p>
                <span className='pr-2 text-orange-400'>{index + 1}.</span>
                {item.text}
              </p>
              <p className='text-[13px] text-neutral-300 pt-2'>
                {item.translate}
              </p>
              <Speaker src={item.pronounce}></Speaker>
            </div>
          })}
        </div>
    }
  </div>
}
