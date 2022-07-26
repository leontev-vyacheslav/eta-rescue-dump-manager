import { ipcRenderer, contextBridge } from 'electron';
import { AppSettingsModel } from './app/models/app-settings-model';
import { ExternalBridgeModel } from './app/models/external-bridge-model';
import { LoginModel } from './app/models/login-model';
import { RescueDumpEntryModel } from './app/models/rescue-dump-entry-model';
import { RescueDumpServerModel } from './app/models/rescue-dump-server-model';
import { RestorationRequestModel } from './app/models/restoration-request-model';
import { SecurityPassRequestModel } from './app/models/security-pass-request-model';
import { TraceMessagingModel } from './app/models/trace-messaging-model';

contextBridge.exposeInMainWorld('externalBridge', {

  logger: {
    write: async (type: string, message: string) => {
      return await ipcRenderer.invoke('log:write', { type: type, message: message });
    },
  },

  signalR: {
    buildAsync: async (rescueDumpServer: RescueDumpServerModel) => {
      return await ipcRenderer.invoke('signalr:buildAsync', { rescueDumpServer: rescueDumpServer });
    },

    startAsync: async () => {
      return await ipcRenderer.invoke('signalr:startAsync');
    },

    stopAsync: async () => {
      return await ipcRenderer.invoke('signalr:stopAsync');
    },

    subscribe: async (handler: any) => {
      ipcRenderer.removeAllListeners('rescue-dump-service-notify-channel');
      ipcRenderer.on('rescue-dump-service-notify-channel', handler);

      return await ipcRenderer.invoke('signalr:subscribe');
    },

    unsubscribe: async () => {
      ipcRenderer.removeAllListeners('rescue-dump-service-notify-channel');

      return await ipcRenderer.invoke('signalr:unsubscribe');
    },
  },

  app: {
    appSettingsRescueDumpServerChanged: (handler: any) => {
      ipcRenderer.on('app-settings-rescue-dump-server-changed', handler);
    },

    toggleDevToolsAsync: async() => {
      return await ipcRenderer.invoke('app:toggleDevToolsAsync');
    },

    quitAppAsync: async () => {
      return await ipcRenderer.invoke('app:appQuitAsync');
    },

    storeAppSettingsAsync: async (appSettings: AppSettingsModel) => {
      return await ipcRenderer.invoke('app:storeAppSettingsAsync', { appSettings });
    },

    loadAppSettingsAsync: async () => {
      return await ipcRenderer.invoke('app:loadAppSettingsAsync');
    },

    traceMessagingAsync: async (rescueDumpServer: RescueDumpServerModel, traceMessaging: TraceMessagingModel) => {
      return await ipcRenderer.invoke('app:traceMessagingAsync', { rescueDumpServer, traceMessaging });
    }
  },

  data: {
    createRescueDumpAsync: async (rescueDumpServer: RescueDumpServerModel) => {
      return await ipcRenderer.invoke('data:createRescueDumpAsync', { rescueDumpServer });
    },
  },

  restoreDatabaseAsync : async (rescueDumpServer: RescueDumpServerModel, restorationRequest: RestorationRequestModel) => {
    return await ipcRenderer.invoke('data:restoreDatabaseAsync', { rescueDumpServer: rescueDumpServer, restorationRequest: restorationRequest });
  },

  removeRescueDumpGroupedListAsync: async (rescueDumpServer: RescueDumpServerModel) => {
    return await ipcRenderer.invoke('data:removeRescueDumpGroupedListAsync', { rescueDumpServer: rescueDumpServer });
  },

  getRescueDumpGroupedListAsync: async (rescueDumpServer: RescueDumpServerModel) => {
    return await ipcRenderer.invoke('data:getRescueDumpGroupedListAsync', { rescueDumpServer: rescueDumpServer });
  },

  uploadRescueDumpAsync: async (rescueDumpServer: RescueDumpServerModel) => {
    return await ipcRenderer.invoke('data:uploadRescueDumpAsync', { rescueDumpServer: rescueDumpServer });
  },

  getRescueDumpAsync: async (rescueDumpServer: RescueDumpServerModel, fileId: string) => {
    return await ipcRenderer.invoke('data:getRescueDumpAsync', { rescueDumpServer: rescueDumpServer, fileId: fileId });
  },

  saveTextFileAsync:  async (fileName: string, pathName: string, text: string ) => {
    return await ipcRenderer.invoke('data:saveTextFileAsync', { fileName: fileName, pathName: pathName, text: text });
  },

  saveRescueDumpAsAsync: async (rescueDumpServer: RescueDumpServerModel, fileId: string, name: string) => {
    return await ipcRenderer.invoke('data:saveRescueDumpAsAsync', { rescueDumpServer: rescueDumpServer, fileId: fileId, name: name });
  },

  saveRescueDumpAsync: async (rescueDumpServer: RescueDumpServerModel, fileId: string, fileName: string, pathName: string) => {
    return await ipcRenderer.invoke('data:saveRescueDumpAsync', { rescueDumpServer: rescueDumpServer, fileId: fileId, fileName: fileName, pathName: pathName });
  },

  getRescueDumpContentAsync: async (rescueDumpServer: RescueDumpServerModel, rescueDumpEntry: RescueDumpEntryModel) => {
    return await ipcRenderer.invoke('data:getRescueDumpContentAsync', { rescueDumpServer: rescueDumpServer, rescueDumpEntry: rescueDumpEntry });
  },

  saveRescueDumpContentFileAsync: async (rescueDumpServer: RescueDumpServerModel, fileId: string, name: string) => {
    return await ipcRenderer.invoke('data:saveRescueDumpContentFileAsync', { rescueDumpServer: rescueDumpServer, fileId: fileId, name: name });
  },

  removeRescueDumpAsync: async (rescueDumpServer: RescueDumpServerModel, fileId: string) => {
    return await ipcRenderer.invoke('data:removeRescueDumpAsync', { rescueDumpServer, fileId });
  },

  sendRequestSecurityPass: async (rescueDumpServer: RescueDumpServerModel, securityPassRequest: SecurityPassRequestModel) => {
    return await ipcRenderer.invoke('data:sendRequestSecurityPass', { rescueDumpServer, securityPassRequest });
  },

  getAuthTokenAsync: async (rescueDumpServer: RescueDumpServerModel, login: LoginModel) => {
    return await ipcRenderer.invoke('data:getAuthTokenAsync', { rescueDumpServer: rescueDumpServer, login: login });
  },

  getDeviceReadersHealthStatusAsync: async (rescueDumpServer: RescueDumpServerModel) => {
    return await ipcRenderer.invoke('app:getDeviceReadersHealthStatusAsync', { rescueDumpServer: rescueDumpServer });
  }
} as ExternalBridgeModel);