import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { SaveIcon , ExtensionVertIcon } from '../../components/icons';
import { TraceMessageRouterStateModel } from '../../models/trace-message-router-state-model';
import { useSharedContext } from '../../contexts/shared-context';
import moment from 'moment';
import notify from 'devextreme/ui/notify';

export const useTraceMessageViewerTitleMenuItems = () => {
  const { state } = useLocation();
  const { appSettings } = useSharedContext();

  return (
    useMemo(() => {
      return [
        {
          icon: () => <ExtensionVertIcon size={24} />,
          items: [
            {
              text: 'Save',
              icon: () => <SaveIcon size={24} />,
              onClick: async () => {
                const traceMessageRouterState = state as TraceMessageRouterStateModel;
                const selectedRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name == traceMessageRouterState.serverName);
                const textArea = document.querySelector('#trace-message-viewer textarea') as HTMLTextAreaElement;
                const text = textArea.value;
                if(text) {
                  const fileName = `${selectedRescueDumpServer.name} (${moment().format('YYYY-MM-DD#hh-mm-ss')}).log`;
                  await window.externalBridge.saveTextFileAsync(
                    fileName,
                    'desktop',
                    text
                  );
                  notify(`File ${fileName} has been successfully saved`, 'success', 2000);
                }
              },
            },
          ],
        },
      ];
    }, [appSettings.rescueDumpServers, state])
  );
};