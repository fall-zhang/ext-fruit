import { Checkbox } from '@P/ui/components/checkbox'

import { SortableListItem } from './sortable-list/sortable-list-item'

export function DictSortableList () {
  return (
    <div className='flex p-2 '>
      <Checkbox
        id="finder-pref-9k2-hard-disks-ljj-checkbox"
        name="finder-pref-9k2-hard-disks-ljj-checkbox"
        defaultChecked
      />
      <SortableListItem dictID='cobuild' dictLangs='' />
    </div>
  )
}
