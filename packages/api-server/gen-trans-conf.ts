import type { DictItemBase, DictItemOption } from './types/dict-base'

type DictItem<Lang> = DictItemBase & DictItemOption<Lang>


export type ExtractLangFromConfig<Config> = Config extends DictItem<
  infer Lang
>
  ? Lang
  : never
