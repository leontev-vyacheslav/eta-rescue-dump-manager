import { RouterStateBaseModel } from './router-state-base-model';

export enum TraceMessageCommandName {
  createDump,
  restoration
}

export interface TraceMessageRouterStateModel extends RouterStateBaseModel {
  name: TraceMessageCommandName;
}
