import { RescueDumpListItemModel } from './rescue-dump-list-item-model';

export type RescueDumpListGroupModel = {
  index: number;
  key: string;
  items: RescueDumpListItemModel[];
};
