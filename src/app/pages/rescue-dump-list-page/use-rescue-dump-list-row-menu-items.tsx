import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RescueDumpListItemProps } from '../../models/rescue-dump-list-item-props';
import { useExternalBridgeContext } from '../../contexts/external-bridge-context';
import { useSharedContext } from '../../contexts/shared-context';
import { DownloadIcon, ExtensionIcon, PackageIcon, RemoveIcon, RestoreIcon } from '../../components/icons';
import { useIsAuthRescueDumpServer } from '../../hooks/use-is-auth-rescue-dump-server';
import { SecurityPassRequestModel } from '../../models/security-pass-request-model';
import { TargetDialogProps } from '../../models/target-dialog-props';
import { useRescueDumpListPageContext } from './rescue-dump-list-page-context';
import { RestorationTraceMessageCommandModel } from '../../models/restoration-trace-message-command-model';
import { TraceMessageCommandName } from '../../models/trace-message-command-model';

export const useRescueDumpListRowMenuItems = ({ item }: RescueDumpListItemProps) => {
  const { setRefreshToken, activeRescueDumpServer, appSettings } = useSharedContext();
  const { showDialog, selectedRescueDumpListItem } = useRescueDumpListPageContext();
  const { saveRescueDumpAsync, removeRescueDumpAsync } = useExternalBridgeContext();
  const navigate = useNavigate();
  const isAuth = useIsAuthRescueDumpServer();

  const requestRestorationAsync = useCallback(async (serverName: string) => {
    if(!selectedRescueDumpListItem) {
      return;
    }

    const selectedRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name == serverName);
    await window.externalBridge.signalR.buildAsync(selectedRescueDumpServer);
    await window.externalBridge.signalR.startAsync();

    await window.externalBridge.signalR.subscribe(async (event: any, args: any) => {
      const dialogResult = await confirm(`<div style='width: 450px'>${args.message}</div>`, 'Security pass');

      if(dialogResult === true) {
        notify(`The temporal security pass ${args.securityPass} has been received successfully!`, 'success');
        navigate('/trace-message-viewer', {
          state: {
            name: TraceMessageCommandName.restoration,
            serverName: serverName,
            fileId: selectedRescueDumpListItem.fileId,
            securityPass: args.securityPass
          } as RestorationTraceMessageCommandModel
        });
      }

      await window.externalBridge.signalR.unsubscribe();
      await window.externalBridge.signalR.stopAsync();
    });

    const securityPassRequest = {
      userName: selectedRescueDumpServer.authToken.userName,
      fileId: selectedRescueDumpListItem.fileId,
    } as SecurityPassRequestModel;

    await window.externalBridge.sendRequestSecurityPass(selectedRescueDumpServer, securityPassRequest);
  }, [appSettings.rescueDumpServers, navigate, selectedRescueDumpListItem]);

  return useMemo(() => {

    return [{
      icon: () => <ExtensionIcon size={28} />,
      items: [{
        text: 'Show...',
        icon: () => <PackageIcon size={24} />,
        onClick: async () => {
          if (selectedRescueDumpListItem) {
            navigate(`/rescue-dump-content-list?fileId=${selectedRescueDumpListItem.fileId}`);
          }
        }
      },
      {
        text: 'Download...',
        icon: () => <DownloadIcon size={24} />,
        onClick: async () => {
          if (selectedRescueDumpListItem) {
            await saveRescueDumpAsync(activeRescueDumpServer, selectedRescueDumpListItem.fileId, selectedRescueDumpListItem.description);
          }
        }
      },
      {
        text: 'Remove...',
        icon: () => <RemoveIcon size={24} />,
        onClick: async () => {
          const dialogResult = await confirm('The rescue dump will be permanently removed! Are you sure?', 'Confirm');
          if (dialogResult === true) {
            const rescueDumpServer = appSettings.rescueDumpServers.find(s => s.name == item.groupKey);
            if (await removeRescueDumpAsync(rescueDumpServer, selectedRescueDumpListItem.fileId) === true) {
              notify({ message: `The rescue dump ${selectedRescueDumpListItem.description} was successfully removed.` }, 'success', 10000);
              setRefreshToken(
                window.crypto.getRandomValues(new Uint8Array(9)).join('')
              );
            } else {
              notify({ message: 'An error was happened!' }, 'error', 10000);
            }
          }
        },
        visible: isAuth(item.groupKey)
      },
      {
        text: 'Restore from...',
        icon: () => <RestoreIcon size={24} />,
        onClick: async () => {
          showDialog('TargetServerDialog', {
            visible: true,
            callback: async (serverName: string) => {
              if(serverName) {
                await requestRestorationAsync(serverName);
              }
            }
          } as TargetDialogProps );
        },
        visible: isAuth(item.groupKey)
      }]
    }];

  }, [isAuth, item.groupKey, selectedRescueDumpListItem, navigate, saveRescueDumpAsync, activeRescueDumpServer, appSettings.rescueDumpServers, removeRescueDumpAsync, setRefreshToken, showDialog, requestRestorationAsync]);
};
