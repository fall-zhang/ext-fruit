import type { AtomSearchResult } from '../../types/res-type'
import type { COBUILDResult, COBUILDColResult } from './type'
import { externalLink, getInnerHTML, getStaticSpeaker } from '../../utils/dom-utils'
import { handleNoResult } from '../../utils/error-response'

type CobuildSearchResult = AtomSearchResult<COBUILDResult>

export function handleDOM (
  doc: Document
): CobuildSearchResult | Promise<CobuildSearchResult> {
  const colResult: COBUILDColResult = {
    type: 'collins',
    sections: [],
  }
  const audio: { uk?: string; us?: string } = {}

  colResult.sections = [
    ...doc.querySelectorAll<HTMLDivElement>('[data-type-block]'),
  ]
    .filter($section => {
      const type = $section.dataset.typeBlock || ''
      return (
        type &&
        type !== 'Video' &&
        type !== 'Trends' &&
        type !== '英语词汇表' &&
        type !== '趋势'
      )
    })
    .map($section => {
      const type = $section.dataset.typeBlock || ''
      const title = $section.dataset.titleBlock || ''
      const num = $section.dataset.numBlock || ''
      const id = type + title + num
      const className = $section.className || ''

      if (type === 'Learner') {
        //   const $frequency = $section.querySelector<HTMLSpanElement>('.word-frequency-img')
        //   if ($frequency) {
        //     const star = Number($frequency.dataset.band)
        //     if (star) {
        //       result.star = star
        //     }
        //   }
        if (!audio.uk) {
          const mp3 = getAudio($section)
          if (mp3) {
            audio.uk = mp3
          }
        }
      } else if (type === 'English') {
        audio.uk = getAudio($section)
      } else if (type === 'American') {
        audio.us = getAudio($section)
      }

      const $video = $section.querySelector<HTMLDivElement>('#videos .video')
      if ($video) {
        const $youtubeVideo = $video.querySelector<HTMLDivElement>(
          '.youtube-video'
        )
        if ($youtubeVideo && $youtubeVideo.dataset.embed) {
          const width = 240 - 25
          const height = (width / 560) * 315
          return {
            id,
            className,
            type,
            title,
            num,
            content: `<iframe width="${width}" height="${height}" src="https://www.youtube-nocookie.com/embed/${$youtubeVideo.dataset.embed}" frameborder="0" allow="accelerometer; encrypted-media"></iframe>`,
          }
        }
      }

      $section
        .querySelectorAll<HTMLAnchorElement>('.audio_play_button')
        .forEach($speaker => {
          $speaker.replaceWith(getStaticSpeaker($speaker.dataset.srcMp3))
        })

      // so that clicking won't trigger in-panel search
      $section
        .querySelectorAll<HTMLAnchorElement>('a.type-thesaurus')
        .forEach(externalLink)

      return {
        id,
        className,
        type,
        title,
        num,
        content: getInnerHTML('https://www.collinsdictionary.com', $section
        ),
      }
    })

  if (colResult.sections.length > 0) {
    return { result: colResult, audio }
  }

  return handleNoResult()
}

function getAudio ($section: HTMLElement): string | undefined {
  const $audio = $section.querySelector<HTMLAnchorElement>(
    '.pron .audio_play_button'
  )
  if ($audio) {
    const src = $audio.dataset.srcMp3
    if (src) {
      return src
    }
  }
}
