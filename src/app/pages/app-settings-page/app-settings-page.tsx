import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { ScrollView } from 'devextreme-react/ui/scroll-view';
import { useEffect } from 'react';
import { useSharedContext } from '../../contexts/shared-context';
import { AppSettingPageContextProvider } from './app-setting-page-context';
import { RescueDumpServerList } from './rescue-dump-server-list';

const app = window.externalBridge.app;

export const AppSettingsPage = () => {
  const { appSettings } = useSharedContext();

  useEffect(() => {
    return () => {
      app.storeAppSettingsAsync(appSettings);
    };
  }, [appSettings]);

  return (
    <ScrollView className={'app-view-container'}>
      <Form formData={appSettings}>
        <SimpleItem
          dataField={'invalidationCacheInterval'}
          isRequired={true}
          label={{ location: 'top', showColon: true, text: 'Invalidation cache interval' }}
          editorType={'dxNumberBox'}
          editorOptions={{
            showClearButton: true,
            showSpinButtons: true,
            min: 1,
            max: 10,
            onValueChanged: (e: any) => {
              // Will be directly changed appSettings without changing state
              // to suppress the lost selection of the rescue dump servers list
              appSettings.invalidationCacheInterval = e.value;
            },
          }}
        />
        <SimpleItem
          label={{ visible: false }}
          render={() => (
            <AppSettingPageContextProvider>
              <RescueDumpServerList />
            </AppSettingPageContextProvider>
          )}
        />
      </Form>
    </ScrollView>
  );
};