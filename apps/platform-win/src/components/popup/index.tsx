// import type { FC } from 'react'
// // import { AppConfig } from '@/app-config'
// // import { getConfig } from '@/_helpers/config-manager'
// import Popup from './Popup'
// import Notebook from './Notebook'
// import './_style.scss'
// import { createRoot } from 'react-dom/client'
// import type { AppConfig } from '../../app-config'
// import { getDefaultConfig } from '../../app-config'
// import { I18nextProvider, useTranslation } from 'react-i18next'
// import i18n from '../../locales/i18n'
// import type { Word } from '../../types/word'
// import { saveWord } from '../../core/database'
// import { genCtxText, translateCtxs } from '../../utils/translateCtx'

// // This is a workaround for browser action page
// // which does not fire beforeunload event

// const Title: FC = () => {
//   const { t } = useTranslation('popup')
//   return (
//     <title>{t('title')}</title>
//   )
// }

// async function showPanel (config: AppConfig) {
//   const root = createRoot(document.getElementById('root')!)
//   root.render(<I18nextProvider i18n={i18n}>
//     <Title />
//     <Popup config={config} />
//   </I18nextProvider>)
// }

// async function addNotebook () {
//   let hasError = false
//   let word: Word | undefined

//   const tabs = await browser.tabs.query({ active: true, currentWindow: true })
//   const tab = tabs[0]
//   if (tab && tab.id) {
//     if (word && word.text) {
//       try {
//         await saveWord('notebook', word)
//       } catch (err) {
//         hasError = true
//       }
//     }
//   } else {
//     hasError = true
//   }
//   const root = createRoot(document.getElementById('root')!)
//   root.render(<I18nextProvider>
//     <Notebook word={word} hasError={hasError} />
//   </I18nextProvider>)


//   // async get translations
//   if (word && word.context) {
//     const config = getDefaultConfig()
//     word.trans = genCtxText(
//       word.trans,
//       await translateCtxs(word.context || word.title, config.ctxTrans)
//     )
//     try {
//       await saveWord('notebook', word)
//     } catch (err) {
//       /* */
//     }
//   }
// }

function openOptions () {
}

async function sendContextMenusClick (menuItemId: string) {

}
