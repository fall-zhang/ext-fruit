import { SyncService, SyncServiceConstructor } from './interface'
import { Word } from '@/_helpers/record-manager'
import { notifyError } from './helpers'

const reqServices = require.context('./services', true, /index\.ts$/)

const Services = reqServices.keys().reduce((map, path) => {
  const Servicex = reqServices(path).Service
  return map.set(Servicex.id, Servicex)
}, new Map<string, SyncServiceConstructor>())

const activeServices: Map<string, SyncService> = new Map()

export async function syncServiceUpload (
  options:
    | {
      action: 'ADD'
      words?: Word[]
      force?: boolean
    } |
    {
      action: 'DELETE'
      dates?: number[]
      force?: boolean
    }
) {
  activeServices.forEach(async (service, id) => {
    try {
      if (options.action === 'ADD') {
        await service.add({ words: options.words, force: options.force })
      } else if (options.action === 'DELETE') {
        await service.delete({ dates: options.dates, force: options.force })
      }
    } catch (error) {
      notifyError(
        id,
        error,
        options.action === 'ADD' && options.words?.[0]
          ? `「${options.words?.[0].text}」`
          : ''
      )
    }
  })
}
