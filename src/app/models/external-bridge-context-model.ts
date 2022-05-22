import { ExternalBridgeBaseModel } from './external-bridge-base-model';
import { RescueDumpServerModel } from './rescue-dump-server-model';

export type ExternalBridgeContextModel = ExternalBridgeBaseModel & {
  removeRescueDumpAsync: (rescueDumpServer: RescueDumpServerModel, fileId: string) => Promise<boolean>;
};