import { useContext } from 'react'
import { WorkspaceSystemContext } from '../context/Workspace'
export const useWorkspaceSystem = () => {
  const systemConf = useContext(WorkspaceSystemContext)
  return systemConf
}
