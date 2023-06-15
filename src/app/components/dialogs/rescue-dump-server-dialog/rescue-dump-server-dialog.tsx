import { Popup } from 'devextreme-react/popup';
import { DialogProps } from '../../../models/dialog-props';
import { RescueDumpServerDialogContent } from './rescue-dump-server-dialog-content';
import { useAppSettingPageContext } from '../../../pages/app-settings-page/app-setting-page-context';

export const RescueDumpServerDialog = () => {
  const { showDialog } = useAppSettingPageContext();

  return (
    <Popup title={'Rescue dump server'}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={true}
      visible={true}
      showTitle={true}
      showCloseButton={true}
      onHidden={() => showDialog('RescueDumpServerDialog', { visible: false } as DialogProps)}
      height={375}
      width={600}>
      <RescueDumpServerDialogContent />
    </Popup>
  );
};