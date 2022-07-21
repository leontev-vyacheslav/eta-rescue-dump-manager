import { RouterPageBaseCommandModel } from './router-page-command';

export enum TraceMessageCommandName {
  createDump,
  restoration
}

export interface TraceMessageCommandModel extends RouterPageBaseCommandModel {
  name: TraceMessageCommandName;
}
