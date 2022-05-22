import { RescueDumpServerModel } from '../../models/rescue-dump-server-model';
import { MainMenu } from '../../components/menu/main-menu/main-menu';
import { useSharedContext } from '../../contexts/shared-context';
import { CheckBox } from 'devextreme-react/ui/check-box';
import { useRescueDumpServerListRowMenuItems } from './use-rescue-dump-server-list-row-menu-items';
import { ActiveServerIcon, InactiveServerIcon } from '../../components/icons';
import { useAppSettingPageContext } from './app-setting-page-context';

export const RescueDumpServerListItem = ({ rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel }) => {
  const { appSettings, collapsedRescueDumpListGroupKeys } = useSharedContext();
  const { selectedRescueDumpServer } = useAppSettingPageContext();
  const rowMenuItems = useRescueDumpServerListRowMenuItems();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '40px 40px 200px 1fr 40px', alignItems: 'center', height: 50 }}>
      {rescueDumpServer.id === appSettings.lastActiveRescueDumpServerId ? <ActiveServerIcon size={24} /> : <InactiveServerIcon size={24} /> }
      <CheckBox
        defaultValue={rescueDumpServer.displayed}
        onValueChange={(value: boolean) => {
          const currentRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name === rescueDumpServer.name);
          currentRescueDumpServer.displayed = value;

          if (value === false) {
            const index = collapsedRescueDumpListGroupKeys.current.findIndex(groupKey => groupKey === currentRescueDumpServer.name);
            collapsedRescueDumpListGroupKeys.current.splice(index, 1);
          }
        }}
      />
      <div>{rescueDumpServer.name}: </div>
      <div>{rescueDumpServer.baseUrl}</div>
      {rescueDumpServer.id === selectedRescueDumpServer?.id ? <MainMenu items={rowMenuItems as any} /> : <div></div>}
    </div>
  );
};

