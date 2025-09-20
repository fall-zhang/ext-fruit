import { FC } from 'react'
import { parseLetter } from '../utils/parseLetter'
import { DocSection } from './doc-section/doc-section'

export const DocView:FC = () => {
  const docText = 'Let\'s do this.'
  const words = docText.split(' ')
  const sectionList = parseLetter(letter)
  return <div className="w-full flex items-center justify-center">
    <div className="w-3xl">
      {
        sectionList.map(item => {
          return <DocSection text={item.text} no={item.no} key={item.no}></DocSection>
        })
      }

    </div>
  </div>
}

const letter = `Adding custom styles

Best practices for adding your own custom styles in Tailwind projects.

Often the biggest challenge when working with a framework is figuring out what you’re supposed to do when there’s something you need that the framework doesn’t handle for you.

Tailwind has been designed from the ground up to be extensible and customizable, so that no matter what you’re building you never feel like you’re fighting the framework.

This guide covers topics like customizing your design tokens, how to break out of those constraints when necessary, adding your own custom CSS, and extending the framework with plugins.`

