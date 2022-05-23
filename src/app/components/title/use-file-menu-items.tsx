import { confirm } from 'devextreme/ui/dialog';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuItemModel } from '../../models/menu-item-model';
import { useCommonDialogsContext } from '../../contexts/common-dialogs-context';
import { useExternalBridgeContext } from '../../contexts/external-bridge-context';
import { useSharedContext } from '../../contexts/shared-context';
import { AboutIcon, BackIcon, ExitIcon, MenuIcon, RefreshIcon, SaveIcon, SettingsIcon, ToolsIcon } from '../icons';
import { useMemo } from 'react';
import { DialogProps } from '../../models/dialog-props';

const app = window.externalBridge.app;

export const useFileMenuItems = () => {
  const { removeRescueDumpGroupedListAsync } = useExternalBridgeContext();
  const { setRefreshToken } = useSharedContext();
  const { showDialog } = useCommonDialogsContext();
  const navigate = useNavigate();
  const location = useLocation();

  return useMemo<MenuItemModel[]>(() => {

    return [{
      icon: () => <MenuIcon size={28} />,
      items: [
        {
          text: 'Back',
          icon: () => <BackIcon size={28} />,
          onClick: () => {
            navigate(-1);
          },
          visible: location.pathname !== '/'
        },
        {
          text: 'Save',
          icon: () => <SaveIcon size={24} />,
          onClick: async () => {
            await app.storeAppSettingsAsync(appSettings);
          },
          visible: location.pathname === '/app-settings'
        },
        {
        text: 'Refresh',
        icon: () => <RefreshIcon size={24} />,
        onClick: async () => {
          await removeRescueDumpGroupedListAsync();
          setRefreshToken(
            window.crypto.getRandomValues(new Uint8Array(9)).join('')
          );
        },
        visible: location.pathname === '/'
      },
      {
        text: 'Settings...',
        icon: () => <SettingsIcon size={24} />,
        onClick: async () => {
          navigate('/app-settings');
        },
        visible:  location.pathname !== '/app-settings'
      },
      {
        text: 'About...',
        icon: () => <AboutIcon size={24} />,
        onClick: () => showDialog('AboutDialog', { visible: true } as DialogProps)
      },
      {
        text: 'Dev tools...',
        icon: () => <ToolsIcon size={24} />,
        onClick: async () => {
          await app.openDevToolsAsync();
        }
      },
      {
        text: 'Exit',
        icon: () => <ExitIcon size={24} />,
        onClick: async () => {
          const dialogResult = await confirm('The application will be closed! Are you sure?', 'Confirm');
          if (dialogResult === true) {
            await app.quitAppAsync();
          }
        }
      }]
    }];
  }, [location.pathname, navigate, removeRescueDumpGroupedListAsync, setRefreshToken, showDialog]);
};