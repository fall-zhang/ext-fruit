import type { DictID } from '@/core/api-server/config'
import { Checkbox } from '@P/ui/components/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '@P/ui/components/field'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'

export interface DictTitleProps {
  dictID: DictID
  /** Supported languages */
  dictLangs: string
}
export const SortableListItem = (props: DictTitleProps) => {
  const { t } = useTranslation(['options', 'dicts'])
  const title = t(`dicts:${props.dictID}.name`)
  return <Field orientation="horizontal">
    <Checkbox
      id="finder-pref-9k2-external-disks-1yg-checkbox"
      name="finder-pref-9k2-external-disks-1yg-checkbox"
      defaultChecked
    />
    <FieldLabel
      htmlFor="finder-pref-9k2-external-disks-1yg-checkbox"
      className="font-normal"
    >
      <span className="saladict-dict-title flex items-center justify-start">
        <img
          className="saladict-dict-title-icon"
          src={'/src/core/api-server/trans-api/' + props.dictID + '/favicon.png'}
          // /src/core/api-server/trans-api/bing/favicon.png
          alt={`logo ${title}`}
        />
        <a
          className="saladict-dict-title-link"
          href="#"
          onClick={e => {
            e.stopPropagation()
            e.preventDefault()
          // openDictSrcPage(dictID, dictLangs)
          }}
        >
          {title}
        </a>
        <span>
          {props.dictLangs.split('').map((c, i) =>
            (c
              ? (
                <span className="ml-1 size-5 px-0.5 text-sm text-neutral-500 border border-neutral-500 rounded-xs" key={langCodes[i]}>
                  {t(`dict.lang.${langCodes[i]}`)}
                </span>
              )
              : null)
          )}
        </span>
      </span>
    </FieldLabel>
  </Field>
}

const langCodes = ['en', 'zhs', 'zht', 'ja', 'kor', 'fr', 'de', 'es'] as const
