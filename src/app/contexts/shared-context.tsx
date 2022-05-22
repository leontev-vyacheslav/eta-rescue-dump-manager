import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Loader } from '../components/loader/loader';
import { AppSettingsModel } from '../models/app-settings-model';
import { RescueDumpServerModel } from '../models/rescue-dump-server-model';
import { SharedContextModel } from '../models/shared-context-model';

const SharedContext = createContext({} as SharedContextModel);

function SharedContextProvider(props: any) {
  const [isShowLoadPanel, setIsShowLoadPanel] = useState<boolean>(true);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettingsModel>(null);
  const collapsedRescueDumpListGroupKeys = useRef<number[]> ([]);

  const appSettingsReloadAsync = useCallback(async () => {
    const appSettings = await window.externalBridge.app.loadAppSettingsAsync();
    setAppSettings(
      appSettings
        ? appSettings
        : ({
            invalidationCacheInterval: 5,
            lastActiveRescueDumpServerId: null,
            rescueDumpServers: [] as RescueDumpServerModel[],
          } as AppSettingsModel)
    );
  }, []);

  useEffect(() => {
    (async () => {
      await appSettingsReloadAsync();
    })();
  }, [appSettingsReloadAsync, refreshToken]);

  useEffect (() => {
    window.externalBridge.app.appSettingsRescueDumpServerChanged( async (_: any, args: any) => {
      const updatedRescueDumpServer = args.updatedRescueDumpServer as RescueDumpServerModel;
      setAppSettings( previous => {
        const originRescueDumpServer = previous.rescueDumpServers.find(s => s.id == updatedRescueDumpServer.id);
        originRescueDumpServer.login = updatedRescueDumpServer.login;
        originRescueDumpServer.displayed = updatedRescueDumpServer.displayed;
        originRescueDumpServer.authToken = updatedRescueDumpServer.authToken;

        return previous;
      });
    });
  }, []);

  const activeRescueDumpServer = useMemo(() => {
    return appSettings ? appSettings.rescueDumpServers.find(s => s.id === appSettings.lastActiveRescueDumpServerId) : null;
  }, [appSettings]);

  return (<SharedContext.Provider value={{
    appSettings, setAppSettings,
    refreshToken, setRefreshToken,
    activeRescueDumpServer,
    setIsShowLoadPanel,
    collapsedRescueDumpListGroupKeys
  }} {...props}>
    {props.children}
    {isShowLoadPanel ? <Loader /> : null}
  </SharedContext.Provider>);
}

const useSharedContext = () => useContext(SharedContext);

export { SharedContextProvider, useSharedContext };