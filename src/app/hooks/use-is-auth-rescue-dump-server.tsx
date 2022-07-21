import { useCallback } from 'react';
import { useSharedContext } from '../contexts/shared-context';

export const useIsAuthRescueDumpServer = () => {
  const { appSettings } = useSharedContext();

  return useCallback((serverName: string) => {
    const rescueDumpServer = appSettings.rescueDumpServers.find(s => s.name === serverName);
    return rescueDumpServer != undefined && rescueDumpServer.authToken !== null;
  }, [appSettings]);
};