import { DeviceReaderHealthCheckPageModes } from './device-reader-health-check-page-modes';
import { RouterStateBaseModel } from './router-state-base-model';

export interface DeviceReaderHealthCheckRouterStateModel extends RouterStateBaseModel {
  mode: DeviceReaderHealthCheckPageModes;
}