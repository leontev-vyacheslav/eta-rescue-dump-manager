import notify from 'devextreme/ui/notify';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedContext } from '../../contexts/shared-context';
import { useIsAuthRescueDumpServer } from '../../hooks/use-is-auth-rescue-dump-server';
import { RescueDumpListGroupProps } from '../../models/rescue-dump-list-group-props';
import { ExtensionIcon, LoginIcon, LogoutIcon, PackageIcon } from '../../components/icons';
import { LoginDialog } from '../../components/dialogs/login-dialog/login-dialog';
import { LoginDialogProps } from '../../models/login-dialog-props';
import { useRescueDumpListPageContext } from './rescue-dump-list-page-context';
import { TraceMessageCommandModel, TraceMessageCommandName } from '../../models/trace-message-command-model';

const app = window.externalBridge.app;

export const useRescueDumpListGroupRowMenuItems = ({ group }: RescueDumpListGroupProps) => {
  const { showDialog } = useRescueDumpListPageContext();
  const navigate = useNavigate();
  const { appSettings, setAppSettings } = useSharedContext();
  const isAuth = useIsAuthRescueDumpServer();
  const { key: serverName } = group;

  return useMemo(() => [{
    icon: () => <ExtensionIcon size={28} />,
    items: [
    {
      text: 'Create dump...',
      icon: () => <PackageIcon size={24} />,
      onClick: async () => {
        navigate('/trace-message-viewer', {
          state: {
            name: TraceMessageCommandName.createDump,
            serverName: serverName
          } as TraceMessageCommandModel
        });
      },
      visible: isAuth(serverName)
    },
    {
      text: 'Login...',
      icon: () => <LoginIcon size={24} />,
      onClick: async () => {
        const currentActiveRescueDumpServer = appSettings.rescueDumpServers.find(s => s.name == serverName);
        showDialog(LoginDialog.name, { rescueDumpServer: currentActiveRescueDumpServer, visible: true } as LoginDialogProps);
      },
      visible: !isAuth(serverName)
    },
    {
      text: 'Logout',
      icon: () => <LogoutIcon size={24} />,
      onClick: async () => {
        setAppSettings(previous => {
          const currentRescueDumpServer = previous.rescueDumpServers.find(s => s.name == serverName);
          currentRescueDumpServer.authToken = null;

          return {
            ...previous,
            rescueDumpServers: [
              ...previous.rescueDumpServers.filter(s => s.name !== serverName),
              currentRescueDumpServer
            ].sort((a, b) => a.id - b.id)
          };
        });
        await app.storeAppSettingsAsync(appSettings);
        notify({ message: `Logout was successfully complete from ${serverName} rescue dump server.` }, 'warning', 5000);
      },
      visible: isAuth(serverName)
    }]
  }], [appSettings, isAuth, navigate, serverName, setAppSettings, showDialog]);
};