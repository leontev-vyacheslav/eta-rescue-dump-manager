import notify from 'devextreme/ui/notify';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSharedContext } from '../../contexts/shared-context';
import { useIsAuthRescueDumpServer } from '../../hooks/use-is-auth-rescue-dump-server';
import { RescueDumpListGroupProps } from '../../models/rescue-dump-list-group-props';
import { ExtensionIcon, HealthStatusIcon, LoginIcon, LogoutIcon, PackageIcon, UploadIcon } from '../../components/icons';
import { LoginDialogProps } from '../../models/login-dialog-props';
import { useRescueDumpListPageContext } from './rescue-dump-list-page-context';
import { TraceMessageCommandModel, TraceMessageCommandName } from '../../models/trace-message-command-model';
import { confirm } from 'devextreme/ui/dialog';

const app = window.externalBridge.app;

export const useRescueDumpListGroupRowMenuItems = ({ group }: RescueDumpListGroupProps) => {
  const { showDialog } = useRescueDumpListPageContext();
  const navigate = useNavigate();
  const { appSettings, setAppSettings, setIsShowLoadPanel } = useSharedContext();
  const isAuth = useIsAuthRescueDumpServer();
  const { key: serverName } = group;

  return useMemo(() => [{
    icon: () => <ExtensionIcon size={28} />,
    items: [
    {
      text: 'Create dump...',
      icon: () => <PackageIcon size={24} />,
      onClick: async () => {
        const dialogResult = await confirm(`It will be created a new rescue dump on ${serverName} server! Are you sure?`, 'Confirm');
        if (dialogResult === true) {
          navigate('/trace-message-viewer', {
            state: {
              name: TraceMessageCommandName.createDump,
              serverName: serverName
            } as TraceMessageCommandModel
          });
        }
      },
      visible: isAuth(serverName)
    },
    {
      text: 'Upload dump...',
      icon: () => <UploadIcon size={24} />,
      onClick: async () => {
        try {
          setIsShowLoadPanel(true);
          const currentActiveRescueDumpServer = appSettings.rescueDumpServers.find(s => s.name == serverName);
          const result = await window.externalBridge.uploadRescueDumpAsync(currentActiveRescueDumpServer);

          if(result !== null) {
            notify({
                message: `The rescue dump ${result.name} (${result.id}) was uploaded to a cloud storage in the folder ${currentActiveRescueDumpServer.name}.`,
              },
              'success',
              5000
            );
          } else {
            notify({ message: 'An error was happened!' }, 'error', 10000);
          }
        }
        finally {
          setIsShowLoadPanel(false);
        }
      },
      visible: isAuth(serverName)
    },
    {
      text: 'Get health status...',
      icon: () => <HealthStatusIcon size={24} />,
      onClick: () => {
        navigate('/device-readers-health-status', {
          state: {
            serverName: serverName,
          }
        });
      },
      // visible: isAuth(serverName)
    },
    {
      text: 'Login...',
      icon: () => <LoginIcon size={24} />,
      onClick: async () => {
        const currentActiveRescueDumpServer = appSettings.rescueDumpServers.find(s => s.name == serverName);
        showDialog('LoginDialog', { rescueDumpServer: currentActiveRescueDumpServer, visible: true } as LoginDialogProps);
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
  }], [appSettings, isAuth, navigate, serverName, setAppSettings, setIsShowLoadPanel, showDialog]);
};