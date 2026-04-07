import { fetchDirtyDOM } from '@/core/api-server/utils/fetch-dom'

import {
  getText,
  getInnerHTML,
  getOuterHTML,
  handleNoResult,
  handleNetWorkError
} from '../../utils'
import type { OaldictResult, Idiom, Mean, Sense } from './type'
import type { DictSearchResult, GetSrcPageFunction, SearchFunction } from '../../api-common/search-type'


export const getSrcPage: GetSrcPageFunction = text => {
  return `https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=${text}`
}

const HOST = 'https://www.oxfordlearnersdictionaries.com'


type OaldictSearchResult = DictSearchResult<OaldictResult>

export const search: SearchFunction<OaldictResult> = (
  text
) => {
  return fetchDirtyDOM(
    'https://www.oxfordlearnersdictionaries.com/search/english/direct/?q=' +
      encodeURIComponent(text.replace(/\s+/g, ' '))
  )
    .catch(handleNetWorkError)
    .then(doc => handleDOM(doc))
}

function handleDOM (
  doc: Document
): OaldictSearchResult | Promise<OaldictSearchResult> {
  const result: OaldictResult = {
    title: '',
    idioms: [],
    senses: [],
    pron: { uk: {}, us: {} },
  }

  const main = doc.querySelector('#entryContent') as HTMLElement
  if (!main) {
    return handleNoResult()
  }

  const $symbol = main.querySelector('.symbols>a') as HTMLElement

  if ($symbol) {
    result.symbol = ($symbol.getAttribute('href') || '').split('level=')[1]
  }

  const $title = main.querySelector('.top-container .webtop') as HTMLElement

  if ($title) {
    result.title = getText($title, '.headword')
    result.pos = getText($title, '.pos')

    const $pron = Array.from($title.querySelectorAll(':scope>.phonetics>div'))

    $pron.forEach((pr, prI) => {
      const pronKey = prI ? 'us' : 'uk'
      const $sound = pr.querySelector('.sound') as HTMLElement
      let sound
      if ($sound) {
        sound = $sound.getAttribute('data-src-mp3') || undefined
      }
      const phon = getText(pr, '.phon')

      result.pron[pronKey].sound = sound
      result.pron[pronKey].phon = phon
    })
  }

  // senses_multiple senses_single and sensesPhrasal
  const $sensesLi = Array.from(main.querySelectorAll('.entry>ol>.sense'))

  const $senses = Array.from(main.querySelectorAll('.senses_multiple .shcut-g'))

  const $sensesPhrasal = Array.from(main.querySelectorAll('.entry>.pv-g'))

  function handleGetMeans ($mean: Element, sense: Sense) {
    const mean: Mean = {}

    const $symbols = $mean.querySelector('.sensetop .symbols>a') as HTMLElement

    if ($symbols) {
      mean.symbols = ($symbols.getAttribute('href') || '').split('level=')[1]
    }

    mean.grammar = getText($mean.querySelector('.grammar'))

    mean.labels = getText($mean.querySelector('.labels'))

    const $variantsType = $mean.querySelector('.variants') as HTMLElement

    if ($variantsType) {
      mean.variantsIsBlock = $variantsType.getAttribute('type') === 'vf'

      mean.variants = getInnerHTML(HOST, $mean, '.variants')
    }

    mean.use = getText($mean.querySelector('.use'))

    mean.cf = getText(
      $mean.querySelector(':scope>.cf') || $mean.querySelector('.sensetop>.cf')
    )

    mean.def = getText($mean.querySelector('.def'))

    mean.examples = getOuterHTML(HOST, $mean, '.examples')

    sense.means.push(mean)
  }

  // Judge whether it is wrapped by span label
  if ($sensesPhrasal.length) {
    result.isPhrasal = true

    $sensesPhrasal.forEach($mean => {
      const sense: Sense = {
        title: '',
        means: [],
      }

      const $title = $mean.querySelector('.top-container .pv') as HTMLElement

      if ($title) {
        sense.symbol = $title.getAttribute('cefr') || ''
        sense.title = getOuterHTML(HOST, $title)
      }

      const $variantsType = $mean.querySelector('.variants') as HTMLElement

      if ($variantsType) {
        sense.variants = getInnerHTML(HOST, $mean, '.variants')
      }

      const $sensesMultiP = Array.from(
        $mean.querySelectorAll('.senses_multiple .sense')
      )
      const $sensesSingleP = Array.from(
        $mean.querySelectorAll('.sense_single .sense')
      )
      ;(
        ($sensesMultiP.length && $sensesMultiP) ||
        ($sensesSingleP.length && $sensesSingleP) ||
        []
      ).map($m => handleGetMeans($m, sense))

      result.senses.push(sense)
    })
  } else if ($sensesLi.length) {
    const sense: Sense = {
      title: '',
      means: [],
    }
    $sensesLi.map($mean => handleGetMeans($mean, sense))
    result.senses.push(sense)
  } else {
    $senses.forEach($sense => {
      const sense: Sense = {
        title: '',
        means: [],
      }
      sense.title = getText($sense.querySelector('.shcut'))

      const $means = Array.from($sense.querySelectorAll('.sense'))

      $means.map($mean => handleGetMeans($mean, sense))

      result.senses.push(sense)
    })
  }

  const $origin = main.querySelector(
    '.senses_multiple>.collapse>span'
  ) as HTMLElement

  if ($origin && $origin.getAttribute('unbox') === 'wordorigin') {
    result.origin = getInnerHTML(HOST, $origin, '.body')
  }

  const $idioms = Array.from(main.querySelectorAll('.idioms .idm-g'))

  $idioms.forEach($idiom => {
    const idiom: Idiom = {}

    const $topC = $idiom.querySelector('.top-container')

    if ($topC) {
      idiom.title = getInnerHTML(HOST, $topC, '.webtop')
    }

    idiom.labels = getText($idiom.querySelector('.labels'))

    idiom.def = getText($idiom.querySelector('.def'))

    idiom.examples = getOuterHTML(HOST, $idiom, '.examples')

    result.idioms.push(idiom)
  })

  if (result.title || result.senses.length > 0 || result.idioms.length > 0) {
    return { result }
  }
  return handleNoResult()
}
