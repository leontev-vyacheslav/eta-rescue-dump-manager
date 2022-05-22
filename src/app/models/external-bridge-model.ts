import { ExternalBridgeBaseModel } from './external-bridge-base-model';
import { RescueDumpServerModel } from './rescue-dump-server-model';
import { RestorationRequestModel } from './restoration-request-model';
import { SecurityPassRequestModel } from './security-pass-request-model';

export type ExternalBridgeModel = ExternalBridgeBaseModel & {
  restoreDatabaseAsync: (rescueDumpServer: RescueDumpServerModel, restorationRequest: RestorationRequestModel) => Promise<void>;
  removeRescueDumpAsync: (rescueDumpServer: RescueDumpServerModel, fileId: string) => Promise<boolean>;
  createRescueDumpAsync: (rescueDumpServer: RescueDumpServerModel) => Promise<boolean>;
  sendRequestSecurityPass: (rescueDumpServer: RescueDumpServerModel, securityPassRequest: SecurityPassRequestModel) => Promise<boolean>;
}