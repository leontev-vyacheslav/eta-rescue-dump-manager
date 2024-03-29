import List from 'devextreme-react/list';
import { MutableRefObject } from 'react';
import { RescueDumpListGroupModel } from './rescue-dump-list-group-model';

export type RescueDumpListGroupProps = {
  component: MutableRefObject<List>;

  group: RescueDumpListGroupModel;
};
