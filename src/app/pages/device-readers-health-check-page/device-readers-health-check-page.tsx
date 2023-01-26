import './device-readers-health-check-list-item.css';
import { List } from 'devextreme-react/ui/list';
import { useEffect, useRef, useState } from 'react';
import { DeviceReaderHealthCheckGroupModel } from '../../models/device-reader-health-check-group-model';
import { DeviceReaderHealthCheckModel } from '../../models/device-reader-health-check-model';
import { PageToolbar } from '../../components/page-toolbar/page-toolbar';
import { useSharedContext } from '../../contexts/shared-context';
import { useLocation } from 'react-router-dom';
import { DeviceReaderHealthCheckRouterStateModel } from '../../models/device-reader-health-check-router-state-model';
import { DeviceReaderHealthCheckPageModes } from '../../models/device-reader-health-check-page-modes';
import { DeviceReadersHealthCheckListGroup } from './device-readers-health-check-list-group';
import { DeviceReadersHealthCheckListItem } from './device-readers-health-check-list-item';
import { useExternalBridgeContext } from '../../contexts/external-bridge-context';

export const DeviceReadersHealthCheckPage = () => {
  const listRef = useRef<List>(null);
  const { appSettings, refreshToken, setIsShowLoadPanel } = useSharedContext();
  const { getDeviceReadersHealthCheckAsync } = useExternalBridgeContext();
  const [deviceReadersHealthCheckGroupedList, setDeviceReadersHealthCheckGroupList] = useState<DeviceReaderHealthCheckGroupModel[] | null>(null);
  const { state } = useLocation();
  const routerPageCommand = state as DeviceReaderHealthCheckRouterStateModel;

  useEffect(() => {
    (async () => {
      const list: DeviceReaderHealthCheckGroupModel[] = [];
      if (!appSettings || !appSettings.rescueDumpServers || !routerPageCommand) {
        return;
      }
      let index = 0;
      if (routerPageCommand.mode === DeviceReaderHealthCheckPageModes.multiple) {
        try {
          setIsShowLoadPanel(true);
          for (const rescueDumpServer of appSettings.rescueDumpServers) {
            const deviceReadersHealthChecks = await getDeviceReadersHealthCheckAsync(rescueDumpServer, true);

            if (deviceReadersHealthChecks) {
              const item = {
                index: index++,
                key: rescueDumpServer.name,
                items: deviceReadersHealthChecks,
              } as DeviceReaderHealthCheckGroupModel;
              list.push(item);
            }
          }
         }
         finally {
          setIsShowLoadPanel(false);
        }

        setDeviceReadersHealthCheckGroupList(list);
      } else {
        const selectedRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name === routerPageCommand.serverName);

        if (selectedRescueDumpServer) {
          const deviceReadersHealthChecks = await getDeviceReadersHealthCheckAsync(selectedRescueDumpServer);
          if (deviceReadersHealthChecks) {
            const item = {
              index: index,
              key: routerPageCommand.serverName,
              items: deviceReadersHealthChecks,
            } as DeviceReaderHealthCheckGroupModel;

            setDeviceReadersHealthCheckGroupList((previous) => {
              return previous ? [...previous, item] : [item];
            });
          }
        }
      }
    })();
  }, [appSettings, routerPageCommand, refreshToken, getDeviceReadersHealthCheckAsync, setIsShowLoadPanel]);

  return (
    <>
      <PageToolbar title={'Device readers health status list'} menuItems={null} />
      {deviceReadersHealthCheckGroupedList ? (
        <List
          id='rescue-dump-list'
          ref={listRef}
          className={'app-view-container rescue-dump-list'}
          dataSource={deviceReadersHealthCheckGroupedList}
          displayExpr={'description'}
          selectionMode={'single'}
          grouped
          groupRender={(group: DeviceReaderHealthCheckGroupModel) => <DeviceReadersHealthCheckListGroup component={listRef} group={group} />}
          itemRender={(item: DeviceReaderHealthCheckModel) => <DeviceReadersHealthCheckListItem item={item} />}
        />
      ) : (
        <div style={{ overflow: 'hidden', height: 'calc(100vh - 70px)' }} className={'app-view-container dx-scrollable rescue-dump-list'}>
          <span className='dx-empty-message'>No data to display</span>
        </div>
      )}
    </>
  );
};