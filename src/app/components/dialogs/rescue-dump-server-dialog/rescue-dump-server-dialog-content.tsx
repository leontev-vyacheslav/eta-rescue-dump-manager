import { Button } from 'devextreme-react/ui/button';
import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { useCallback, useRef, useState } from 'react';
import { DialogConstants } from '../../../constants/dialogs';
import { RescueDumpServerModel } from '../../../models/rescue-dump-server-model';
import { useSharedContext } from '../../../contexts/shared-context';
import { RescueDumpServerDialog } from './rescue-dump-server-dialog';
import { DialogProps } from '../../../models/dialog-props';
import { useAppSettingPageContext } from '../../../pages/app-settings-page/app-setting-page-context';

export const RescueDumpServerDialogContent = () => {
  const { setAppSettings } = useSharedContext();
  const { showDialog, selectedRescueDumpServer } = useAppSettingPageContext();
  const formRef = useRef<Form>();
  const [currentRescueDumpServer] = useState<RescueDumpServerModel>(selectedRescueDumpServer ?? {
    id: 0,
    baseUrl: '',
    displayed: true,
    authToken: null,
    login: null,
    name: '',
  });

  const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/g;

  const buttonOkClickHandlerAsync = useCallback(async () => {
    const formData = formRef.current?.instance.option('formData');
    const validationGroupResult = formRef.current?.instance.validate();

    if (validationGroupResult && validationGroupResult.brokenRules && !validationGroupResult.isValid) {
      if (validationGroupResult.brokenRules.find(() => true)) {
        validationGroupResult.validators?.find(() => true).focus();
      }
    } else {
      const currentRescueDumpServer = formData as RescueDumpServerModel;
      if(currentRescueDumpServer.id === 0) {
        setAppSettings(previous => {
          const nextId = previous.rescueDumpServers && previous.rescueDumpServers.length > 0
            ? previous.rescueDumpServers.sort((a, b) => b.id - a.id).find(() => true).id + 1
            : 1;
          currentRescueDumpServer.id = nextId;

          return { ...previous,
            lastActiveRescueDumpServerId: !(previous.rescueDumpServers && previous.rescueDumpServers.length > 0)
              ? currentRescueDumpServer.id
              : previous.lastActiveRescueDumpServerId,
            rescueDumpServers: [
              ...previous.rescueDumpServers,
              currentRescueDumpServer
            ].sort((a, b) => a.id - b.id)
          };
        });
      } else {
        setAppSettings(previous => {
          return {
            ...previous,
            rescueDumpServers: [
              ...previous.rescueDumpServers.filter(s => s.id !== currentRescueDumpServer.id),
                currentRescueDumpServer]
            .sort((a, b) => a.id - b.id)
          };
        });
      }

      showDialog(RescueDumpServerDialog.name,  { visible: false } as DialogProps);
    }
  }, [setAppSettings, showDialog]);

  return (
    <>
      <Form ref={formRef} formData={currentRescueDumpServer}>
        <SimpleItem
          dataField={'name'}
          isRequired={true}
          label={{ location: 'top', showColon: true, text: 'Server name' }}
          editorType={'dxTextBox'} editorOptions={{}}
        />
        <SimpleItem
          dataField={'baseUrl'}
          isRequired={true}
          label={{ location: 'top', showColon: true, text: 'Base URL' }}
          editorType={'dxTextBox'}
          editorOptions={{
            validationRules: [
              {
                type: 'required',
              },
              {
                type: 'pattern',
                pattern: urlRegex,
                message: 'It is not URL',
              },
            ],
          }}
        />
        <SimpleItem
          dataField={'displayed'}
          label={{ location: 'top', showColon: true, text: 'Displayed' }}
          editorType={'dxCheckBox'}
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
          onClick={() => showDialog(RescueDumpServerDialog.name,  { visible: false } as DialogProps)}
        />
      </div>
    </>
  );
};
