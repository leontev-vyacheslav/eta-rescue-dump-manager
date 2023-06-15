import { Popup } from 'devextreme-react/popup';
import { DialogProps } from '../../../models/dialog-props';
import { useCommonDialogsContext } from '../../../contexts/common-dialogs-context';
import { AboutDialogContent } from './about-dialog-content';

const AboutDialog = () => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <Popup title={'About'}
      wrapperAttr={{ class: 'app-popup' }}
      dragEnabled={true}
      visible={true}
      showTitle={true}
      showCloseButton={true}
      onHidden={() => showDialog('AboutDialog', { visible: false } as DialogProps)}
      height={200}
      width={600}>
        <AboutDialogContent />
    </Popup>
  );
};

export { AboutDialog };