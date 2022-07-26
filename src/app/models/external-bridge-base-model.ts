import { AppSettingsModel } from './app-settings-model';
import { AuthTokenModel } from './auth-token-model';
import { DeviceReaderHealthStatusModel } from './device-reader-health-status-model';
import { FileCloudStorageFileInfo } from './file-cloud-storage-file-info';
import { LoginModel } from './login-model';
import { RescueDumpEntryModel } from './rescue-dump-entry-model';
import { RescueDumpListGroupModel } from './rescue-dump-list-group-model';
import { RescueDumpServerModel } from './rescue-dump-server-model';
import { TraceMessagingModel } from './trace-messaging-model';

type App = {
  appSettingsRescueDumpServerChanged: (handler: any) => void;

  toggleDevToolsAsync: () => Promise<void> | void;

  quitAppAsync: () => Promise<void> | void;

  storeAppSettingsAsync: (appSettings: AppSettingsModel) => Promise<void>;

  loadAppSettingsAsync: () => Promise<AppSettingsModel>;

  traceMessagingAsync: (rescueDumpServer: RescueDumpServerModel, traceMessaging: TraceMessagingModel) => Promise<void> | void;
}

type Logger = {
  write : (type: string, message: string) => Promise<void> | void;
}

type SignalR = {
  buildAsync: (rescueDumpServer: RescueDumpServerModel) => Promise<void>;

  startAsync: () => Promise<string>;

  stopAsync: () => Promise<void>;

  subscribe: (handler: any)=> Promise<void>;

  unsubscribe: ()=> Promise<void>;
};

type Data = {
  createRescueDumpAsync: (rescueDumpServer: RescueDumpServerModel) => Promise<boolean>;
}

export type ExternalBridgeBaseModel = {
  logger: Logger;

  signalR: SignalR;

  app: App;

  data: Data;

  removeRescueDumpGroupedListAsync: () => Promise<void>;

  getRescueDumpGroupedListAsync: (rescueDumpServer: RescueDumpServerModel) => Promise<RescueDumpListGroupModel[]>;

  uploadRescueDumpAsync:(rescueDumpServer: RescueDumpServerModel) => Promise<FileCloudStorageFileInfo>;

  getRescueDumpAsync: (rescueDumpServer: RescueDumpServerModel, fileId: string) => Promise<RescueDumpEntryModel[]>;

  saveTextFileAsync:  (fileName: string, pathName: string, text: string ) => Promise<void>;

  saveRescueDumpAsync: (rescueDumpServer: RescueDumpServerModel, fileId: string, fileName: string, pathName: string) => Promise<void>;

  saveRescueDumpAsAsync: (rescueDumpServer: RescueDumpServerModel, fileId: string, name: string) => Promise<void>;

  getRescueDumpContentAsync: (rescueDumpServer: RescueDumpServerModel, rescueDumpEntry: RescueDumpEntryModel) => Promise<string>;

  saveRescueDumpContentFileAsync: (rescueDumpServer: RescueDumpServerModel, fileId: string, name: string) => Promise<void>;

  getAuthTokenAsync: (rescueDumpServer: RescueDumpServerModel, login: LoginModel) => Promise<AuthTokenModel>;

  getDeviceReadersHealthStatusAsync: (rescueDumpServer: RescueDumpServerModel) => Promise<DeviceReaderHealthStatusModel[] | null>;
};