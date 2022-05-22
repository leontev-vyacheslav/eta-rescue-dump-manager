import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExternalBridgeContext } from '../../contexts/external-bridge-context';
import { useSharedContext } from '../../contexts/shared-context';
import { ExtensionIcon, FileIcon, SaveIcon } from '../../components/icons';
import { RescueDumpEntryModel } from '../../models/rescue-dump-entry-model';
import { useRescueDumpContentListPage } from './rescue-dump-content-list-page-context';

export const useRescueDumpContentListRowMenuItems = (rescueDumpEntry: RescueDumpEntryModel) => {
  const { saveRescueDumpContentFileAsync } = useExternalBridgeContext();
  const { activeRescueDumpServer } = useSharedContext();
  const { selectedDumpFileName } = useRescueDumpContentListPage();

  const navigate = useNavigate();

  return useMemo(() => {

    return [{
      icon: () => <ExtensionIcon size={28} />,
      items: [{
        text: 'Show...',
        icon: () => <FileIcon size={24} />,
        onClick: async () => {
          if (selectedDumpFileName) {
            navigate('/text-file-viewer', { state: { ...rescueDumpEntry } });
          }
        }
      },
      {
        text: 'Save...',
        icon: () => <SaveIcon size={24} />,
        onClick: async () => {
          await saveRescueDumpContentFileAsync(activeRescueDumpServer, rescueDumpEntry.fileId, selectedDumpFileName);
        }
      }]
    }];
  }, [activeRescueDumpServer, navigate, rescueDumpEntry, saveRescueDumpContentFileAsync, selectedDumpFileName]);
};
