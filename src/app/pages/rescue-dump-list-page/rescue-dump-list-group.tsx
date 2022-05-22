import { useState } from 'react';
import { useIsAuthRescueDumpServer } from '../../hooks/use-is-auth-rescue-dump-server';
import { RescueDumpListGroupProps } from '../../models/rescue-dump-list-group-props';
import { useRescueDumpListGroupRowMenuItems } from './use-rescue-dump-list-group-row-menu-items';
import { AuthorizedIcon, UnauthorizedIcon } from '../../components/icons';
import { MainMenu } from '../../components/menu/main-menu/main-menu';
import { useSharedContext } from '../../contexts/shared-context';

export const RescueDumpListGroup = ({ group, component }: RescueDumpListGroupProps) => {
  const { collapsedRescueDumpListGroupKeys } = useSharedContext();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return collapsedRescueDumpListGroupKeys.current.indexOf(group.key) !== -1;
  });
  const groupRowMenuItems = useRescueDumpListGroupRowMenuItems({ group } as RescueDumpListGroupProps);
  const isAuth = useIsAuthRescueDumpServer();

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer' }} onClick={async () => {
        if (!isCollapsed) {
          await component.collapseGroup(group.index);
          collapsedRescueDumpListGroupKeys.current.push(group.key);
        } else {
          await component.expandGroup(group.index);
          collapsedRescueDumpListGroupKeys.current.splice(collapsedRescueDumpListGroupKeys.current.indexOf(group.key), 1);
        }
        setIsCollapsed(!isCollapsed);
      }} > {isAuth(group.key) ? <AuthorizedIcon size={32} /> : <UnauthorizedIcon size={32} />} <span style={{ marginLeft: 10 }}>Server name: {group.key}</span> </div>
      <MainMenu items={groupRowMenuItems as any} />
    </div>
  );
};
