import { useContext } from 'react'
import { SystemConfContext } from '../context/SystemConf'
export const useConfigSystem = () => {
  const systemConf = useContext(SystemConfContext)
  return systemConf
}
