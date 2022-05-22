import { RescueDumpServerModel } from './rescue-dump-server-model';
import { DialogProps } from './dialog-props';

export interface LoginDialogProps extends DialogProps {
  rescueDumpServer: RescueDumpServerModel;
}
