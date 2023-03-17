import * as path from 'path';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { app } from 'electron';
import axios, { AxiosError } from 'axios';
import Zip from 'adm-zip';
import { RescueDumpEntryModel } from './app/models/rescue-dump-entry-model';
import { SecurityPassRequestModel } from './app/models/security-pass-request-model';
import { RescueDumpListItemModel } from './app/models/rescue-dump-list-item-model';
import { RescueDumpListGroupModel } from './app/models/rescue-dump-list-group-model';
import { LoginModel } from './app/models/login-model';
import { AuthTokenModel } from './app/models/auth-token-model';
import { RescueDumpServerModel } from './app/models/rescue-dump-server-model';
import { TraceMessagingModel } from './app/models/trace-messaging-model';
import { RestorationRequestModel } from './app/models/restoration-request-model';
import { browserWindow } from './main';
import { storeAppSettingsAsync } from './main-storage-api';
import { FormData } from 'formdata-node';
// eslint-disable-next-line import/no-unresolved
import { fileFromPath } from 'formdata-node/file-from-path';
import fetch from 'node-fetch';

import { FileCloudStorageFileInfo } from './app/models/file-cloud-storage-file-info';
import { DeviceReaderHealthCheckModel } from './app/models/device-reader-health-check-model';
import { WebWorkerResourceUsageModel } from './app/models/web-worker-memory-usage';

type SimpleRescueDumpAsyncFunc = (rescueDumpServer: RescueDumpServerModel, optionalEntities: string[]) => Promise<boolean>;

export const getAuthTokenAsync = async (rescueDumpServer: RescueDumpServerModel, login: LoginModel) => {

  try {
    const response = await axios.request({
      url: `${rescueDumpServer.baseUrl}/account/token`,
      params: login,
      method: 'GET'
    });

    return response.data as AuthTokenModel;
   } catch (error) {

     return null;
  }
};

const updateAuthTokenAsync = async (error: unknown, rescueDumpServer: RescueDumpServerModel, callback: any) => {

  if((error as AxiosError).response && (error as AxiosError).response.status === 401 && rescueDumpServer.login) {
    const authToken = await getAuthTokenAsync(rescueDumpServer, rescueDumpServer.login);
    const updatedRescueDumpServer = { ...rescueDumpServer, authToken: authToken };
    appSettings.rescueDumpServers = [
      ...appSettings.rescueDumpServers.filter((s) => s.id !== rescueDumpServer.id),
      updatedRescueDumpServer
    ].sort((a, b) => a.id - b.id);

    await storeAppSettingsAsync(appSettings);

    if (callback instanceof Function) {
      await callback(updatedRescueDumpServer);

      browserWindow.webContents.send('app-settings-rescue-dump-server-changed', { updatedRescueDumpServer: updatedRescueDumpServer });
    }
  }
};

export const uploadRescueDumpAsync = async (rescueDumpServer: RescueDumpServerModel, filePath: string) => {
  if (existsSync(filePath)) {
    const fileName = path.parse(filePath).name;
    const ext = path.parse(filePath).ext;

    if(ext && ext.toLowerCase() !== '.zip') {
      return false;
    }

    const formData = new FormData();
    const file = await fileFromPath(filePath);

    if(file) {
      const zip = new Zip(Buffer.from(await file.arrayBuffer()));
      const isValid = zip.test();

      if(!isValid) {
        return false;
      }
    }

    formData.set('file', file, `${fileName}.zip`);

    const response = await fetch(`${rescueDumpServer.baseUrl}/api/files/upload`, {
      method: 'POST',
      body: formData as any,
      headers: {
        Authorization: `Bearer ${rescueDumpServer.authToken.token}`,
        Accept: 'application/json',
      },
    });
    if(response && response.status == 401) {
      let result = null;
      const error = {
        response: {
          status: 401
        }
      } as AxiosError;

      await updateAuthTokenAsync(error, rescueDumpServer, async (updatedRescueDumpServer: RescueDumpServerModel) => {
        result = await uploadRescueDumpAsync(updatedRescueDumpServer, filePath);
      });

      return result;
    }
    const result = await response.json() as FileCloudStorageFileInfo;

    return result;
  }

  return null;
};

export const getRescueDumpAsync = async (rescueDumpServer: RescueDumpServerModel, fileId: string) => {
  const rescueDumpFilePath = path.join(app.getPath('userData'), `${fileId}.zip`);
  let buffer = null;

  if (existsSync(rescueDumpFilePath)) {
    buffer = await fs.readFile(rescueDumpFilePath);
  } else {
    const response = await axios.request({ url: `${rescueDumpServer.baseUrl}/api/files/${fileId}`, method: 'GET', responseType: 'arraybuffer' });
    buffer = response.data;
    await fs.writeFile(rescueDumpFilePath, buffer);
  }

  const zip = new Zip(buffer);
  const isValid = zip.test();

  return isValid ? zip : null;
};

export const getRescueDumpEntryList = async (rescueDumpServer: RescueDumpServerModel, fileId: string) => {
  const zip = await getRescueDumpAsync(rescueDumpServer, fileId);

  if (zip) {
    const entries = zip.getEntries();

    return entries.map(i => {
      return {
        fileId: fileId,
        name: i.name,
        size: i.header.size,
        compressedSize: i.header.compressedSize,
        date: i.header.time
      } as RescueDumpEntryModel;
    });
  }

  return [] as RescueDumpEntryModel[];
};

export const removeRescueDumpAsync = async (rescueDumpServer: RescueDumpServerModel, fileId: string) => {
  try {
    const response = await axios.request({
      url: `${rescueDumpServer.baseUrl}/api/files/${fileId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${rescueDumpServer.authToken.token}`,
        Accept: 'application/json'
      }
    });

    return response.status === 200;
  } catch(error) {
    let result = false;
    await updateAuthTokenAsync(error, rescueDumpServer, async (updatedRescueDumpServer: RescueDumpServerModel) => {
      result = await removeRescueDumpAsync(updatedRescueDumpServer, fileId);
    });

     return result;
  }
};

export const createRescueDumpAsync: SimpleRescueDumpAsyncFunc = async (rescueDumpServer: RescueDumpServerModel, optionalEntities: string[]) => {
  try {
    await axios.request({
      url: `${rescueDumpServer.baseUrl}/api/rescue-dumps`,
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${rescueDumpServer.authToken.token}`,
        Accept: 'application/json'
      },
      data: optionalEntities
    });

    return true;
  } catch (error) {
    let result = false;
    await updateAuthTokenAsync(error, rescueDumpServer, async (updatedRescueDumpServer: RescueDumpServerModel) => {
      result = await createRescueDumpAsync(updatedRescueDumpServer, optionalEntities);
    });

    return result;
  }
};

export const getRescueDumpGroupedListAsync = async (rescueDumpServer: RescueDumpServerModel) => {
  if(!rescueDumpServer) {
    return [] as RescueDumpListGroupModel[];
  }

  const rescueDumpListFilePath = path.join(app.getPath('userData'), 'rescue-dump-list.json');
  let rawData = null;

  if (existsSync(rescueDumpListFilePath)) {
    const fileStat = await fs.stat(rescueDumpListFilePath);
    if (Date.now() - fileStat.mtimeMs < global.appSettings.invalidationCacheInterval) {
      const stringBuffer = await fs.readFile(rescueDumpListFilePath, 'utf8');
      rawData = JSON.parse(stringBuffer);
    }
  }

  if (!rawData) {
    const files = await axios.request({ url: `${rescueDumpServer.baseUrl}/api/files/everything`, method: 'GET' });
    await fs.writeFile(rescueDumpListFilePath, JSON.stringify(files.data), 'utf8');
    rawData = files.data;
  }

  return rawData
    .filter((group: any) => group.folder !== 'UNKNOWN')
    .map((group: any, index: number) => {
      return {
        index: index,
        key: group.folder,
        items: group.files.map((file: any) => {
          return {
            fileId: file.id,
            groupKey: group.folder,
            description: file.name,
            size: Math.trunc(file.size / 1024),
            date: file.createdTime,
          } as RescueDumpListItemModel;
        })
      } as RescueDumpListGroupModel;
    });
};

export const removeRescueDumpGroupedListAsync = async () => {
  const rescueDumpListFilePath = path.join(app.getPath('userData'), 'rescue-dump-list.json');
  if (existsSync(rescueDumpListFilePath)) {
    await fs.unlink(rescueDumpListFilePath);
  }
};

export const getFileFromRescueDumpAsync = async (rescueDumpServer: RescueDumpServerModel, rescueDumpEntry: RescueDumpEntryModel) => {
  const zip = await getRescueDumpAsync(rescueDumpServer, rescueDumpEntry.fileId);
  let fileContent = null;

  if(zip) {
    fileContent = zip.readAsText(rescueDumpEntry.name);
    fileContent = JSON.stringify(JSON.parse(fileContent), null, 2);
  }

  return fileContent;
};

export const restoreDatabaseAsync = async (rescueDumpServer: RescueDumpServerModel, restorationRequest: RestorationRequestModel) => {
  try {
    const queryString =
      `fileId=${restorationRequest.fileId}` +
      `&securityPass=${restorationRequest.securityPass}` +
      `${restorationRequest.optionalEntities.reduce((a, c) => a + `&optionalEntities=${c}`, '')}`;

    const response = await axios.request({
    url: `${rescueDumpServer.baseUrl}/api/rescue-dumps?${queryString}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${rescueDumpServer.authToken.token}`,
      Accept: 'application/json'
    }
  });
  return response.status === 200;
  } catch (error) {
    let result = false;

    await updateAuthTokenAsync(error, rescueDumpServer, async (updatedRescueDumpServer: RescueDumpServerModel) => {
      result = await restoreDatabaseAsync(updatedRescueDumpServer, restorationRequest);
    });

     return result;
  }
};

export const sendRequestSecurityPass = async (rescueDumpServer: RescueDumpServerModel, securityPassRequest: SecurityPassRequestModel) => {
  try {
    const response = await axios.request({
      url: `${rescueDumpServer.baseUrl}/api/rescue-dumps/send-security-pass`,
      method: 'POST',
      data: securityPassRequest,
      headers: {
        Authorization: `Bearer ${rescueDumpServer.authToken.token}`,
        Accept: 'application/json'
      }
    });

    return response.status === 200;
  } catch (error) {
    let result = false;

    await updateAuthTokenAsync(error, rescueDumpServer, async (updatedRescueDumpServer: RescueDumpServerModel) => {
      result = await sendRequestSecurityPass(updatedRescueDumpServer, securityPassRequest);
    });

     return result;
  }
};

export const traceMessagingAsync = async (rescueDumpServer: RescueDumpServerModel, traceMessaging: TraceMessagingModel) => {
  await axios.request({
    url: `${rescueDumpServer.baseUrl}/trace-messaging`,
    method: 'GET',
    params: traceMessaging
  });
};

export const getDeviceReadersHealthCheckAsync = async (rescueDumpServer: RescueDumpServerModel) => {
  try {
    const response = await axios.request({
      url: `${rescueDumpServer.baseUrl}/api/health-checks/device-readers`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${rescueDumpServer.authToken.token}`,
        Accept: 'application/json'
      }
    });

    return response.data as DeviceReaderHealthCheckModel[];
  } catch (error) {
    let result = null;

    await updateAuthTokenAsync(error, rescueDumpServer, async (updatedRescueDumpServer: RescueDumpServerModel) => {
      result = await getDeviceReadersHealthCheckAsync(updatedRescueDumpServer);
    });

    return result;
  }
};

export const getWebWorkerMemoryUsagesAsync = async (rescueDumpServer: RescueDumpServerModel) => {
  try {
    const response = await axios.request({
      url: `${rescueDumpServer.baseUrl}/api/web-worker-resource-usages`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${rescueDumpServer.authToken.token}`,
        Accept: 'application/json'
      }
    });

    return response.data as WebWorkerResourceUsageModel[];

  } catch (error) {
    let result = null;

    await updateAuthTokenAsync(error, rescueDumpServer, async (updatedRescueDumpServer: RescueDumpServerModel) => {
      result = await getWebWorkerMemoryUsagesAsync(updatedRescueDumpServer);
    });

    return result;
  }
};