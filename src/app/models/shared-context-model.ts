import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { AppSettingsModel } from './app-settings-model';
import { RescueDumpServerModel } from './rescue-dump-server-model';

export type SharedContextModel = {
  appSettings: AppSettingsModel;

  setAppSettings: Dispatch<SetStateAction<AppSettingsModel>>;

  refreshToken: string | null;

  setRefreshToken: Dispatch<SetStateAction<string | null>>;

  activeRescueDumpServer: RescueDumpServerModel;

  setIsShowLoadPanel: Dispatch<SetStateAction<boolean>>;

  collapsedRescueDumpListGroupKeys: MutableRefObject<string[]>;
};
