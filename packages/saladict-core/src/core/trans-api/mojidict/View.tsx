import type { FC } from 'react'
import { type MojidictResult, getTTS } from './engine'
import Speaker from '@P/saladict-core/src/components/Speaker'
import EntryBox from '@P/saladict-core/src/components/EntryBox'
import type { ViewProps } from '../helpers'

export const DictMojidict: FC<ViewProps<MojidictResult>> = ({ result }) => (
  <>
    {result.word && (
      <div>
        <h1>{result.word.spell}</h1>
        <span>{result.word.pron}</span>{' '}
        <Speaker
          src={
            result.word.tts ||
            (() => {
              return getTTS(result.word?.tarId || '', 102)
            })
          }
        />
      </div>
    )}
    {result.details &&
      result.details.map(detail => (
        <EntryBox key={detail.title} title={detail.title}>
          {detail.subdetails && (
            <ul className="dictMojidict-List">
              {detail.subdetails.map(subdetail => (
                <li
                  key={subdetail.title}
                  className="dictMojidict-ListItem_Disc"
                >
                  <p>{subdetail.title}</p>
                  {subdetail.examples && (
                    <ul className="dictMojidict-Sublist">
                      {subdetail.examples.map(example => (
                        <li key={example.title}>
                          <p className="dictMojidict-Word_Title">
                            {example.title}
                            <Speaker
                              src={() =>
                                getTTS(example.objectId, 103)
                              }
                            />
                          </p>
                          <p className="dictMojidict-Word_Trans">
                            {example.trans}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </EntryBox>
      ))}
    {result.releated && (
      <EntryBox title="関連用語">
        <ul className="dictMojidict-List">
          {result.releated.map(word => (
            <li key={word.title}>
              <p className="dictMojidict-Word_Title">{word.title}</p>
              <p className="dictMojidict-Word_Trans">{word.excerpt}</p>
            </li>
          ))}
        </ul>
      </EntryBox>
    )}
  </>
)

export default DictMojidict
