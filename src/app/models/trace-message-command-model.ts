export enum TraceMessageCommandName {
  createDump,
  restoration
}

export interface TraceMessageCommandModel {
  name: TraceMessageCommandName;
  serverName: string;
}
