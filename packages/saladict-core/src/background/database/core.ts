import Dexie from 'dexie'
import { Word } from '../../store/selection/types'

export class SaladictDB extends Dexie {
  // "@ts-expect-error"
  notebook: Dexie.Table<Word, number>
  // "@ts-expect-error"
  history: Dexie.Table<Word, number>
  // "@ts-expect-error"
  syncmeta: Dexie.Table<{ id: string; json: string }, string>

  constructor () {
    super('SaladictWords')

    this.version(1).stores({
      notebook: 'date,text,context,url',
      history: 'date,text,context,url',
      syncmeta: 'id'
    })

    // The following lines are needed if your typescript
    // is compiled using babel instead of tsc:
    this.notebook = this.table('notebook')
    this.history = this.table('history')
    this.syncmeta = this.table('syncmeta')
  }
}

let db: SaladictDB | undefined

export async function getDB () {
  if (!db) {
    db = new SaladictDB()
  }

  if (!db.isOpen()) {
    await db.open()
  }

  return db
}
