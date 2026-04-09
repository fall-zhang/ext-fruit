import Database from '@tauri-apps/plugin-sql'
import type { Word } from '../../types/word'

let db: Database | undefined

/**
 * 获取数据库实例（单例模式）
 */
export async function getDB (): Promise<Database> {
  if (!db) {
    db = await Database.load('sqlite:saladict.db')
    await initializeTables(db)
  }
  return db
}

/**
 * 初始化数据库表结构
 */
async function initializeTables (db: Database): Promise<void> {
  // 创建 notebook 表
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notebook (
      date INTEGER PRIMARY KEY,
      text TEXT NOT NULL,
      context TEXT DEFAULT '',
      trans TEXT DEFAULT '',
      note TEXT DEFAULT '',
      from TEXT,
      to TEXT
    )
  `)

  // 创建 history 表
  await db.execute(`
    CREATE TABLE IF NOT EXISTS history (
      date INTEGER PRIMARY KEY,
      text TEXT NOT NULL,
      context TEXT DEFAULT '',
      trans TEXT DEFAULT '',
      note TEXT DEFAULT '',
      from TEXT,
      to TEXT
    )
  `)

  // 创建索引以提高查询性能
  await db.execute('CREATE INDEX IF NOT EXISTS idx_notebook_text ON notebook(text)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_notebook_context ON notebook(context)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_notebook_url ON notebook(from)')

  await db.execute('CREATE INDEX IF NOT EXISTS idx_history_text ON history(text)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_history_context ON history(context)')
  await db.execute('CREATE INDEX IF NOT EXISTS idx_history_url ON history(from)')
}

/**
 * 将数据库查询结果转换为 Word 对象
 */
export function rowToWord (row: Record<string, unknown>): Word {
  return {
    date: Number(row.date),
    text: String(row.text),
    context: String(row.context || ''),
    trans: String(row.trans || ''),
    note: String(row.note || ''),
    from: row.from ? String(row.from) : undefined,
    to: row.to ? String(row.to) : undefined,
  }
}

/**
 * 关闭数据库连接
 */
export async function closeDB (): Promise<void> {
  if (db) {
    await db.close()
    db = undefined
  }
}
