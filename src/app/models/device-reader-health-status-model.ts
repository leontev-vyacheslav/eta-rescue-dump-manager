import { Described, Entity } from './entity';

export interface DeviceReaderHealthStatusModel extends Entity<number>, Described {
  success: number;

  loss: number;

  fail: number;

  successPercent: number;

  lossPercent: number;

  failPercent: number;
}

export type DeviceReaderHealthStatusGroupModel = {
  index: number;
  key: string;
  items: DeviceReaderHealthStatusModel[];
};