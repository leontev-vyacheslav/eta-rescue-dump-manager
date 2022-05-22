import { SharedContextProvider } from './contexts/shared-context';
import { Title } from './components/title/title';
import { ExternalBridgeContextProvider } from './contexts/external-bridge-context';
import { CommonDialogsContextProvider } from './contexts/common-dialogs-context';
import { AppRouter } from './app-router';
import { useEffect } from 'react';

export const App = () => {
  useEffect(() => {
    (async () => {
      await window.externalBridge.logger.write('warn', 'The application has been started!');
    })();
  }, []);

  return (
    <SharedContextProvider>
      <ExternalBridgeContextProvider>
        <CommonDialogsContextProvider>
          <Title />
         <AppRouter />
        </CommonDialogsContextProvider>
      </ExternalBridgeContextProvider>
    </SharedContextProvider >
  );
};