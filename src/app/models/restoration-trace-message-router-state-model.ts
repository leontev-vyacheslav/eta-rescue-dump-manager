import { TraceMessageRouterStateModel } from './trace-message-router-state-model';

export interface RestorationTraceMessageRouterStateModel extends TraceMessageRouterStateModel {
  fileId: string;

  securityPass: string;
}