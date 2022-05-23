import { Button } from 'devextreme-react/ui/button';
import { Form, SimpleItem } from 'devextreme-react/ui/form';
import { DialogConstants } from '../../../constants/dialogs';
import { useSharedContext } from '../../../contexts/shared-context';
import { useCallback, useRef, useState } from 'react';
import { TargetDialogCallback } from '../../../models/target-dialog-props';
import { DialogProps } from '../../../models/dialog-props';
import { useRescueDumpListPageContext } from '../../../pages/rescue-dump-list-page/rescue-dump-list-page-context';

export const TargetServerDialogContent = ( { callback }: {callback: TargetDialogCallback} ) => {
    const { appSettings } = useSharedContext();
    const { showDialog } = useRescueDumpListPageContext();
    const formRef = useRef<Form>();
    const [currentTargetServer] = useState<{name: string}>();

    const buttonOkClickHandlerAsync = useCallback(async () => {
      const formData = formRef.current?.instance.option('formData');
      const validationGroupResult = formRef.current?.instance.validate();

      if (validationGroupResult && validationGroupResult.brokenRules && !validationGroupResult.isValid) {
        if (validationGroupResult.brokenRules.find(() => true)) {
          validationGroupResult.validators?.find(() => true).focus();
        }
      } else {
        showDialog('TargetServerDialog',  { visible: false } as DialogProps);

        if(formData && (formData as any).name) {
          callback((formData as any).name);
        }
      }
    }, [callback, showDialog]);

    return (
      <>
      <Form
        ref={formRef}
        formData={currentTargetServer}>
         <SimpleItem
          dataField={'name'}
          isRequired={true}
          label={{ location: 'top', showColon: true, text: 'Server' }}
          editorType={'dxSelectBox'}
          editorOptions={{
            displayExpr: 'name',
            valueExpr: 'name',
            dataSource: appSettings.rescueDumpServers.filter(s => s.authToken)
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
        onClick={() => showDialog('TargetServerDialog', { visible: false } as DialogProps)}
      />
    </div>
    </>
    );
};