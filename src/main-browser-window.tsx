import { BrowserWindow } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class MainBrowserWindow {
  mainWindow: BrowserWindow;

  constructor() {
    this.mainWindow = new BrowserWindow({
      show: false,
      height: 600,
      width: 800,
      autoHideMenuBar: true,
      frame: false,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: true,
        preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        allowRunningInsecureContent: false
      }
    });

    this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  }
}