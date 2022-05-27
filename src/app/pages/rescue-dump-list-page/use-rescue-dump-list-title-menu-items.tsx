import notify from 'devextreme/ui/notify';
import { useMemo } from 'react';
import { useSharedContext } from '../../contexts/shared-context';
import { DownloadIcon, ExtensionVertIcon } from '../../components/icons';

export const useRescueDumpListTitleMenuItems = () => {

  const { activeRescueDumpServer } = useSharedContext();

  return useMemo (() => {
    return [{
      icon: () => <ExtensionVertIcon size={24} />,
      items: [
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
          }
        },
      ],
    },
  ];
  }, [activeRescueDumpServer]);
};