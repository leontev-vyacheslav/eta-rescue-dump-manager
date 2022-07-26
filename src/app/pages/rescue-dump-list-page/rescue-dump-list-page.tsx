import './rescue-dump-list-page.css';
import { List } from 'devextreme-react/list';
import { useEffect, useRef, useState } from 'react';
import { RescueDumpListItemModel } from '../../models/rescue-dump-list-item-model';
import { RescueDumpListGroupModel } from '../../models/rescue-dump-list-group-model';
import { RescueDumpListItem } from './rescue-dump-list-item';
import { RescueDumpListGroup } from './rescue-dump-list-group';
import { useSharedContext } from '../../contexts/shared-context';
import { useExternalBridgeContext } from '../../contexts/external-bridge-context';
import { RescueDumpListPageProvider, useRescueDumpListPageContext } from './rescue-dump-list-page-context';
import { PageToolbar } from '../../components/page-toolbar/page-toolbar';
import { useRescueDumpListTitleMenuItems } from './use-rescue-dump-list-title-menu-items';

const RescueDumpListPageInternal = () => {
  const listRef = useRef<List>(null);
  const { getRescueDumpGroupedListAsync } = useExternalBridgeContext();
  const { setSelectedRescueDumpListItem } = useRescueDumpListPageContext();
  const { activeRescueDumpServer,  appSettings, collapsedRescueDumpListGroupKeys } = useSharedContext();

  const [rescueDumpGroupedList, setRescueDumpGroupedList] = useState<RescueDumpListGroupModel[]>();
  const menuItems = useRescueDumpListTitleMenuItems({ listRef, rescueDumpGroupedList });

  useEffect(() => {
    (async () => {
      if(!appSettings) {
        return;
      }
    
      const displayedServers = appSettings.rescueDumpServers?.filter(s => s.displayed === true) ?? [];
      let groups = await getRescueDumpGroupedListAsync(activeRescueDumpServer);
      groups = groups
        .filter(g => displayedServers.map(s => s.name).includes(g.key))
        .map((s) => {
          return {
            ...s,
            index: displayedServers.find(d => d.name === s.key).id
          };
        })
        .sort((a, b) => a.index - b.index)
        .map((s, i) => {
          return {
            ...s,
            index: i
          };
        });
      setRescueDumpGroupedList(groups);
    })();
  }, [activeRescueDumpServer, appSettings, getRescueDumpGroupedListAsync]);

  return rescueDumpGroupedList ? (
    <>
      <PageToolbar title={'Rescue dump list'} menuItems={menuItems} />
      <List
        id='rescue-dump-list'
        ref={listRef}
        className={'app-view-container rescue-dump-list'}
        dataSource={rescueDumpGroupedList}
        displayExpr={'description'}
        selectionMode={'single'}
        grouped
        groupRender={(group: RescueDumpListGroupModel) => (
          <RescueDumpListGroup
            component={listRef}
            group={group}
          />
        )}
        itemRender={(item: RescueDumpListItemModel) => <RescueDumpListItem item={item} />}
        onItemClick={(e) => {
          setSelectedRescueDumpListItem(e.itemData as unknown as RescueDumpListItemModel);
        }}
        onGroupRendered={e => {
          if (collapsedRescueDumpListGroupKeys.current) {
            collapsedRescueDumpListGroupKeys.current.forEach((groupKey) => {
              if(e.groupData.key === groupKey) {
                e.component.collapseGroup(e.groupData.index);
              }
            });
          }
        }}
      />
    </>
  ) : (
    <div style={{ overflow: 'hidden', height: 'calc(100vh - 70px)' }} className={'app-view-container dx-scrollable rescue-dump-list'}>
      <span className='dx-empty-message'>No data to display</span>
    </div>
  );
};

export const RescueDumpListPage = () => {
  return (
    <RescueDumpListPageProvider>
      <RescueDumpListPageInternal />
    </RescueDumpListPageProvider>
  );
};