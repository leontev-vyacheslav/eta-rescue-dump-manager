import { useCallback } from 'react';
import { useIsAuthRescueDumpServer } from '../../hooks/use-is-auth-rescue-dump-server';
import { RescueDumpListGroupProps } from '../../models/rescue-dump-list-group-props';
import { useRescueDumpListGroupRowMenuItems } from './use-rescue-dump-list-group-row-menu-items';
import { AuthorizedIcon, TotalIcon, UnauthorizedIcon } from '../../components/icons';
import { MainMenu } from '../../components/menu/main-menu/main-menu';
import { useSharedContext } from '../../contexts/shared-context';

export const RescueDumpListGroup = ({ group, component }: RescueDumpListGroupProps) => {
  const { collapsedRescueDumpListGroupKeys } = useSharedContext();
  const groupRowMenuItems = useRescueDumpListGroupRowMenuItems({ group } as RescueDumpListGroupProps);
  const isAuth = useIsAuthRescueDumpServer();

  const isCollapsed = useCallback(() => {
    return collapsedRescueDumpListGroupKeys.current.indexOf(group.key) !== -1;
  }, [collapsedRescueDumpListGroupKeys, group.key]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer', gap: 10 }}
        onClick={async () => {
          if (!isCollapsed()) {
            await component.current.instance.collapseGroup(group.index);
            collapsedRescueDumpListGroupKeys.current.push(group.key);
          } else {
            await component.current.instance.expandGroup(group.index);
            collapsedRescueDumpListGroupKeys.current.splice(collapsedRescueDumpListGroupKeys.current.indexOf(group.key), 1);
          }
        }}
      >
        {isAuth(group.key) ? <AuthorizedIcon size={32} /> : <UnauthorizedIcon size={32} />}
        <span>{group.key}</span>
        <div style={{ marginLeft: 'auto', marginRight: 25 }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, cursor: 'pointer', gap: 10, color: 'gray' }}>
            <TotalIcon size={20} />
            <span>{group.items.length}</span>
          </div>
        </div>
      </div>
      <MainMenu items={groupRowMenuItems as any} />
    </div>
  );
};
