import './rescue-dump-content-list-page.css';
import { List } from 'devextreme-react/list';
import { useSharedContext } from '../../contexts/shared-context';
import { useExternalBridgeContext } from '../../contexts/external-bridge-context';
import { useEffect, useState } from 'react';
import { RescueDumpEntryModel } from '../../models/rescue-dump-entry-model';
import { RescueDumpContentListItem } from './rescue-dump-content-list-item';
import { useSearchParams } from 'react-router-dom';
import { RescueDumpContentListPageContextProvider, useRescueDumpContentListPage } from './rescue-dump-content-list-page-context';

const RescueDumpContentListPageInner = () => {
  const { activeRescueDumpServer } = useSharedContext();
  const { setSelectedDumpFileName }= useRescueDumpContentListPage();
  const { getRescueDumpAsync } = useExternalBridgeContext();
  const [rescueDumpContentList, setRescueDumpContentList] = useState<RescueDumpEntryModel[]>();
  const [search] = useSearchParams();

  useEffect(() => {
    (async () => {
      const fileId = search.get('fileId');
      const contentList = await getRescueDumpAsync(activeRescueDumpServer, fileId);
      setRescueDumpContentList(contentList);
    })();
  }, [activeRescueDumpServer, getRescueDumpAsync, search]);

  return (
    <List
      className={'app-view-container rescue-dump-content-list'}
      selectionMode={'single'}
      dataSource={rescueDumpContentList}
      itemRender={(item) => <RescueDumpContentListItem rescueDumpEntry={item} />}
      displayExpr={'name'}
      onItemClick={(e) => {
        setSelectedDumpFileName((e.itemData as unknown as RescueDumpEntryModel).name);
      }}
    />
  );
};

export const RescueDumpContentListPage = () => {
  return (
    <RescueDumpContentListPageContextProvider>
      <RescueDumpContentListPageInner />
    </RescueDumpContentListPageContextProvider>
  );
};
