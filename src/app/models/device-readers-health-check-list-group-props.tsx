import { List } from 'devextreme-react/list';
import { MutableRefObject } from 'react';
import { DeviceReaderHealthCheckGroupModel } from './device-reader-health-check-group-model';

export type DeviceReadersHealthCheckListGroupProps = {
  component: MutableRefObject<List>;

  group: DeviceReaderHealthCheckGroupModel;
};