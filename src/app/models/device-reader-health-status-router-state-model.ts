import { DeviceReaderHealthStatusPageModes } from './device-reader-health-status-page-modes';
import { RouterStateBaseModel } from './router-state-base-model';

export interface DeviceReaderHealthStatusRouterStateModel extends RouterStateBaseModel {
  mode: DeviceReaderHealthStatusPageModes;
}