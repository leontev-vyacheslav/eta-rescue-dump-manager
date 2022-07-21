import { List } from 'devextreme-react/ui/list';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DeviceReaderHealthStatusGroupModel } from '../../models/device-reader-health-status-group-model';
import { DeviceReaderHealthStatusModel } from '../../models/device-reader-health-status-model';
import { PageToolbar } from '../../components/page-toolbar/page-toolbar';
import { useSharedContext } from '../../contexts/shared-context';
import { useLocation } from 'react-router-dom';
import { RouterStateBaseModel } from '../../models/router-state-base-model';
import { useIsAuthRescueDumpServer } from '../../hooks/use-is-auth-rescue-dump-server';
import { ActiveServerIcon, SuccessIcon, LossIcon, FailIcon, AuthorizedIcon, UnauthorizedIcon, TotalIcon } from '../../components/icons';
import './device-readers-health-status-list-item.css';


export const DeviceReadersHealthStatusPage = () => {
  const listRef = useRef<List>(null);
  const { appSettings } = useSharedContext();
  const [deviceReadersHealthStatusGroupedList, setDeviceReadersHealthStatusGroupList] = useState<DeviceReaderHealthStatusGroupModel[]>([]);
  const { state } = useLocation();
  const isAuth = useIsAuthRescueDumpServer();
  const routerPageBaseCommand = state as RouterStateBaseModel;

  useEffect(() => {
    if (routerPageBaseCommand) {
      (async () => {
        const selectedRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name == routerPageBaseCommand.serverName);
        const deviceReadersHealthStatuses = await window.externalBridge.getDeviceReadersHealthStatusAsync(selectedRescueDumpServer);

        setDeviceReadersHealthStatusGroupList((previous) => {
          return [
            ...previous,
            {
              index: 1,
              key: routerPageBaseCommand.serverName,
              items: deviceReadersHealthStatuses,
            },
          ];
        });
      })();
    }
  }, [appSettings, routerPageBaseCommand]);

  const getDeviceReaderStatusColor =useCallback( (item: DeviceReaderHealthStatusModel) => {

    return item.successPercent > 50
    ? 'rgba(139, 195, 74, 1)'
    : (
        item.successPercent < 50 && item.successPercent > 10
        ? 'rgba(255, 193, 7, 1)'
        : 'rgba(244, 67, 54, 1)'
      );
  }, []);

  return (
    <>
      <PageToolbar title={'Device readers health status list'} menuItems={null} />
      {deviceReadersHealthStatusGroupedList ? (
        <List
        id='rescue-dump-list'
        ref={listRef}
        className={'app-view-container rescue-dump-list'}
        dataSource={deviceReadersHealthStatusGroupedList}
        displayExpr={'description'}
        selectionMode={'single'}
        grouped
        groupRender={(group: DeviceReaderHealthStatusGroupModel) => {
          const totalDevices = group.items.reduce((a, b) => a + b.measurementDeviceCounter, 0);
          const totalSuccess = group.items.reduce((a, b) => a + b.success, 0);
          const totalLoss = group.items.reduce((a, b) => a + b.loss, 0);
          const totalFail = group.items.reduce((a, b) => a + b.fail, 0);

            return (
              <div style={{ display: 'flex', alignItems: 'center' }} >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer', gap: 10 }}>
                {isAuth(group.key) ? <AuthorizedIcon size={32} /> : <UnauthorizedIcon size={32} />}
                  <span>{group.key}</span>
                  <div style={{ marginLeft: 'auto', marginRight: 25 }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer', gap: 10,  color: 'gray' }}>
                      <SuccessIcon size={20} />
                      <span>{totalSuccess}</span>
                      <LossIcon size={20} />
                      <span>{totalLoss}</span>
                      <FailIcon size={20} />
                      <span>{totalFail}</span>
                      <TotalIcon size={20} />
                      <span>{totalDevices}</span>
                    </div>
                  </div>
                </div>
                </div>
            );
        }}
        itemRender={(item: DeviceReaderHealthStatusModel) => {
          return (
            <div className={'device-readers-health-status-list-item'}>
              <div className={'device-readers-health-status-list-item__content'}>
                <>
                  <ActiveServerIcon size={20} color={getDeviceReaderStatusColor(item)}/>
                  <div>Device reader:</div>
                  <div>{item.description} ({item.measurementDeviceCounter})</div>
                </>
                <>
                  <SuccessIcon size={20} />
                  <div>Success:</div>
                  <div>{item.success} / {item.successPercent.toFixed(1)} %</div>
                </>
                <>
                  <LossIcon size={20} />
                  <div>Loss:</div>
                  <div>{item.loss} / {item.lossPercent.toFixed(1)} %</div>
                </>
                <>
                  <FailIcon size={20} />
                  <div>Fail:</div>
                  <div>{item.fail} / {item.failPercent.toFixed(1)} %</div>
                </>
              </div>
              <div className={'device-readers-health-status-list-item__button'}>

              </div>
            </div>
          );
        } }
      />
      ) : (
        <div style={{ overflow: 'hidden', height: 'calc(100vh - 70px)' }} className={'app-view-container dx-scrollable rescue-dump-list'}>
          <span className='dx-empty-message'>No data to display</span>
        </div>
      )}
    </>
  );
};


