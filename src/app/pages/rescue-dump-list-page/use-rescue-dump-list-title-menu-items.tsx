import notify from 'devextreme/ui/notify';
import { MutableRefObject, useMemo } from 'react';
import { useSharedContext } from '../../contexts/shared-context';
import { CollapseIcon, DownloadIcon, ExpandIcon, ExtensionVertIcon } from '../../components/icons';
import { List } from 'devextreme-react/ui/list';
import { RescueDumpListGroupModel } from '../../models/rescue-dump-list-group-model';

type RescueDumpListTitleMenuItemsProps = {
  listRef: MutableRefObject<List>,
  rescueDumpGroupedList: RescueDumpListGroupModel[]
}

export const useRescueDumpListTitleMenuItems = ( { listRef, rescueDumpGroupedList }: RescueDumpListTitleMenuItemsProps) => {
  const { activeRescueDumpServer, collapsedRescueDumpListGroupKeys } = useSharedContext();

  return useMemo(() => {
    return [
      {
        icon: () => <ExtensionVertIcon size={24} />,
        items: [
          {
            text: 'Collapse groups',
            icon: () => <CollapseIcon size={24} />,
            onClick: () => {
              const list = listRef.current.instance;
              if(list) {
                collapsedRescueDumpListGroupKeys.current = [];
                rescueDumpGroupedList.forEach((group, index) => {
                  collapsedRescueDumpListGroupKeys.current.push(group.key);
                  list.collapseGroup(index);
                });
              }
            }
          },
          {
            text: 'Expand groups',
            icon: () => <ExpandIcon size={24} />,
            onClick: () => {
              const list = listRef.current.instance;
              if(list) {
                collapsedRescueDumpListGroupKeys.current = [];
                rescueDumpGroupedList.forEach((group, index) => {
                  list.expandGroup(index);
                });
              }
            }
          },
          {
            text: 'Extract all dumps',
            icon: () => <DownloadIcon size={24} />,
            onClick: async () => {
              const rescueDumpGroupedList = await window.externalBridge.getRescueDumpGroupedListAsync(activeRescueDumpServer);
              rescueDumpGroupedList.forEach(async (group) => {
                const item = group.items.find(() => true);
                if (item) {
                  await window.externalBridge.saveRescueDumpAsync(activeRescueDumpServer, item.fileId, `${item.description}.zip`, 'desktop');
                  notify(`Rescue dump ${item.description} was successfully saved`, 'success', 5000);
                }
              });
            },
          },
        ],
      },
    ];
  }, [activeRescueDumpServer, collapsedRescueDumpListGroupKeys, listRef, rescueDumpGroupedList]);
};
