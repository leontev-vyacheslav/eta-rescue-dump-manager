import { confirm } from 'devextreme/ui/dialog';
import { useMemo } from 'react';
import { MenuItemModel } from '../../models/menu-item-model';
import { CloseIcon } from '../icons';

export const useCloseMenuItems = () => {

  return useMemo<MenuItemModel[]>(() => {

    return [{
      icon: () => <CloseIcon size={28} />,
      onClick: async () => {
        const dialogResult = await confirm('The application will be closed! Are you sure?', 'Confirm');
        if (dialogResult === true) {
          window.externalBridge.app.quitAppAsync();
        }
      }
    }];
  }, []);
};