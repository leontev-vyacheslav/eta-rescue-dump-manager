import { List } from 'devextreme-react/ui/list';
import { MutableRefObject } from 'react';
import { DeviceReaderHealthStatusGroupModel } from './device-reader-health-status-group-model';

export type DeviceReadersHealthStatusListGroupProps = {
  component: MutableRefObject<List>;

  group: DeviceReaderHealthStatusGroupModel;
};