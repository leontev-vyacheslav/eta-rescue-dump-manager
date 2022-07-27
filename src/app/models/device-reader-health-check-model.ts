import { Entity } from './entity';
import { Described } from './described';


export interface DeviceReaderHealthCheckModel extends Entity<number>, Described {
  measurementDeviceCounter: number;

  success: number;

  loss: number;

  fail: number;

  successPercent: number;

  lossPercent: number;

  failPercent: number;
}
