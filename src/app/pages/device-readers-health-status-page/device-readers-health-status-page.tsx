import './device-readers-health-status-list-item.css';
import { List } from 'devextreme-react/ui/list';
import { useEffect, useRef, useState } from 'react';
import { DeviceReaderHealthStatusGroupModel } from '../../models/device-reader-health-status-group-model';
import { DeviceReaderHealthStatusModel } from '../../models/device-reader-health-status-model';
import { PageToolbar } from '../../components/page-toolbar/page-toolbar';
import { useSharedContext } from '../../contexts/shared-context';
import { useLocation } from 'react-router-dom';
import { DeviceReaderHealthStatusRouterStateModel } from '../../models/device-reader-health-status-router-state-model';
import { DeviceReaderHealthStatusPageModes } from '../../models/device-reader-health-status-page-modes';
import { DeviceReadersHealthStatusListGroup } from './device-readers-health-status-list-group';
import { DeviceReadersHealthStatusListItem } from './device-readers-health-status-list-item';

export const DeviceReadersHealthStatusPage = () => {
  const listRef = useRef<List>(null);
  const { appSettings } = useSharedContext();
  const [deviceReadersHealthStatusGroupedList, setDeviceReadersHealthStatusGroupList] = useState<DeviceReaderHealthStatusGroupModel[] | null>(null);
  const { state } = useLocation();
  const routerPageCommand = state as DeviceReaderHealthStatusRouterStateModel;

  useEffect(() => {
    (async () => {
      const list: DeviceReaderHealthStatusGroupModel[] = [];
      if (!appSettings || !appSettings.rescueDumpServers || !routerPageCommand) {
        return;
      }
      let index = 0;
      if (routerPageCommand.mode === DeviceReaderHealthStatusPageModes.multiple) {
        for (const rescueDumpServer of appSettings.rescueDumpServers) {
          const deviceReadersHealthStatuses = await window.externalBridge.getDeviceReadersHealthStatusAsync(rescueDumpServer);

          if (deviceReadersHealthStatuses) {
            const item = {
              index: index++,
              key: rescueDumpServer.name,
              items: deviceReadersHealthStatuses,
            } as DeviceReaderHealthStatusGroupModel;
            list.push(item);
          }
        }

        setDeviceReadersHealthStatusGroupList(list);
      } else {
        const selectedRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name === routerPageCommand.serverName);

        if (selectedRescueDumpServer) {
          const deviceReadersHealthStatuses = await window.externalBridge.getDeviceReadersHealthStatusAsync(selectedRescueDumpServer);
          if (deviceReadersHealthStatuses) {
            const item = {
              index: index,
              key: routerPageCommand.serverName,
              items: deviceReadersHealthStatuses,
            } as DeviceReaderHealthStatusGroupModel;

            setDeviceReadersHealthStatusGroupList((previous) => {
              return previous ? [...previous, item] : [item];
            });
          }
        }
      }
    })();
  }, [appSettings, routerPageCommand]);

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
          groupRender={(group: DeviceReaderHealthStatusGroupModel) => <DeviceReadersHealthStatusListGroup component={listRef} group={group} />}
          itemRender={(item: DeviceReaderHealthStatusModel) => <DeviceReadersHealthStatusListItem item={item} />}
        />
      ) : (
        <div style={{ overflow: 'hidden', height: 'calc(100vh - 70px)' }} className={'app-view-container dx-scrollable rescue-dump-list'}>
          <span className='dx-empty-message'>No data to display</span>
        </div>
      )}
    </>
  );
};