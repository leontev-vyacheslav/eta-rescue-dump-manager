import { confirm } from 'devextreme/ui/dialog';
import notify from 'devextreme/ui/notify';
import { useCallback, useMemo } from 'react';
import { useSharedContext } from '../../contexts/shared-context';
import { TraceMessagingModel } from '../../models/trace-messaging-model';
import { BookmarkIcon, EditIcon, ExtensionIcon, RemoveIcon, TraceIcon } from '../../components/icons';
import { DialogProps } from '../../models/dialog-props';
import { useAppSettingPageContext } from './app-setting-page-context';

const signalR = window.externalBridge.signalR;

export const useRescueDumpServerListRowMenuItems = () => {
  const { setAppSettings } = useSharedContext();
  const { showDialog, selectedRescueDumpServer } = useAppSettingPageContext();

  const testTraceMessagingAsync = useCallback(async() => {
      await signalR.buildAsync(selectedRescueDumpServer);

      try {
        await signalR.subscribe((event: any, args: any) => {
          notify({ message: `${args} with UID ${crypto.randomUUID().replaceAll('-', '')}` }, 'info', 1000);
        });
        const connectionId = await signalR.startAsync();
        notify({ message: `The connection ${connectionId.replaceAll('-', '')} was established.` }, 'success', 5000);
        await new Promise(r => setTimeout(r, 5000));

        await window.externalBridge.app.traceMessagingAsync(selectedRescueDumpServer,
          {
            count: 10,
            message: `Test trace messaging of [${selectedRescueDumpServer.name}]`,
            delay: 1000
          } as TraceMessagingModel
        );
        notify({ message: 'Test trace messaging was successfully complete!' }, 'success', 5000);
      } finally
      {
        await signalR.unsubscribe();
        await signalR.stopAsync();
      }
  }, [selectedRescueDumpServer]);

  return useMemo(() => {
    return [{
      icon: () => <ExtensionIcon size={28} />,
      items: [ {
          text: 'Set as active',
          icon: () => <BookmarkIcon size={24} />,
          onClick: async () => {
            if(!selectedRescueDumpServer) {
              return;
            }

            setAppSettings(previous => {
                return {
                  ...previous,
                  lastActiveRescueDumpServerId: selectedRescueDumpServer.id
                };
            });
          }
        },
        {
        text: 'Edit...',
        icon: () => <EditIcon size={24} />,
        onClick: async () => {
          if(!selectedRescueDumpServer) {
            return;
          }

          showDialog('RescueDumpServerDialog', { visible: true } as DialogProps);
        }
      },
      {
        text: 'Remove...',
        icon: () => <RemoveIcon size={24} />,
        onClick: async () => {
          if(!selectedRescueDumpServer) {
            return;
          }

          const dialogResult = await confirm(`The server ${selectedRescueDumpServer.name} will be permanently removed from the available servers list! Are you sure?`, 'Confirm');
          if (dialogResult === true) {
            setAppSettings(previous => {
              return {
                ...previous,
                rescueDumpServers: previous.rescueDumpServers.filter(s => s.name !== selectedRescueDumpServer.name).sort((a, b) => a.id - b.id)
              };
            });
          }
        }
      },
      {
        text: 'Test trace messaging',
        icon: () => <TraceIcon size={24} />,
        onClick: testTraceMessagingAsync
      }]
    }];
  }, [selectedRescueDumpServer, setAppSettings, showDialog, testTraceMessagingAsync]);

};