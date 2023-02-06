import { OptionalEntityModel } from './optional-entity-model';
import { RescueDumpServerModel } from './rescue-dump-server-model';

export type AppSettingsModel = {
  invalidationCacheInterval: number;

  lastActiveRescueDumpServerId: number | null;

  rescueDumpServers: RescueDumpServerModel[];

  optionalEntities: OptionalEntityModel[];
};