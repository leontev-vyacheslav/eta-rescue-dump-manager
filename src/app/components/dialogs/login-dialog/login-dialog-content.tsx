import { useCallback, useRef, useState } from 'react';
import notify from 'devextreme/ui/notify';
import { Button } from 'devextreme-react/ui/button';
import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { DialogConstants } from '../../../constants/dialogs';
import { LoginModel } from '../../../models/login-model';
import { useExternalBridgeContext } from '../../../contexts/external-bridge-context';
import { useSharedContext } from '../../../contexts/shared-context';
import { RescueDumpServerModel } from '../../../models/rescue-dump-server-model';
import { LoginDialog } from './login-dialog';
import { DialogProps } from '../../../models/dialog-props';
import { useRescueDumpListPageContext } from '../../../pages/rescue-dump-list-page/rescue-dump-list-page-context';

export const LoginDialogContent = ({ rescueDumpServer }: { rescueDumpServer: RescueDumpServerModel }) => {
  const { showDialog } = useRescueDumpListPageContext();
  const { getAuthTokenAsync } = useExternalBridgeContext();
  const { appSettings, setAppSettings } = useSharedContext();
  const formRef = useRef<Form>();

  const [currentLogin] = useState( {
      userName: rescueDumpServer.login?.userName,
      password: rescueDumpServer.login?.password,
      serverName:  rescueDumpServer.name
    } as LoginModel);

  const buttonOkClickHandlerAsync = useCallback(async () => {
    const formData = formRef.current?.instance.option('formData');
    const validationGroupResult = formRef.current?.instance.validate();

    if (validationGroupResult && validationGroupResult.brokenRules && !validationGroupResult.isValid) {
      if (validationGroupResult.brokenRules.find(() => true)) {
        validationGroupResult.validators?.find(() => true).focus();
      }
    } else {
      const login = formData as LoginModel;
      setAppSettings(previous => {
        const currentRescueDumpServer = previous.rescueDumpServers.find(s => s.id === rescueDumpServer.id);
        currentRescueDumpServer.login = login;

        return { ...previous,
          rescueDumpServers: [
            ...previous.rescueDumpServers.filter(s => s.id !== rescueDumpServer.id),
            currentRescueDumpServer
          ].sort((a, b) => a.id - b.id)
        };
      });

      const authToken = await getAuthTokenAsync(rescueDumpServer, login);

      if (authToken && authToken.token) {
        setAppSettings(previous => {
          const currentRescueDumpServer: RescueDumpServerModel = previous.rescueDumpServers.find(s => s.id === rescueDumpServer.id);
          currentRescueDumpServer.authToken = authToken;

          return {
            ...previous,
            rescueDumpServers: [
              ...previous.rescueDumpServers.filter(s => s.id !== currentRescueDumpServer.id),
              currentRescueDumpServer
            ].sort((a, b)=> a.id - b.id)
          };
        });

        notify({ message: 'The authorization was successful.' }, 'success', 5000);
      } else {
        notify({ message: 'The authorization was failed.' }, 'error', 5000);
      }
      showDialog(LoginDialog.name, { visible: false } as DialogProps);
    }
  }, [getAuthTokenAsync, rescueDumpServer, setAppSettings, showDialog]);

  return (
    <>
      <Form
        ref={formRef}
        formData={currentLogin}>
        <SimpleItem
          dataField={'serverName'}
          isRequired={true}
          label={{ location: 'top', showColon: true, text: 'Server' }}
          editorType={'dxSelectBox'}
          editorOptions={{
            displayExpr: 'name',
            valueExpr: 'name',
            dataSource: appSettings.rescueDumpServers
          }}
        />
        <SimpleItem
          dataField={'userName'}
          isRequired={true}
          label={{ location: 'top', showColon: true, text: 'User name' }}
          editorType={'dxTextBox'}
        />
        <SimpleItem
          dataField={'password'}
          isRequired={true}
          label={{ location: 'top', showColon: true, text: 'Password' }}
          editorType={'dxTextBox'}
          editorOptions={{
            mode: 'password',
            placeholder: 'Password'
          }}
        />
      </Form>
      <div className='about-dialog-content__buttons'>
        <Button
          type={'default'}
          text={DialogConstants.ButtonCaptions.Ok}
          width={DialogConstants.ButtonWidths.Normal}
          onClick={buttonOkClickHandlerAsync}
        />
        <Button
          type={'normal'}
          text={DialogConstants.ButtonCaptions.Cancel}
          width={DialogConstants.ButtonWidths.Normal}
          onClick={() => showDialog(LoginDialog.name,  { visible: false } as DialogProps)}
        />
      </div>
    </>
  );
};