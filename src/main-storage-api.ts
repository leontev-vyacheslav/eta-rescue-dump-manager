import * as path from 'path';
import * as fs from 'fs/promises';
import { app } from 'electron';

export const loadAppSettingsAsync = async () => {
  try {
    const appSettingsPath = path.join(app.getPath('appData'), 'app.settings.json');
    const json = await fs.readFile(appSettingsPath, 'utf-8');
    const appSettings = JSON.parse(json);
    global.appSettings = appSettings;

    return appSettings;
  } catch (error) {
    return null;
  }
};

export const storeAppSettingsAsync = async (appSettings: any) => {
  global.appSettings = appSettings;
  
  const appSettingsPath = path.join(app.getPath('appData'),'app.settings.json');
  await fs.writeFile(appSettingsPath, JSON.stringify(appSettings), 'utf-8');
};