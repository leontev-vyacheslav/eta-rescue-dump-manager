import List from 'devextreme-react/ui/list';
import { RescueDumpServerModel } from '../../models/rescue-dump-server-model';
import { useSharedContext } from '../../contexts/shared-context';
import { RescueDumpServerListItem } from './rescue-dump-server-list-item';
import { useAppSettingPageContext } from './app-setting-page-context';
import { useRescueDumpServerListExtensionMenuItems } from './use-rescue-dump-server-list-extension-menu-items';
import { MainMenu } from '../../components/menu/main-menu/main-menu';

export const RescueDumpServerList = () => {
  const { appSettings } = useSharedContext();
  const { setSelectedRescueDumpServer } = useAppSettingPageContext();
  const extensionMenuItems = useRescueDumpServerListExtensionMenuItems();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label className='dx-field-item-label dx-field-item-label-location-top'>
            <span className='dx-field-item-label-content'>
              <span className='dx-field-item-label-text'>Rescue dump server list:</span>
            </span>
          </label>
        </div>
        <MainMenu items={extensionMenuItems} />
      </div>
      <List
        height={250}
        dataSource={appSettings ? appSettings.rescueDumpServers : []}
        selectionMode={'single'}
        itemRender={(item: RescueDumpServerModel) => <RescueDumpServerListItem rescueDumpServer={item} />}
        onItemClick={(e) => {
          setSelectedRescueDumpServer(e.itemData as unknown as RescueDumpServerModel);
        }}
      />
    </>
  );
};
