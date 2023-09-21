import './text-file-viewer-page.css';
import { TextArea } from 'devextreme-react/text-area';
import { useEffect, useState } from 'react';
import { useSharedContext } from '../../contexts/shared-context';
import { useExternalBridgeContext } from '../../contexts/external-bridge-context';
import { useLocation } from 'react-router-dom';
import { RescueDumpEntryModel } from '../../models/rescue-dump-entry-model';

export const TextFileViewerPage = () => {
  const [content, setContent] = useState<string>();
  const { getRescueDumpContentAsync } = useExternalBridgeContext();
  const { activeRescueDumpServer } = useSharedContext();
  const { state } = useLocation();

  useEffect(() => {
    (async () => {
      const content = await getRescueDumpContentAsync(activeRescueDumpServer, state as RescueDumpEntryModel);
      setContent(content);
    })();
  }, [activeRescueDumpServer, getRescueDumpContentAsync, state]);

  return (
    <TextArea className={'app-view-container rescue-dump-file-viewer'}
      value={content}
    />
  );
};