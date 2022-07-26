import { createContext, useCallback, useContext } from 'react';
import { ExternalBridgeModel } from '../models/external-bridge-model';
import { ExternalBridgeContextModel } from '../models/external-bridge-context-model';
import { useSharedContext } from './shared-context';
import { LoginModel } from '../models/login-model';
import { RescueDumpServerModel } from '../models/rescue-dump-server-model';
import { RescueDumpEntryModel } from '../models/rescue-dump-entry-model';

declare global {
  interface Window {
    externalBridge: ExternalBridgeModel;
  }
}

const ExternalBridgeContext = createContext<ExternalBridgeContextModel>({} as ExternalBridgeContextModel);

const ExternalBridgeContextProvider = (props: any) => {
  const { setIsShowLoadPanel } = useSharedContext();

  const getAuthTokenAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel, login: LoginModel) => {
    try {
      setIsShowLoadPanel(true);

      return await window.externalBridge.getAuthTokenAsync(rescueDumpServer, login);
    } finally {
      setIsShowLoadPanel(false);
    }
  }, [setIsShowLoadPanel]);

  const removeRescueDumpGroupedListAsync = useCallback(async () => {
    await window.externalBridge.removeRescueDumpGroupedListAsync();
  }, []);

  const getRescueDumpGroupedListAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel) => {
    try {
      setIsShowLoadPanel(true);
      return await window.externalBridge.getRescueDumpGroupedListAsync(rescueDumpServer);

    } finally {
      setIsShowLoadPanel(false);
    }
  }, [setIsShowLoadPanel]);

  const saveRescueDumpAsAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel, fileId: string, name: string) => {
    try {
      setIsShowLoadPanel(true);

      return await window.externalBridge.saveRescueDumpAsAsync(rescueDumpServer, fileId, name);
    } finally {
      setIsShowLoadPanel(false);
    }
  }, [setIsShowLoadPanel]);

  const getRescueDumpAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel, fileId: string) => {
    try {
      setIsShowLoadPanel(true);

      return await window.externalBridge.getRescueDumpAsync(rescueDumpServer, fileId);
    } finally {
      setIsShowLoadPanel(false);
    }
  }, [setIsShowLoadPanel]);

  const getRescueDumpContentAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel, rescueDumpEntry: RescueDumpEntryModel) => {

    try {
      setIsShowLoadPanel(true);

      return await window.externalBridge.getRescueDumpContentAsync(rescueDumpServer, rescueDumpEntry);
    } finally {
      setIsShowLoadPanel(false);
    }
  }, [setIsShowLoadPanel]);

  const saveRescueDumpContentFileAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel, fileId: string, name: string) => {
    await window.externalBridge.saveRescueDumpContentFileAsync(rescueDumpServer, fileId, name);
  }, []);

  const removeRescueDumpAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel, fileId: string) => {
    try {
      setIsShowLoadPanel(true);

      return await window.externalBridge.removeRescueDumpAsync(rescueDumpServer, fileId);
    } finally {
      setIsShowLoadPanel(false);
    }
  }, [setIsShowLoadPanel]);

  const createRescueDumpAsync = useCallback(async (rescueDumpServer: RescueDumpServerModel) => {
    try {
      setIsShowLoadPanel(true);
        return rescueDumpServer ? await window.externalBridge.data.createRescueDumpAsync(rescueDumpServer): false;
    } finally {
      setIsShowLoadPanel(false);
    }
  }, [setIsShowLoadPanel]);

  return <ExternalBridgeContext.Provider value={{
    removeRescueDumpGroupedListAsync,
    getRescueDumpGroupedListAsync,
    getRescueDumpAsync,
    getRescueDumpContentAsync,
    saveRescueDumpAsAsync,
    saveRescueDumpContentFileAsync,
    getAuthTokenAsync,
    removeRescueDumpAsync,
    createRescueDumpAsync
  }} {...props} />;
};

const useExternalBridgeContext = () => useContext(ExternalBridgeContext);

export { ExternalBridgeContextProvider, useExternalBridgeContext };