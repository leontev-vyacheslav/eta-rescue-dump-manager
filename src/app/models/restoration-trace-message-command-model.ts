import { TraceMessageCommandModel } from './trace-message-command-model';

export interface RestorationTraceMessageCommandModel extends TraceMessageCommandModel {
  fileId: string;
  securityPass: string;
}