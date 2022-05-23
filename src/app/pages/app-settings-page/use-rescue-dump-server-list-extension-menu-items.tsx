import { useMemo } from 'react';
import { AddIcon, ExtensionVertIcon } from '../../components/icons';
import { DialogProps } from '../../models/dialog-props';
import { useAppSettingPageContext } from './app-setting-page-context';

export const useRescueDumpServerListExtensionMenuItems = () => {
  const { showDialog } = useAppSettingPageContext();

  return useMemo(() => {

    return [{
        icon: () => <ExtensionVertIcon size={24} />,
        items: [
          {
            text: 'Add server...',
            icon: () => <AddIcon size={24} />,
            onClick: () => {
              showDialog('RescueDumpServerDialog', { visible: true } as DialogProps);
            }
          },
        ],
      },
    ];
  }, [showDialog]);
};