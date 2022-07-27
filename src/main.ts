import * as path from 'path';
import * as fs from 'fs/promises';
import logger from 'electron-log';
import { HubConnectionBuilder, HubConnection } from '../patches/@microsoft/signalr';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { MainBrowserWindow } from './main-browser-window';
import {
  getAuthTokenAsync,
  getFileFromRescueDumpAsync,
  getRescueDumpAsync,
  getRescueDumpEntryList,
  getRescueDumpGroupedListAsync,
  removeRescueDumpGroupedListAsync,
  removeRescueDumpAsync,
  createRescueDumpAsync,
  sendRequestSecurityPass,
  traceMessagingAsync,
  restoreDatabaseAsync,
  uploadRescueDumpAsync,
  getDeviceReadersHealthCheckAsync
} from './main-rescue-dump-api';
import { loadAppSettingsAsync, storeAppSettingsAsync } from './main-storage-api';
import { LoginModel } from './app/models/login-model';
import { RescueDumpServerModel } from './app/models/rescue-dump-server-model';
import { TraceMessagingModel } from './app/models/trace-messaging-model';
import { AppSettingsModel } from './app/models/app-settings-model';
import { SecurityPassRequestModel } from './app/models/security-pass-request-model';
import { RestorationRequestModel } from './app/models/restoration-request-model';
import { RescueDumpEntryModel } from './app/models/rescue-dump-entry-model';

declare global {
  var appSettings: AppSettingsModel;
}

global.appSettings = {
  invalidationCacheInterval: 5,
  lastActiveRescueDumpServerId: null,
  rescueDumpServers: [] as RescueDumpServerModel[]
} as AppSettingsModel;

export let browserWindow: BrowserWindow = null;
let connect: HubConnection = null;

if (require('electron-squirrel-startup')) {
  app.quit();
}

app.on('ready', () => {
  const mainBrowserWindow = new MainBrowserWindow();
  browserWindow = mainBrowserWindow.mainWindow;

  if (!app.isPackaged) {
    browserWindow.webContents.openDevTools();
  }

  browserWindow.on('ready-to-show', () => {
    if (process.env.START_MINIMIZED) {
      browserWindow.minimize();
    } else {
      browserWindow.show();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    const mainBrowserWindow = new MainBrowserWindow();
    browserWindow = mainBrowserWindow.mainWindow;
  }
});

ipcMain.handle('log:write', async (_, args) => {
  const { type, message, }: { type: string, message: string } = args;
  if(message) {
    (logger as any)[type](message);
  }
});

ipcMain.handle('app:toggleDevToolsAsync', () => {
  browserWindow.webContents.toggleDevTools();
});

ipcMain.handle('app:appQuitAsync', () => {
  app.quit();
});

ipcMain.handle('signalr:buildAsync', async (_, args) => {
  const { rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel } = args;

  if (connect) {
    await connect.stop();
  }

  connect = new HubConnectionBuilder()
    .withUrl(`${rescueDumpServer.baseUrl}/app-hub`)
    .withAutomaticReconnect()
    .build();
});

ipcMain.handle('signalr:startAsync', async () => {
  await connect.start();
  return connect.connectionId;
});

ipcMain.handle('signalr:stopAsync', async () => {
  await connect.stop();
});

ipcMain.handle('signalr:subscribe', () => {
  if (connect) {
    connect.on('rescue-dump-service-notify-channel', (args) => {
      browserWindow.webContents.send('rescue-dump-service-notify-channel', args);
    });
  }
});

ipcMain.handle('signalr:unsubscribe', () => {
  if (connect) {
    connect.off('rescue-dump-service-notify-channel');
  }
});

ipcMain.handle('data:restoreDatabaseAsync', async (_, args) => {
  const { rescueDumpServer, restorationRequest }: { rescueDumpServer: RescueDumpServerModel, restorationRequest: RestorationRequestModel } = args;

  return await restoreDatabaseAsync(rescueDumpServer, restorationRequest);
});

ipcMain.handle('data:removeRescueDumpGroupedListAsync', async () => {
  return await removeRescueDumpGroupedListAsync();
});

ipcMain.handle('data:getRescueDumpGroupedListAsync', async (_, args) => {
  const { rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel } = args;

  return await getRescueDumpGroupedListAsync(rescueDumpServer);
});

ipcMain.handle('data:getRescueDumpAsync', async (_, args) => {
  const { rescueDumpServer, fileId }: { rescueDumpServer: RescueDumpServerModel, fileId: string } = args;

  return await getRescueDumpEntryList(rescueDumpServer, fileId);
});

ipcMain.handle('data:uploadRescueDumpAsync', async (_, args) => {
  const { rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel} = args;

  const openDialogOptions = await dialog.showOpenDialog(browserWindow, {
    defaultPath: app.getPath('desktop'),
    filters: [
      {
        name: 'Rescue Dumps',
        extensions: ['zip'],
      }
    ],
  });

  if (!openDialogOptions.canceled) {
    const filePath = openDialogOptions.filePaths.find(() => true);
    if(filePath) {
      return await uploadRescueDumpAsync(rescueDumpServer, filePath);
    }
  }

  return false;
});

ipcMain.handle('data:getRescueDumpContentAsync', async (_, args) => {
  const { rescueDumpServer, rescueDumpEntry }: { rescueDumpServer: RescueDumpServerModel, rescueDumpEntry: RescueDumpEntryModel } = args;

  return await getFileFromRescueDumpAsync(rescueDumpServer, rescueDumpEntry);
});

ipcMain.handle('data:saveRescueDumpAsync', async (_, args) => {
  const { rescueDumpServer, fileId, fileName, pathName }: { rescueDumpServer: RescueDumpServerModel; fileId: string; fileName: string, pathName: string } = args;

  const zip = await getRescueDumpAsync(rescueDumpServer, fileId);
  const filePath = path.join(app.getPath(pathName as any), `${fileName}.zip`);

  if (zip) {
    const content = zip.toBuffer();
    await fs.writeFile(filePath, content, 'binary');
  }
}),

ipcMain.handle('data:saveRescueDumpAsAsync', async (_, args) => {
  const { rescueDumpServer, fileId, name }: { rescueDumpServer: RescueDumpServerModel; fileId: string; name: string } = args;
  const filePath = path.join(app.getPath('desktop'), `${name}.zip`);

  const saveDialogOptions = await dialog.showSaveDialog(browserWindow, {
    defaultPath: filePath,
  });

  if (!saveDialogOptions.canceled && saveDialogOptions.filePath) {
    const zip = await getRescueDumpAsync(rescueDumpServer, fileId);

    if (zip) {
      const content = zip.toBuffer();
      await fs.writeFile(saveDialogOptions.filePath, content, 'binary');
    }
  }
});

ipcMain.handle('data:saveTextFileAsync', async (_, args) => {
  const { fileName, pathName, text }: { fileName: string, pathName: string, text: string } = args;
  const filePath = path.join(app.getPath(pathName as any), fileName);

  await fs.writeFile(filePath, text, 'utf-8');
});

ipcMain.handle('data:saveRescueDumpContentFileAsync', async (_, args) => {
  const { rescueDumpServer, fileId, name }: { rescueDumpServer: RescueDumpServerModel, fileId: string, name: string } = args;
  const filePath = path.join(app.getPath('desktop'), name);

  const saveDialogOptions = await dialog.showSaveDialog(browserWindow, {
    defaultPath: filePath
  });

  if (!saveDialogOptions.canceled && saveDialogOptions.filePath) {
    const zip = await getRescueDumpAsync(rescueDumpServer, fileId);

    if (zip) {
      const fileContent = zip.readAsText(name);
      await fs.writeFile(saveDialogOptions.filePath, fileContent, 'utf-8');
    }
  }
});

ipcMain.handle('data:removeRescueDumpAsync', async (_, args) => {
  const { fileId, rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel, fileId: string } = args;

  return await removeRescueDumpAsync(rescueDumpServer, fileId);
});

ipcMain.handle('data:createRescueDumpAsync', async (_, args) => {
  const { rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel } = args;

  return await createRescueDumpAsync(rescueDumpServer);
});

ipcMain.handle ('data:sendRequestSecurityPass', async (_, args) => {
  const { rescueDumpServer, securityPassRequest }: { rescueDumpServer: RescueDumpServerModel, securityPassRequest: SecurityPassRequestModel } = args;

  return await sendRequestSecurityPass(rescueDumpServer, securityPassRequest);
});

ipcMain.handle('app:traceMessagingAsync', async (_, args) => {
 const { rescueDumpServer, traceMessaging }: { rescueDumpServer: RescueDumpServerModel, traceMessaging: TraceMessagingModel } = args;

  return await traceMessagingAsync(rescueDumpServer, traceMessaging);
});

ipcMain.handle('app:getDeviceReadersHealthCheckAsync', async (_, args) => {
  const { rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel } = args;

   return await getDeviceReadersHealthCheckAsync(rescueDumpServer);
 });

ipcMain.handle('app:loadAppSettingsAsync', async () => {
  return await loadAppSettingsAsync();
});

ipcMain.handle('app:storeAppSettingsAsync', async (_, args) => {
  const { appSettings }: { appSettings: AppSettingsModel; } = args;
  global.appSettings = appSettings;

  return await storeAppSettingsAsync(appSettings);
});

ipcMain.handle('data:getAuthTokenAsync', async (_, args) => {
  const { rescueDumpServer, login }: { rescueDumpServer: RescueDumpServerModel, login: LoginModel } = args;

  return await getAuthTokenAsync(rescueDumpServer, login);
});