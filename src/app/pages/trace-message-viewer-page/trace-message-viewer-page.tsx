import { TextArea } from 'devextreme-react/ui/text-area';
import { useEffect, useMemo, useRef } from 'react';
import { useSharedContext } from '../../contexts/shared-context';
import { useLocation } from 'react-router-dom';
import { RescueDumpServerModel } from '../../models/rescue-dump-server-model';
import { RestorationTraceMessageCommandModel } from '../../models/restoration-trace-message-command-model';
import { TraceMessageCommandModel, TraceMessageCommandName } from '../../models/trace-message-command-model';
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
      const command = state as TraceMessageCommandModel;

      if(command) {
        selectedRescueDumpServer = appSettings.rescueDumpServers.find((s) => s.name == command.serverName);
      }

      if(!command || !selectedRescueDumpServer) {
        textAreaRef.current.instance.option('value', 'An error was happened! The command has been not passed!');
        setIsShowLoadPanel(false);

        return;
      }

      await signalR.buildAsync(selectedRescueDumpServer);

      try {
        setIsShowLoadPanel(true);

        await signalR.subscribe((event: any, args: any) => {
          const textArea = textAreaRef.current.instance;
          const element = textArea.element().querySelector('textarea');
          const text = `${textArea.option('value')}${args}\r\n`;
          textArea.option('value', text);
          element.scrollTop = element.scrollHeight;
        });
        await window.externalBridge.signalR.startAsync();

        if (command.name === TraceMessageCommandName.createDump) {
          await window.externalBridge.createRescueDumpAsync(selectedRescueDumpServer);
        } else if(command.name === TraceMessageCommandName.restoration) {

          const restorationCommand = state as RestorationTraceMessageCommandModel;
          if(restorationCommand.securityPass) {

            await window.externalBridge.restoreDatabaseAsync(selectedRescueDumpServer, {
              fileId: restorationCommand.fileId,
              securityPass: restorationCommand.securityPass
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