import React, { FC } from 'react'
import Speaker from '@/components/Speaker'
import StarRates from '@/components/StarRates'
import {
  LongmanResult,
  LongmanResultLex,
  LongmanResultRelated,
  LongmanResultEntry
} from './engine'
import { ViewPorps } from '@P/trans-api/src/helpers'
import { StrElm } from '@/components/StrElm'

export const DictLongman: FC<ViewPorps<LongmanResult>> = ({ result }) =>
  (result.type === 'lex'
    ? renderLex(result)
    : result.type === 'related'
      ? renderRelated(result)
      : null)

export default DictLongman

function renderEntry (entry: LongmanResultEntry) {
  return (
    <section
      key={entry.title.HWD + entry.title.HOMNUM}
      className="dictLongman-Entry"
    >
      <header>
        <div className="dictLongman-HeaderContainer">
          <h1 className="dictLongman-Title">
            <span className="dictLongman-Title_HWD">{entry.title.HWD}</span>
            <span className="dictLongman-Title_HYPHENATION">
              {entry.title.HYPHENATION}
            </span>
            <span className="dictLongman-Title_HOMNUM">
              {entry.title.HOMNUM}
            </span>
          </h1>
          {entry.level
            ? (
              <span title={entry.level.title} className="dictLongman-Level">
                <StarRates
                  max={3}
                  rate={entry.level.rate}
                  className="dictLongman-Level_Rate"
                />
              </span>
            )
            : null}
          {entry.freq &&
            entry.freq.map(freq => (
              <span
                key={freq.rank}
                className="dictLongman-FREQ"
                title={freq.title}
              >
                {freq.rank}
              </span>
            ))}
        </div>
        <div className="dictLongman-HeaderContainer">
          <span className="dictLongman-Pos">{entry.pos}</span>
          <span className="dictLongman-Phsym">{entry.phsym}</span>
          {entry.prons &&
            entry.prons.map(pron => (
              <React.Fragment key={pron.pron}>
                {pron.lang.toUpperCase()}: <Speaker src={pron.pron} />
              </React.Fragment>
            ))}
          {entry.topic && (
            <>
              Topic:{' '}
              <a href={entry.topic.href} rel="nofollow noopener noreferrer">
                {entry.topic.title}
              </a>
            </>
          )}
        </div>
      </header>

      {entry.senses.map(sen => (
        <StrElm key={sen} className="dictLongman-Sense" html={sen} />
      ))}

      {entry.collocations && (
        <StrElm className="dictLongman-Box" html={entry.collocations} />
      )}

      {entry.grammar && (
        <StrElm className="dictLongman-Box" html={entry.grammar} />
      )}

      {entry.thesaurus && (
        <StrElm className="dictLongman-Box" html={entry.thesaurus} />
      )}

      {entry.examples && entry.examples.length > 0 && (
        <>
          <h2 className="dictLongman-Examples_Title">
            Examples from the Corpus
          </h2>
          {entry.examples.map(exa => (
            <StrElm key={exa} className="dictLongman-Examples" html={exa} />
          ))}
        </>
      )}
    </section>
  )
}

function renderLex (result: LongmanResultLex) {
  type Dicts = ['bussiness', 'contemporary'] | ['contemporary', 'bussiness']
  // const dictTitle = {
  //   contemporary: 'Longman Dictionary of Contemporary English',
  //   bussiness: 'Longman Business Dictionary',
  // }
  const dicts: Dicts = result.bussinessFirst
    ? ['bussiness', 'contemporary']
    : ['contemporary', 'bussiness']

  return (
    <>
      {result.wordfams && (
        <StrElm className="dictLongman-Wordfams" html={result.wordfams} />
      )}

      {dicts.map((dict, index) =>
        (result[dict].length > 0 ? (
          <div className="dictLongman-Dict" key={dict + index}>
            {/* <h1 className='dictLongman-DictTitle'>
              <span>- {dictTitle[dict]} -</span>
            </h1> */}
            {result[dict].map(renderEntry)}
          </div>
        ) : null)
      )}
    </>
  )
}

function renderRelated (result: LongmanResultRelated) {
  return (
    <>
      <p>Did you mean:</p>
      <StrElm tag="ul" className="dictLongman-Related" html={result.list} />
    </>
  )
}
