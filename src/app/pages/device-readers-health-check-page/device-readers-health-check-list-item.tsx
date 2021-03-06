import { DeviceReaderHealthCheckModel } from '../../models/device-reader-health-check-model';
import { ActiveServerIcon, FailIcon, LossIcon, SuccessIcon } from '../../components/icons';
import { useCallback } from 'react';
import { DeviceReadersHealthCheckListItemProps } from '../../models/device-readers-health-check-list-item-props';

export const DeviceReadersHealthCheckListItem = ({ item }: DeviceReadersHealthCheckListItemProps) => {
  const getDeviceReaderStatusColor = useCallback((item: DeviceReaderHealthCheckModel) => {
    return item.measurementDeviceCounter > 10 ?
      (
        item.successPercent > 50
          ? 'rgba(139, 195, 74, 1)'
          : (
              item.successPercent < 50 && item.successPercent > 10
                ? 'rgba(255, 193, 7, 1)'
                : 'rgba(244, 67, 54, 1)'
            )
      )
      : 'gray';
  }, []);

  return (
    <div className={'device-readers-health-check-list-item'}>
      <div className={'device-readers-health-check-list-item__content'}>
        <>
          <ActiveServerIcon size={20} color={getDeviceReaderStatusColor(item)} />
          <div>Device reader:</div>
          <div>
            {item.description} ({item.measurementDeviceCounter})
          </div>
        </>
        <>
          <SuccessIcon size={20} />
          <div>Success:</div>
          <div>
            {item.success} / {item.successPercent.toFixed(1)} %
          </div>
        </>
        <>
          <LossIcon size={20} />
          <div>Loss:</div>
          <div>
            {item.loss} / {item.lossPercent.toFixed(1)} %
          </div>
        </>
        <>
          <FailIcon size={20} />
          <div>Fail:</div>
          <div>
            {item.fail} / {item.failPercent.toFixed(1)} %
          </div>
        </>
      </div>
      <div className={'device-readers-health-check-list-item__button'}></div>
    </div>
  );
};