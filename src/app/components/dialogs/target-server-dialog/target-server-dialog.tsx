import { Popup } from 'devextreme-react/ui/popup';
import { DialogProps } from '../../../models/dialog-props';
import { TargetServerDialogContent } from './target-server-dialog-content';
import { TargetDialogProps } from '../../../models/target-dialog-props';
import { useRescueDumpListPageContext } from '../../../pages/rescue-dump-list-page/rescue-dump-list-page-context';

export const TargetServerDialog = ( props: TargetDialogProps) => {
  const { showDialog } = useRescueDumpListPageContext();
  const { callback } = props;

  return (
    <Popup title={'Target server'}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={true}
      visible={true}
      showTitle={true}
      showCloseButton={true}
      onHidden={() => showDialog(TargetServerDialog.name, { visible: false } as DialogProps)}
      height={200}
      width={600}>
        <TargetServerDialogContent callback={callback} />
    </Popup>
  );
};