import { useState } from 'react';
import { AuthorizedIcon, FailIcon, LossIcon, SuccessIcon, TotalIcon, UnauthorizedIcon } from '../../components/icons';
import { useIsAuthRescueDumpServer } from '../../hooks/use-is-auth-rescue-dump-server';
import { DeviceReadersHealthStatusListGroupProps } from '../../models/device-readers-health-status-list-group-props';

export const DeviceReadersHealthStatusListGroup = ({ group, component }: DeviceReadersHealthStatusListGroupProps) => {
  const isAuth = useIsAuthRescueDumpServer();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  let totalDevices = 0;
  let totalSuccess = 0;
  let totalLoss = 0;
  let totalFail = 0;

  if (group.items) {
    totalDevices = group.items.reduce((a, b) => a + b.measurementDeviceCounter, 0);
    totalSuccess = group.items.reduce((a, b) => a + b.success, 0);
    totalLoss = group.items.reduce((a, b) => a + b.loss, 0);
    totalFail = group.items.reduce((a, b) => a + b.fail, 0);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer', gap: 10 }}
        onClick={async () => {
          if (!isCollapsed) {
            await component.current.instance.collapseGroup(group.index);
          } else {
            await component.current.instance.expandGroup(group.index);
          }
          setIsCollapsed(previous => !previous);
        }}
      >
        {isAuth(group.key) ? <AuthorizedIcon size={32} /> : <UnauthorizedIcon size={32} />}
        <span>{group.key}</span>
        <div style={{ marginLeft: 'auto', marginRight: 25 }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer', gap: 10, color: 'gray' }}>
            <SuccessIcon size={20} />
            <span style={{ marginTop: 3 }}>{totalSuccess}</span>
            <LossIcon size={20} />
            <span style={{ marginTop: 3 }}>{totalLoss}</span>
            <FailIcon size={20} />
            <span style={{ marginTop: 3 }}>{totalFail}</span>
            <TotalIcon size={20} />
            <span style={{ marginTop: 3 }}>{totalDevices}</span>
          </div>
        </div>
      </div>
    </div>
  );
};