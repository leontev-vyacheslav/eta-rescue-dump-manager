import Popup from 'devextreme-react/ui/popup';
import { useEffect } from 'react';
import { useSharedContext } from '../../../contexts/shared-context';
import { LoginDialogContent } from './login-dialog-content';
import { DialogProps } from '../../../models/dialog-props';
import { LoginDialogProps } from '../../../models/login-dialog-props';
import { useRescueDumpListPageContext } from '../../../pages/rescue-dump-list-page/rescue-dump-list-page-context';

const app = window.externalBridge.app;

export const LoginDialog = (props: LoginDialogProps ) => {
  const { showDialog } = useRescueDumpListPageContext();
  const { appSettings } = useSharedContext();
  const { rescueDumpServer } = props;

  useEffect(() => {
    return () => {
      app.storeAppSettingsAsync(appSettings);
    };
  }, [appSettings]);

  return (
    <Popup title={'Login'}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={true}
      visible={true}
      showTitle={true}
      showCloseButton={true}
      onHidden={() => showDialog('LoginDialog', { visible: false } as DialogProps)}
      height={400}
      width={600}>
        <LoginDialogContent rescueDumpServer={rescueDumpServer} />
    </Popup>
  );
};