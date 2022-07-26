import { TextArea } from 'devextreme-react/ui/text-area';
import { useEffect, useRef } from 'react';
import { useSharedContext } from '../../contexts/shared-context';
import { useLocation } from 'react-router-dom';
import { RescueDumpServerModel } from '../../models/rescue-dump-server-model';
import { RestorationTraceMessageRouterStateModel } from '../../models/restoration-trace-message-router-state-model';
import { TraceMessageRouterStateModel, TraceMessageCommandName } from '../../models/trace-message-router-state-model';
import { PageToolbar } from '../../components/page-toolbar/page-toolbar';
import { useTraceMessageViewerTitleMenuItems } from './use-trace-message-viewer-title-menu-items';

const signalR = window.externalBridge.signalR;

export const TraceMessageViewer = () => {
  const { setIsShowLoadPanel, appSettings } = useSharedContext();
  const textAreaRef = useRef<TextArea>();
  const { state } = useLocation();
  const menuItems = useTraceMessageViewerTitleMenuItems();

  useEffect(() => {
    (async () => {
      let selectedRescueDumpServer: RescueDumpServerModel = null;
      const traceMessageRouterState = state as TraceMessageRouterStateModel;

      if(traceMessageRouterState) {
        selectedRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name == traceMessageRouterState.serverName);
      }

      if(!traceMessageRouterState || !selectedRescueDumpServer) {
        textAreaRef.current.instance.option('value', 'An error was happened! The command has been not passed!');
        setIsShowLoadPanel(false);

        return;
      }

      await signalR.buildAsync(selectedRescueDumpServer);
      const textArea = textAreaRef.current.instance;
      try {
        setIsShowLoadPanel(true);

        await signalR.subscribe((event: any, args: any) => {
          const element = textArea.element().querySelector('textarea');
          const text = `${textArea.option('value')}${args}\r\n`;
          textArea.option('value', text);
          element.scrollTop = element.scrollHeight;
        });
        await window.externalBridge.signalR.startAsync();

        if (traceMessageRouterState.name === TraceMessageCommandName.createDump) {
          await window.externalBridge.data.createRescueDumpAsync(selectedRescueDumpServer);
        } else if (traceMessageRouterState.name === TraceMessageCommandName.restoration) {
          const restorationCommand = state as RestorationTraceMessageRouterStateModel;
          if (restorationCommand.securityPass) {
            await window.externalBridge.restoreDatabaseAsync(selectedRescueDumpServer, {
              fileId: restorationCommand.fileId,
              securityPass: restorationCommand.securityPass,
            });
          }
        }
      } finally {
        await signalR.unsubscribe();
        await signalR.stopAsync();
        setIsShowLoadPanel(false);
      }
    })();
  }, []);

  return (
    <>
      <PageToolbar title={'Incoming messages'} menuItems={menuItems} />
      <TextArea
        id='trace-message-viewer'
        ref={textAreaRef}
        className={'app-view-container rescue-dump-file-viewer'}
      />
    </>
  );
};