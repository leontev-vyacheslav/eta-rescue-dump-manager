import { DeviceReaderHealthCheckModel } from './device-reader-health-check-model';
import { ExternalBridgeBaseModel } from './external-bridge-base-model';
import { RescueDumpServerModel } from './rescue-dump-server-model';

export type ExternalBridgeContextModel = ExternalBridgeBaseModel & {
  removeRescueDumpAsync: (rescueDumpServer: RescueDumpServerModel, fileId: string) => Promise<boolean>;

  getDeviceReadersHealthCheckAsync: (rescueDumpServer: RescueDumpServerModel, suppressLoader: boolean) => Promise<DeviceReaderHealthCheckModel[] | null>;
};