import './about-dialog-content.css';
import Button from 'devextreme-react/ui/button';
import { DialogConstants } from '../../../constants/dialogs';
import { AboutDialogIcon } from '../../icons';
import { useCommonDialogsContext } from '../../../contexts/common-dialogs-context';
import { DialogProps } from '../../../models/dialog-props';

export const AboutDialogContent = () => {
  const { showDialog } = useCommonDialogsContext();

  return (
    <div className='about-dialog-content'>
      <div className='about-dialog-content__info'>
        <AboutDialogIcon size={48} />
        <div className='about-dialog-content__info__text'>
          <div>ETA rescue dump manager</div>
          <div>Engineering Center Energytechaudit©</div>
          <div>All rights reserved.</div>
        </div>
      </div>
      <div className='about-dialog-content__buttons'>
        <Button
          type={'default'}
          text={DialogConstants.ButtonCaptions.Ok}
          width={DialogConstants.ButtonWidths.Normal}
          onClick={() => showDialog('AboutDialog', { visible: false } as DialogProps)}
        />
      </div>
    </div>
  );
};