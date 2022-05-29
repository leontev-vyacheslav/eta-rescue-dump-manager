import List from 'devextreme-react/ui/list';
import { RescueDumpServerModel } from '../../models/rescue-dump-server-model';
import { useSharedContext } from '../../contexts/shared-context';
import { RescueDumpServerListItem } from './rescue-dump-server-list-item';
import { useAppSettingPageContext } from './app-setting-page-context';
import { useRescueDumpServerListExtensionMenuItems } from './use-rescue-dump-server-list-extension-menu-items';
import { PageToolbar } from '../../components/page-toolbar/page-toolbar';
import './rescue-dump-server-list.css';

export const RescueDumpServerList = () => {
  const { appSettings } = useSharedContext();
  const { setSelectedRescueDumpServer } = useAppSettingPageContext();
  const extensionMenuItems = useRescueDumpServerListExtensionMenuItems();

  return (
    <>
      <PageToolbar title={'Rescue dump server list'} menuItems={extensionMenuItems} />
      <List
      className='rescue-dump-server-list'
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
