import React, { FC } from 'react'
import Speaker from '@/components/Speaker'
import { NaverResult } from './engine'
import { ViewPorps } from '@/components/dictionaries/helpers'
import { StrElm } from '@/components/StrElm'

export const DictNaver: FC<ViewPorps<NaverResult>> = props => {
  const ListMap = props.result.entry

  return (
    <>
      <select
        onChange={e =>
          props.searchText({
            id: 'naver',
            payload: { lang: e.target.value }
          })
        }
        value={props.result.lang}
      >
        <option key="zh" value="zh">
          中韩
        </option>
        <option key="ja" value="ja">
          日韓
        </option>
      </select>

      {/* entry */}
      {!!ListMap?.WORD?.items?.length && (
        <div className={'dictNaver-EntryBox'}>
          <span className={'dictNaver-EntryBoxTitle'}>单词</span>

          {ListMap.WORD.items.map((word, wordI) => {
            return (
              <div className={'dictNaver-Entry'} key={wordI}>
                <StrElm
                  tag="h3"
                  className={'dictNaver-EntryTitle'}
                  html={word.expEntry}
                />
                {word.expEntrySuperscript && (
                  <sup className={'dictNaver-EntrySup'}>
                    {word.expEntrySuperscript}
                  </sup>
                )}
                {word.expKanji && (
                  <>
                    [
                    <StrElm
                      tag="span"
                      className={'dictNaver-EntryKanji'}
                      html={word.expKanji}
                    />
                    ]
                  </>
                )}

                <div className={'dictNaver-EntryPron'}>
                  {!!word?.expAliasGeneralAlwaysList?.length && (
                    <span className={'dictNaver-EntryPronVal'}>
                      {word?.expAliasGeneralAlwaysList[0].originLanguageValue}
                    </span>
                  )}
                  {!!word?.searchPhoneticSymbolList?.length && (
                    <>
                      {word.searchPhoneticSymbolList[0].phoneticSymbol && (
                        <StrElm
                          tag="span"
                          html={`[${word.searchPhoneticSymbolList[0].phoneticSymbol}]`}
                        />
                      )}
                      {word?.searchPhoneticSymbolList[0]
                        ?.phoneticSymbolPath && (
                        <Speaker
                          src={
                            word.searchPhoneticSymbolList[0]?.phoneticSymbolPath?.split(
                              '|'
                            ).length > 1
                              ? word.searchPhoneticSymbolList[0]?.phoneticSymbolPath?.split(
                                '|'
                              )[0]
                              : word.searchPhoneticSymbolList[0]
                                .phoneticSymbolPath
                          }
                        />
                      )}
                    </>
                  )}

                  {word?.frequencyAdd?.split('^').map(wordF => (
                    <span key={wordF} className={'dictNaver-EntryPronFa'}>
                      {wordF}
                    </span>
                  ))}
                </div>

                <div className={'dictNaver-EntryExp'}>
                  {word?.meansCollector?.map((wordMc, wordMcI) => {
                    return (
                      <ul key={wordMcI}>
                        {wordMc.means.map((m, mI) => (
                          <li key={mI}>
                            {m.order && <span>{m.order}.</span>}
                            {wordMc.partOfSpeech2 && (
                              <span className={'dictNaver-EntryExpPos'}>
                                {wordMc.partOfSpeech2}
                              </span>
                            )}
                            {m.subjectGroup && <span>{m.subjectGroup}</span>}
                            <StrElm tag="span" html={m.value} />
                          </li>
                        ))}
                      </ul>
                    )
                  })}
                </div>

                <a
                  className={'dictNaver-EntrySource'}
                  href={word.sourceDictnameLink}
                >
                  {word.sourceDictnameOri}
                </a>
              </div>
            )
          })}
        </div>
      )}

      {/* mean */}
      {!!ListMap?.MEANING?.items?.length && (
        <div className={'dictNaver-MeanBox'}>
          <span className={'dictNaver-MeanBoxTitle'}>释义</span>

          {ListMap.MEANING.items.map((meaning, meaningI) => {
            return (
              <div className={'dictNaver-Mean'} key={meaningI}>
                <StrElm
                  tag="h3"
                  className={'dictNaver-MeanTitle'}
                  html={meaning.expEntry}
                />
                {meaning.expEntrySuperscript && (
                  <sup className={'dictNaver-MeanSup'}>
                    {meaning.expEntrySuperscript}
                  </sup>
                )}

                {!!meaning?.expAliasGeneralAlwaysList?.length && (
                  <StrElm
                    tag="span"
                    className={'dictNaver-MeanAlias'}
                    html={
                      meaning.expAliasGeneralAlwaysList[0].originLanguageValue
                    }
                  />
                )}

                <div className={'dictNaver-MeanPron'}>
                  {!!meaning?.searchPhoneticSymbolList?.length && (
                    <>
                      <span>
                        [{meaning.searchPhoneticSymbolList[0].phoneticSymbol}]
                      </span>
                      <Speaker
                        src={
                          meaning.searchPhoneticSymbolList[0].phoneticSymbolPath
                        }
                      />
                    </>
                  )}
                </div>

                <div className={'dictNaver-MeanExp'}>
                  {meaning?.meansCollector?.map((meaningMc, meaningMcI) => {
                    return (
                      <ul key={meaningMcI}>
                        {meaningMc?.means.map((m, mI) => (
                          <li key={mI}>
                            {m.order && <span>{m.order}.</span>}
                            {meaningMc.partOfSpeech2 && (
                              <span className={'dictNaver-MeanExpPos'}>
                                {meaningMc.partOfSpeech2}
                              </span>
                            )}
                            {m.subjectGroup && <span>{m.subjectGroup}</span>}
                            {m.languageGroup && (
                              <span className={'dictNaver-MeanExpLg'}>
                                {m.languageGroup}
                              </span>
                            )}
                            <StrElm tag="span" html={m.value} />
                          </li>
                        ))}
                      </ul>
                    )
                  })}
                </div>

                <a
                  className={'dictNaver-MeanSource'}
                  href={meaning.sourceDictnameLink}
                >
                  {meaning.sourceDictnameOri}
                </a>
              </div>
            )
          })}
        </div>
      )}

      {/* example */}
      {!!ListMap?.EXAMPLE?.items?.length && (
        <div className={'dictNaver-ExampleBox'}>
          <span className={'dictNaver-ExampleBoxTitle'}>例句</span>

          {ListMap.EXAMPLE.items.map((example, exampleI) => {
            return (
              <div className={'dictNaver-Example'} key={exampleI}>
                <StrElm
                  tag="h3"
                  className={'dictNaver-ExampleTitle'}
                  html={example.expExample1}
                />

                <div className={'dictNaver-ExamplePron'}>
                  <Speaker
                    src={
                      props.result.lang === 'ja'
                        ? `https://ja.dict.naver.com/api/nvoice?speaker=yuri&service=dictionary&speech_fmt=mp3&text=${example.exampleEncode}`
                        : `https://zh.dict.naver.com/tts?service=zhkodict&from=pc&speaker=zh_cn&text=${example.exampleEncode}`
                    }
                  />
                </div>

                <div className={'dictNaver-ExamplePronun'}>
                  {example.expExample1Pronun}
                </div>

                <StrElm
                  className={'dictNaver-ExampleExtra'}
                  html={example.expExample2}
                />

                <div>
                  <a
                    className={'dictNaver-ExampleSource'}
                    href={example.sourceDictnameURL}
                  >
                    {example.sourceDictnameOri}
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default DictNaver
